# M-Pesa security credential & certificate handling

**What this covers:** what the M-Pesa "security credential" is, why this repo
derives it from a certificate file instead of an environment variable, how that
differs from the ThriveCap backend it was ported from, and the certificate
expiry trap that will otherwise cost you an afternoon.

**Who needs it:** anyone touching automatic settlement (sweeping money from the
Cloudwise paybill into the bank), debugging an `Invalid Initiator Information`
error, or wondering why `MPESA_SECURITY_CREDENTIAL` disappeared from `.env`.

**Related:** [`PAYMENTS_SETUP.md`](PAYMENTS_SETUP.md) §8 is the step-by-step
setup guide. This document is the *why* behind it.

---

## 1. What the security credential is, and what it is not

The security credential is **your API initiator's password, encrypted with
Safaricom's public certificate, then base64-encoded**.

It exists to answer one question: *did an authorised human approve this money
leaving the account?* Safaricom models that human as an "API initiator" — a
named operator on your paybill with their own password. You never send that
password in the clear, so you send this encrypted blob instead.

### It is settlement-only

This is the single most common misunderstanding. The credential is used by
exactly one code path:

```
src/lib/settlement/daraja-b2b.js   ← the bank sweep
        ↓ calls
src/lib/payments/daraja.js  b2bPayBill()
        ↓ calls
src/lib/payments/daraja.js  securityCredential()
```

Nothing else touches it:

| Operation | Direction | Consumer key/secret + passkey | Initiator + security credential |
|---|---|---|---|
| STK push (the PIN prompt) | Money **in** | Required | **Not used** |
| C2B (customer pays the paybill by hand) | Money **in** | Required | **Not used** |
| B2B sweep to the bank | Money **out** | Required | **Required** |

The rule: **taking** money only needs proof your app owns the paybill — that is
what the passkey does. **Sending** money out needs proof a specific authorised
operator approved it.

So if registrations, STK push, the paybill fallback and card payments all work
but settlement fails, this document is where to look. If *payments themselves*
are failing, this is not your problem.

---

## 2. How it works in this repo

Two ingredients, combined fresh on every settlement request:

| Ingredient | Where it lives | Secret? |
|---|---|---|
| Safaricom's certificate | `ProductionCertificate.cer` in the project root | **No.** A public key every integrator downloads. Committed deliberately. |
| Your initiator password | `MPESA_INITIATOR_PASSWORD` in the environment | **Yes.** The only secret in this flow. |

There is **no `MPESA_SECURITY_CREDENTIAL` setting and no `MPESA_CERTIFICATE`
setting.** Both were removed. The credential is computed at call time by
`securityCredential()` in `src/lib/payments/daraja.js`.

### Why the certificate is committed rather than configured

It is Safaricom's *public* key. Everyone who integrates downloads the identical
file from the Daraja portal. There is nothing to protect, and keeping it in the
repo means:

- one less 3,172-character value to paste into Vercel,
- rotating the initiator password means changing one short variable,
- the file is version-controlled, so you can see when it last changed.

### Which certificate gets used

Chosen by `MPESA_ENVIRONMENT`:

| `MPESA_ENVIRONMENT` | File read from the project root |
|---|---|
| `production` | `ProductionCertificate.cer` ✅ committed |
| `sandbox` (or unset) | `SandboxCertificate.cer` ⚠️ **not committed — download it if you need it** |

Safaricom publishes a **different key pair per environment** and they are not
interchangeable. Encrypting with the wrong one produces a credential Safaricom
cannot decrypt, and the resulting error never mentions certificates.

If the file is missing you get a clear error naming the exact path and the
download URL, so this cannot fail silently.

---

## 3. Three deliberate differences from the ThriveCap original

This was ported from `generate_security_credential()` in
`thrivecap-backend/utils/mpesa.py`. Three things were changed on purpose.

### 3.1 It throws instead of returning error strings

The Python version returns a *string* on every failure path:

```python
if not os.path.exists(cert_path):
    logger.error(f"Certificate file not found: {cert_path}")
    return "Certificate file not found"      # ← returned as the credential
...
except ImportError:
    return "Cryptography library not available"
except Exception as e:
    return "Error generating security credential"
```

That return value goes straight into the request body:

```python
# thrivecap-backend/routers/loans.py:792
"SecurityCredential": generate_security_credential(settings.mpesa_initiator_password, 'ProductionCertificate.cer'),
```

So when the certificate is missing, Safaricom receives the literal text
`Certificate file not found` **as the credential** and rejects it with a generic
initiator error. You then spend an hour checking the initiator name, resetting
the password in the Org portal, and re-reading the API docs — while the real
cause is a missing file the code already knew about and swallowed.

This port raises instead, naming the exact path and the download URL. A
settlement that cannot be authorised fails loudly, and the money stays safely in
the paybill.

> **Worth fixing upstream.** `loans.py:792` in ThriveCap has this exact trap on a
> live B2C disbursement path.

### 3.2 The certificate is chosen by environment, not hardcoded

The Python signature hardcodes production:

```python
def generate_security_credential(initiator_password: str, cert_path: str = 'ProductionCertificate.cer') -> str:
```

That is fine for a service that only ever runs against production. This site
runs against sandbox during setup, so it selects the certificate from
`MPESA_ENVIRONMENT` and fails loudly if the matching file is absent — rather
than silently encrypting sandbox traffic with a production key.

### 3.3 Certificate paths are static literals

The obvious implementation is:

```js
const certPath = path.join(process.cwd(), file);   // ← do not do this
```

It works, and it builds — but Turbopack emits:

> *Encountered unexpected file in NFT list. A file was traced that indicates that
> the whole project was traced unintentionally.*

A computed filesystem read resolving to the **project root** makes Next.js trace
the entire project into the serverless bundle. On Vercel that means bloated
functions and a real risk of hitting the size limit.

The fix is a static literal per branch, which was verified to clear the warning:

```js
const certPath =
  file === 'ProductionCertificate.cer'
    ? path.join(process.cwd(), 'ProductionCertificate.cer')
    : path.join(process.cwd(), 'SandboxCertificate.cer');
```

### 3.4 The certificates must be traced into the deployed function

Related, and easy to miss because **it only fails in production**. Next.js
bundles only files it can statically trace, and our path is resolved at runtime.
Without this in `next.config.mjs` the certificate sits in the repo but is absent
from the deployed function:

```js
outputFileTracingIncludes: {
  '/api/**': ['./ProductionCertificate.cer', './SandboxCertificate.cer'],
},
```

Symptom if you forget: settlement works perfectly on your laptop and throws
"certificate not found" on Vercel.

---

## 4. ⚠️ The committed certificate expired in 2018

```
subject : CN=apigee.apicaller.safaricom.co.ke, O=Safaricom Limited
issuer  : CN=Safaricom Internal Issuing CA 02
valid   : 25 Apr 2017  →  21 Mar 2018     ← EXPIRED
key     : RSA 2048-bit
```

The file was copied from ThriveCap, which has been running production B2C
against it — so as of ThriveCap's last successful disbursement, Safaricom still
held the matching private key.

**Why encryption still works:** the code only uses the certificate's *public
key*, and nothing in this flow validates expiry. `crypto.publicEncrypt()` does
not care. Expiry matters for TLS trust chains, not for "encrypt a string with
this key".

**Why it is still a risk:** if Safaricom ever rotates that key pair, every
settlement starts failing with **`Invalid Initiator Information`** — an error
that mentions neither certificates nor expiry. You would check the initiator
name, reset the password, and re-read the docs before ever suspecting the file.

### What to do about it

Next time you are in the Daraja portal, spend thirty seconds:

1. Go to <https://developer.safaricom.co.ke/APIs/Credentials>
2. Download **ProductionCertificate.cer**
3. Overwrite the one in the project root
4. Commit it

That rules out the entire class of problem permanently.

### Check the expiry at any time

```powershell
node -e "const c=require('crypto'),f=require('fs');const x=new c.X509Certificate(f.readFileSync('ProductionCertificate.cer'));console.log('subject:',x.subject.split('\n').join(' | '));console.log('valid  :',x.validFrom,'->',x.validTo);console.log('expired:',new Date(x.validTo)<new Date())"
```

---

## 5. Things that look like bugs but are not

### The credential is different every single time

Run the generation twice with the identical password and you get two completely
different 344-character strings. **Both are valid.**

RSA PKCS#1 v1.5 padding is randomised by design — it mixes fresh random bytes
into every encryption so that encrypting the same plaintext twice never produces
the same ciphertext. Safaricom decrypts both to the same password.

This is verified behaviour, not drift. Do not go looking for a caching bug.

### The credential is always exactly 344 characters

That is a consequence of the key size, not of your password. A 2048-bit RSA key
produces 256 bytes of ciphertext, and 256 bytes base64-encoded is 344
characters. A short password and a long one both yield 344 characters. If yours
is a different length, you are using a different key size — check you have the
right certificate.

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `MPESA_INITIATOR_PASSWORD is not set` | The variable is empty or missing | Set it in `.env.local` (local) or Vercel env vars (production), then restart |
| `Safaricom certificate not found at …` | Running sandbox without `SandboxCertificate.cer` in the root | Download it from the Daraja credentials page into the project root |
| `… is not a readable certificate` | Truncated download, or an HTML error page saved as `.cer` | Re-download from the Daraja portal |
| `Invalid Initiator Information` (Daraja `2001`) | Wrong password, wrong initiator name, the operator never completed its forced first-login password change — **or a rotated certificate** (§4) | Verify the initiator in the M-Pesa Org portal, then refresh the certificate |
| `The initiator is not allowed to initiate this request` | The initiator is correct, but the B2B API is not enabled on the paybill | Raise the Safaricom request in [`PAYMENTS_SETUP.md`](PAYMENTS_SETUP.md) §8.A.1 |
| Works locally, "certificate not found" on Vercel | `outputFileTracingIncludes` missing or wrong | See §3.4 |
| Settlement never even attempts | `SETTLEMENT_ENABLED` is `false`, or `SETTLEMENT_ADAPTER` is not `daraja-b2b` | See [`PAYMENTS_SETUP.md`](PAYMENTS_SETUP.md) §8.A.3 |

Every settlement attempt records its outcome. Open `/studio` → **Training** →
**Payments**, click the newest record, and read **Settlement message** — it
carries the failure reason verbatim.

---

## 7. Where the code lives

| What | File |
|---|---|
| `securityCredential()`, `certificateFile()`, `b2bPayBill()` | `src/lib/payments/daraja.js` |
| The settlement adapter that calls it | `src/lib/settlement/daraja-b2b.js` |
| Sweep orchestration, retries, idempotency | `src/lib/settlement/index.js` |
| Certificate tracing into the deployed bundle | `next.config.mjs` |
| The certificate itself | `ProductionCertificate.cer` (project root) |
| Setup walkthrough | [`docs/PAYMENTS_SETUP.md`](PAYMENTS_SETUP.md) §8 |
