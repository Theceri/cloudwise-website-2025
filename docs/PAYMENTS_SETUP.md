# Setting up training registrations and payments

This guide takes you from a fresh checkout to a real person registering on the
website, paying by M-Pesa, the money landing in the Cloudwise Equity account,
and everyone getting the right email.

**Written for a beginner.** Every step says where to go, what to click, and what
to paste. If a step confuses you, do not skip it — the later steps depend on it.

**Time needed:** about 90 minutes of your own work, plus waiting time for
Safaricom and Paystack to approve things (a few hours to a few days).

---

## Contents

1. [How the whole thing works](#1-how-the-whole-thing-works)
2. [Before you start](#2-before-you-start)
3. [Sanity — where registrations are stored](#3-sanity--where-registrations-are-stored)
4. [Resend — sending email](#4-resend--sending-email)
5. [A tunnel, so payment providers can reach your laptop](#5-a-tunnel-so-payment-providers-can-reach-your-laptop)
6. [M-Pesa (Daraja) — taking payments](#6-m-pesa-daraja--taking-payments)
7. [Paystack — taking card payments](#7-paystack--taking-card-payments)
8. [Getting the money into the Equity account](#8-getting-the-money-into-the-equity-account)
9. [Scheduled emails (reminders and the 5pm round-up)](#9-scheduled-emails-reminders-and-the-5pm-round-up)
10. [Going live on Vercel](#10-going-live-on-vercel)
11. [The full end-to-end test](#11-the-full-end-to-end-test)
12. [When something goes wrong](#12-when-something-goes-wrong)

---

## 1. How the whole thing works

Someone signs up and pays. Here is every step, and who does it:

```
  Person fills the form on the website
              │
              ▼
  We save a registration and give it a reference like CWI-7F3K2M
              │
              ├──► Email to them:  "you're nearly in, here's how to pay"
              └──► Email to you:   "new signup" + the full roster so far
              │
              ▼
  They pay — one of two ways:
     • M-Pesa: a PIN prompt on their phone (or they pay the paybill by hand)
     • Card:   Paystack's secure checkout
              │
              ▼
  The provider tells our website the payment succeeded
              │
              ├──► Email to them:  receipt + confirmed seat
              ├──► Email to them:  the preparation pack
              ├──► Email to you:   "payment received" + the full roster
              └──► The money is swept into the Cloudwise bank account
              │
              ▼
  3 days before, and the day before:  reminder emails
  The day after it ends:              the follow-up toolkit email
  Every day at 5pm:                   the round-up email to you
```

**There is no separate backend.** All of it runs inside this Next.js website, in
`src/app/api/*`. You deploy the site and everything above comes with it.

### The one thing to understand about the money

M-Pesa payments go to the **Cloudwise paybill**. Card payments go to **Paystack**.
These are two different pots:

- **Card money** sits in your Paystack balance, and Paystack pays it into your
  bank on its own schedule. Nothing for us to do.
- **M-Pesa money** sits in the Cloudwise paybill. To get it into Equity
  automatically, the website sends it there itself — that is section 8.

---

## 2. Before you start

Open a text file on your computer called `my-keys.txt`. As you go through this
guide you will collect about fifteen secret values. Paste each one into that
file as you get it, with a label. At the end you will copy them all into one
place at once.

> **Keep that file private.** These keys can move real money. Never paste them
> into WhatsApp, never commit them to git, never email them.

You also need:

- The project open on your computer: `D:\projects\cloudwise-website-2025`
- Node.js installed (you already have it — the website runs)
- A terminal. On Windows, use **PowerShell**.

### Where the keys eventually go

There are two places:

| Where | What for | How |
|---|---|---|
| `.env.local` in the project folder | Testing on your own computer | Open the file in a text editor |
| Vercel → Project → Settings → Environment Variables | The live website | Paste them in the browser |

`.env.local` already exists and already has the new lines in it, waiting to be
filled. `.env.example` is the master list with comments — look there if you
forget what a setting does.

---

## 3. Sanity — where registrations are stored

Registrations, payments and the roster all live in Sanity, which the blog
already uses. You do not need a new account. You only need to be sure the write
token is present.

1. Open `.env.local` in the project folder.
2. Find the line `SANITY_API_WRITE_TOKEN=`. If there is a long value after the
   `=`, you are done — skip to section 4.
3. If it is empty: go to <https://www.sanity.io/manage>, click your project,
   then **API** in the left menu, then the **Tokens** tab.
4. Click **Add API token**. Name it `website-writes`. Set permissions to
   **Editor**. Click **Save**.
5. Copy the token that appears — **it is shown only once**. Paste it after
   `SANITY_API_WRITE_TOKEN=` in `.env.local`.

**How to check it worked:** run `npm run dev`, open
<http://localhost:3000/studio>, and look at the left menu. You should now see a
**Training** section with "Women Biz360 masterclass", "Individual cohorts",
"Paid", "Awaiting payment" and "Payments" inside it. That is your admin screen —
every registration will appear there.

---

## 4. Resend — sending email

Resend delivers every email in the flow. The free tier is enough to start.

### 4.1 Create the account

1. Go to <https://resend.com> and click **Sign up**. Use your Cloudwise email.
2. Verify your email address when the confirmation arrives.

### 4.2 Add your domain

This is what makes emails arrive in the inbox rather than spam.

1. In Resend, click **Domains** in the left menu, then **Add Domain**.
2. Type `cloudwise.co.ke` and click **Add**.
3. Resend now shows a table of DNS records — usually three: one `MX` and two
   `TXT` records (DKIM and SPF).
4. Open a second browser tab and log in to wherever `cloudwise.co.ke` is managed
   (your domain registrar or hosting control panel). Find **DNS** or **DNS Zone
   Editor**.
5. For each row Resend shows you, add a matching record:
   - **Type** — copy from Resend (`MX`, `TXT`)
   - **Name / Host** — copy from Resend. If your panel already appends the
     domain, enter only the part before `.cloudwise.co.ke`.
   - **Value / Points to** — copy from Resend exactly, including any quotes
   - **Priority** — only for the MX record; copy the number from Resend
6. Save each record.
7. Go back to Resend and click **Verify DNS Records**. It usually takes 5–30
   minutes. Click it again after a coffee. When all rows go green, you are done.

> If verification is still failing after an hour, the most common cause is the
> **Name** field: you entered `send.cloudwise.co.ke` where the panel wanted just
> `send`. Check what your existing records look like and match that style.

### 4.3 Get the API key

1. Click **API Keys** in the left menu, then **Create API Key**.
2. Name it `cloudwise-website`. Permission: **Sending access**. Click **Add**.
3. Copy the key (starts with `re_`) into `my-keys.txt` as `RESEND_API_KEY`.

### 4.4 Fill in the settings

In `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Cloudwise Training <training@cloudwise.co.ke>
EMAIL_REPLY_TO=hello@cloudwise.co.ke
ADMIN_EMAILS=paul@cloudwise.co.ke,meg@elevatesmes.co.ke
```

`ADMIN_EMAILS` is who gets the "new signup" alerts and the 5pm round-up.
Separate addresses with commas, no spaces needed. **Put your partner's address
here** — that is how Women Biz360 Hub sees their own signups.

You also need a `CRON_SECRET` before the next step. Make one up — any long
random string. For example:

```env
CRON_SECRET=8f3a91c47b2e4d6f9a1c8e5b3d7f2a90
```

### 4.5 Test it — send yourself every email

Start the site:

```powershell
npm run dev
```

Then in your browser, open (replacing the secret with yours):

```
http://localhost:3000/api/test/emails?secret=8f3a91c47b2e4d6f9a1c8e5b3d7f2a90
```

You will see a list of every email the system sends. To **look at one** without
sending it, add `&template=` and a name:

```
http://localhost:3000/api/test/emails?secret=YOUR_SECRET&template=welcome-pack
```

That renders the email in your browser exactly as it will arrive.

To **actually send all of them to yourself**, open a second PowerShell window
and run:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/test/emails?secret=YOUR_SECRET" `
  -ContentType "application/json" `
  -Body '{"to":"you@example.com"}'
```

Check your inbox. You should get thirteen emails, each with `[TEST]` at the
front of the subject. Read them on your phone as well as your laptop — that is
where most people will read them.

**If nothing arrives:** look at the PowerShell window running `npm run dev`. A
line starting `[email]` will tell you what went wrong. The usual causes are a
mistyped API key, or the domain not yet verified in Resend.

---

## 5. A tunnel, so payment providers can reach your laptop

Safaricom and Paystack need to send messages *to* your website when a payment
finishes. They cannot reach `localhost` — that address only exists on your own
machine. A tunnel gives your laptop a temporary public web address.

**You only need this while testing on your computer.** On the live site, the
real domain is used automatically.

### Install and run it

The easiest option is Cloudflare's, which needs no account:

```powershell
winget install --id Cloudflare.cloudflared
```

Then, with `npm run dev` already running in another window:

```powershell
cloudflared tunnel --url http://localhost:3000
```

It prints something like:

```
Your quick Tunnel has been created! Visit it at:
https://tasty-blue-panda-1234.trycloudflare.com
```

Copy that `https://...` address into `.env.local`:

```env
PUBLIC_BASE_URL=https://tasty-blue-panda-1234.trycloudflare.com
```

**Then stop and restart `npm run dev`** — environment variables are only read at
startup.

> **The address changes every time you restart the tunnel.** Whenever you
> restart it, paste the new address into `.env.local`, restart `npm run dev`,
> and update the callback URLs in Paystack. This is annoying but temporary.
>
> `ngrok` (<https://ngrok.com>) works the same way and gives a stable address on
> a paid plan, if you find yourself doing this a lot.

---

## 6. M-Pesa (Daraja) — taking payments

### 6.1 Create a Daraja account and app

1. Go to <https://developer.safaricom.co.ke> and click **Sign Up**. Use your
   Cloudwise email. Verify the email when it arrives.
2. Log in, click your name in the top right, then **My Apps**.
3. Click **Add a new app**.
4. Name it `Cloudwise Website`.
5. Tick these products:
   - **Lipa Na M-Pesa Sandbox** (this is the STK push — the PIN prompt)
   - **M-Pesa Sandbox** (this covers the rest)
6. Click **Create App**.
7. Click the app you just made. You will see **Consumer Key** and **Consumer
   Secret**, each with a "show" eye icon. Copy both into `my-keys.txt`.

### 6.2 Get the sandbox test credentials

1. In the left menu, click **APIs**, then **Simulator**, then look for the
   **Lipa Na M-Pesa Online** section. There is also a **Test Credentials** page
   under your account menu.
2. Note down:
   - **Shortcode 1**: usually `174379` — the sandbox paybill
   - **Lipa Na Mpesa Online Passkey**: a long string starting `bfb279f9...`
   - **Test MSISDN**: `254708374149` — the fake phone number that always works

### 6.3 Fill in the settings

In `.env.local`:

```env
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=paste_your_consumer_key
MPESA_CONSUMER_SECRET=paste_your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=paste_the_long_passkey
MPESA_DISPLAY_PAYBILL=4131947
```

`MPESA_DISPLAY_PAYBILL` is the number shown to customers on the "pay by paybill"
instructions. Keep it as the real Cloudwise paybill `4131947` even in sandbox,
so you can check the instructions read correctly.

Restart `npm run dev`.

### 6.4 Test the STK push

1. Make sure your tunnel is running and `PUBLIC_BASE_URL` is set (section 5).
2. Open <http://localhost:3000/ai-training/register>.
3. Fill in the form. For the phone number, enter `0708374149` — the sandbox test
   number.
4. Submit. You land on the payment page.
5. Click **Send M-Pesa prompt**.

In sandbox, no real phone rings. Safaricom auto-completes the payment after a
few seconds and calls your tunnel. **The page should switch by itself to "You're
in"** within about ten seconds.

**What to check:**

- The page changed on its own, without you refreshing
- Open `/studio` → **Training** → **Paid** — your registration is there
- Open **Payments** — you see the transaction with the full request and response
- You got two emails (confirmation and preparation pack)
- The `ADMIN_EMAILS` addresses got a "payment received" email with the roster

**If the page sits on "Waiting for your PIN"** for over a minute, see
[section 12](#12-when-something-goes-wrong).

### 6.5 Turn on the paybill fallback

The payment page always shows the paybill and account number, for when a prompt
does not arrive. For those payments to confirm a booking automatically,
Safaricom needs to know where to send the notification.

**Register the URLs once**, by opening this address in your browser (with your
own secret and, while testing, your tunnel address):

```
https://your-tunnel.trycloudflare.com/api/payments/mpesa/register-urls?secret=YOUR_CRON_SECRET
```

You should get back `{"ok":true, ...}` showing the two URLs it registered.

Do this again on the live site once you go to production:

```
https://cloudwise.co.ke/api/payments/mpesa/register-urls?secret=YOUR_CRON_SECRET
```

> Registering is safe to repeat — Safaricom just replaces the stored URLs. On
> production paybills Safaricom sometimes has to activate C2B for you first; if
> the call returns an error mentioning the shortcode, ask them to enable
> "C2B URL registration" on 4131947.

**Then check the payment page shows:**

- The paybill `4131947`
- An account number matching the reference at the top of the page
- Both boxes copying when tapped

**What happens when someone pays by hand:**

| Situation | What the system does |
|---|---|
| Correct account number, correct amount | Confirms the booking, sends both emails, sweeps to the bank — exactly as if they had used the prompt |
| Mistyped account number | Safaricom shows them "invalid account number" before the money leaves. If validation is not active on your shortcode, the payment goes through and your admin addresses get an "unmatched payment" email so you can find them |
| Paid less than the price | The booking is **not** confirmed. Your admin addresses get a "part payment" email with how much is still owing |
| Paid twice | The second payment is rejected as already paid |

### 6.6 Going to production

Do this only once sandbox works end to end.

1. In Daraja, click **My Apps** → your app → **Go Live** (or the **Go Live** item
   in the left menu).
2. Fill in the form. You will need:
   - Your **paybill number**: `4131947`
   - The organisation's registration details
   - The **M-Pesa Org portal** username of an administrator
3. Safaricom emails you the **production passkey** once approved. This takes a
   few days.
4. When approved, update the live settings (in Vercel, not `.env.local`):

```env
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=the_production_consumer_key
MPESA_CONSUMER_SECRET=the_production_consumer_secret
MPESA_SHORTCODE=4131947
MPESA_PASSKEY=the_passkey_from_the_email
MPESA_DISPLAY_PAYBILL=4131947
```

5. **Test with a real Ksh 10 payment to yourself.** Do not trust it until real
   money has moved. You can refund yourself from the M-Pesa Org portal.

---

## 7. Paystack — taking card payments

We use Paystack for **cards only**. M-Pesa stays on Daraja, because M-Pesa money
needs to land in the Cloudwise paybill where we can sweep it to the bank
ourselves.

### 7.1 Create the account

1. Go to <https://dashboard.paystack.com> and sign up.
2. **When it asks for your country, choose Kenya.** This is what makes KES
   available. If your account is already on another country you will need a new
   integration.
3. You can use test mode immediately; a real business verification is only
   needed before you take live payments.

### 7.2 Get the test keys

1. In the dashboard, click **Settings** (bottom left), then **API Keys &
   Webhooks**.
2. Make sure the toggle at the top of the page says **Test Mode**.
3. Copy the **Test Secret Key** (starts `sk_test_`) and the **Test Public Key**
   (starts `pk_test_`) into `my-keys.txt`.

### 7.3 Set the webhook

Still on the **API Keys & Webhooks** page:

1. Find **Webhook URL**.
2. Paste your tunnel address followed by the webhook path:

   ```
   https://tasty-blue-panda-1234.trycloudflare.com/api/payments/paystack/webhook
   ```

3. Click **Save Changes**.

> Remember to update this every time your tunnel address changes, and to set it
> to `https://cloudwise.co.ke/api/payments/paystack/webhook` for the live site.

### 7.4 Fill in the settings

In `.env.local`:

```env
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
```

Restart `npm run dev`.

### 7.5 Test a card payment

1. Register again at <http://localhost:3000/ai-training/register>.
2. On the payment page, click the **Card** tab, then **Pay by card**.
3. Paystack's checkout opens. Use their test card:
   - **Number:** `4084 0840 8408 4081`
   - **Expiry:** any future date, e.g. `12/30`
   - **CVV:** `408`
   - **PIN** (if asked): `0000`
   - **OTP** (if asked): `123456`
4. You come back to the website and it says **Payment received**.

**What to check:** the same list as section 6.4 — Studio, emails, admin alert.
The payment record's provider should read `paystack`, and its settlement state
should read **Not applicable** (card money settles through Paystack, not us).

### 7.6 Going live

1. Complete Paystack's business verification (**Settings → Compliance**). They
   ask for company registration documents and a bank account.
2. Once approved, switch the dashboard to **Live Mode** and copy the live keys
   (`sk_live_`, `pk_live_`) into Vercel.
3. Set the live Webhook URL to
   `https://cloudwise.co.ke/api/payments/paystack/webhook`.

---

## 8. Getting the money into the Equity account

Now the part you specifically wanted: **money paid by M-Pesa should end up in the
Cloudwise Equity account without anyone doing anything.**

### First, the honest constraint

M-Pesa payments land in the Cloudwise paybill, which is a Safaricom account. Only
Safaricom can move money out of it. SasaPay — or any other provider — cannot
reach into it. So there are two real options, and the website supports both:

| Option | How it works | When to choose it |
|---|---|---|
| **A. Daraja B2B** | Collect on your own paybill. The website then sends the money to Equity's deposit paybill (`247247`) against your account number. One provider for everything. | **Recommended.** You already have the paybill. |
| **B. SasaPay** | Collect *and* pay out on SasaPay. Money sits in a SasaPay working account, and SasaPay sends it to Equity by bank transfer. | If SasaPay's rails turn out smoother, or you want their reporting. Requires moving M-Pesa collection off Daraja. |

Both are built. You choose with one setting. **Do not mix them** — collecting on
Daraja and settling on SasaPay cannot work, for the reason above.

### Option A — Daraja B2B (recommended)

#### 8.A.1 Ask Safaricom to enable B2B

This is the slow part, so start it early. Email your Safaricom relationship
manager, or raise a ticket at <https://developer.safaricom.co.ke> support:

> We would like the **B2B Payment Request** API (`BusinessPayBill`) enabled on
> our paybill 4131947, so that we can settle collections to our Equity Bank
> account programmatically. Please also provide the API initiator username and
> confirm the initiator password reset process.

They will give you an **Initiator Name** (an API username, e.g. `apiuser`) and
have you set an **Initiator Password** in the M-Pesa Org portal.

#### 8.A.2 Create the security credential

Safaricom will not accept your initiator password in plain text. It has to be
encrypted with their public certificate.

1. Download the production certificate from
   <https://developer.safaricom.co.ke/APIs/Credentials>. It is a file ending
   `.cer`.
2. Save it somewhere you can find it, e.g. `C:\Users\PAUL\Downloads\ProductionCertificate.cer`.
3. Turn it into one long line of text that can live in a settings file:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Users\PAUL\Downloads\ProductionCertificate.cer")) | Set-Clipboard
```

That copies the encoded certificate to your clipboard.

4. Paste it into `.env.local` after `MPESA_CERTIFICATE=`.

The website generates the encrypted credential itself from the certificate and
your initiator password. (If Safaricom instead hands you a ready-made
credential, paste that into `MPESA_SECURITY_CREDENTIAL=` and leave
`MPESA_CERTIFICATE=` empty.)

#### 8.A.3 Turn on settlement

In `.env.local`:

```env
MPESA_INITIATOR_NAME=apiuser
MPESA_INITIATOR_PASSWORD=the_password_you_set_in_the_org_portal
MPESA_CERTIFICATE=paste_the_long_base64_string

SETTLEMENT_ENABLED=true
SETTLEMENT_ADAPTER=daraja-b2b
SETTLEMENT_BANK_NAME=Equity Bank
SETTLEMENT_BANK_PAYBILL=247247
SETTLEMENT_ACCOUNT_NUMBER=your_equity_account_number
SETTLEMENT_MODE=full
SETTLEMENT_MIN_AMOUNT=0
SETTLEMENT_FLOAT_BUFFER=0
```

**Double-check `SETTLEMENT_ACCOUNT_NUMBER`.** This is where the money goes. A
typo sends it to a stranger's account.

> `247247` is Equity's paybill for deposits. If you bank elsewhere, ask that bank
> for their paybill number and use it here.

Restart `npm run dev`.

#### 8.A.4 What the settings mean

| Setting | What it does |
|---|---|
| `SETTLEMENT_MODE=full` | Sends the whole payment to the bank |
| `SETTLEMENT_MODE=percentage` + `SETTLEMENT_VALUE=90` | Sends 90%, leaves 10% in the paybill |
| `SETTLEMENT_MODE=fixed` + `SETTLEMENT_VALUE=5000` | Sends Ksh 5,000, leaves the rest |
| `SETTLEMENT_MIN_AMOUNT=500` | Ignores payments under Ksh 500, so transfer fees do not eat small amounts |
| `SETTLEMENT_FLOAT_BUFFER=2000` | Always leaves Ksh 2,000 behind as working float |

Start with `full` and zeros. Adjust once you see the transfer fees on real
transactions.

#### 8.A.5 Test it

Take a real payment (section 6.6). Then:

1. Open `/studio` → **Training** → **Payments** and click the newest one.
2. **Settlement state** should move from `queued` → `settling` → `settled` within
   a minute or two.
3. Check the Equity account. The money should be there.

If it says **failed**, read **Settlement message** on that same record — it
carries Safaricom's own reason. The website retries automatically each morning,
and emails your admin addresses so nobody finds out from a bank statement.

### Option B — SasaPay

Choose this only if you want SasaPay handling M-Pesa collection too.

1. Sign up at <https://www.sasapay.co.ke>, then log in to the developer portal at
   <https://developer.sasapay.app>.
2. Create a **Sandbox Application**. Subscribe it to **C2B / Collections** and
   **B2C**.
3. Copy the **Client ID** and **Client Secret**.
4. Get your **Merchant Code** (your SasaPay paybill/till number).
5. Ask SasaPay support to **enable bank payout channels** on your merchant —
   they are often off by default.
6. Fill in `.env.local`:

```env
SASAPAY_BASE_URL=https://sandbox.sasapay.app/api/v1
SASAPAY_CLIENT_ID=your_client_id
SASAPAY_CLIENT_SECRET=your_client_secret
SASAPAY_MERCHANT_CODE=your_merchant_code
SASAPAY_SETTLEMENT_CHANNEL=68

SETTLEMENT_ENABLED=true
SETTLEMENT_ADAPTER=sasapay
SETTLEMENT_BANK_NAME=Equity Bank
SETTLEMENT_ACCOUNT_NUMBER=your_equity_account_number
SETTLEMENT_MODE=full
```

`68` is Equity's channel code in SasaPay. For production, change
`SASAPAY_BASE_URL` to the live address SasaPay gives you.

> **A simpler alternative worth knowing about:** SasaPay can also settle to your
> bank on a schedule, configured entirely in their dashboard with no code. It is
> not instant, but it is far less to go wrong. Ask them about "automatic
> settlement" before committing to the API route.

---

## 9. Scheduled emails (reminders and the 5pm round-up)

Two jobs run automatically once the site is on Vercel:

| Job | When | What it does |
|---|---|---|
| `/api/cron/daily` | 9:00am East Africa Time | Reminders 3 days and 1 day before training; the follow-up toolkit the day after; retries any failed bank settlement |
| `/api/cron/digest` | 5:00pm East Africa Time | Emails you the day's signups plus the full roster, broken down by cohort and by track |

The schedule is already committed in `vercel.json`. The times there are written
in UTC (`0 6` and `0 14`), which is 9am and 5pm in Nairobi. **You do not need to
change anything** — this section is just so you know where it lives.

The only requirement is that `CRON_SECRET` is set in Vercel, which section 10
covers.

**To test a job by hand**, visit it in your browser with the secret:

```
http://localhost:3000/api/cron/digest?secret=YOUR_CRON_SECRET
```

You get a small summary back, and the round-up email arrives at your
`ADMIN_EMAILS` addresses.

---

## 10. Going live on Vercel

1. Go to <https://vercel.com>, open the Cloudwise project.
2. Click **Settings**, then **Environment Variables** in the left menu.
3. For **every** line in your `.env.local` that has a value, add it here:
   - **Key** — the name, e.g. `RESEND_API_KEY`
   - **Value** — the value
   - **Environment** — tick **Production** (and **Preview** if you want the
     preview deployments to work too)
   - Click **Save**
4. **Do not** add `PUBLIC_BASE_URL`. Leave it out entirely — the live domain is
   detected automatically. Setting it wrong will break every callback.
5. Use the **production** keys, not the test ones:
   - `MPESA_ENVIRONMENT=production` with the production Daraja credentials
   - `PAYSTACK_SECRET_KEY` starting `sk_live_`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` starting `pk_live_`
6. Redeploy: **Deployments** → the newest one → the `…` menu → **Redeploy**.

### Then update the provider callback URLs

| Provider | Where | Set it to |
|---|---|---|
| Paystack | Settings → API Keys & Webhooks → Webhook URL | `https://cloudwise.co.ke/api/payments/paystack/webhook` |
| Daraja | Nothing to do | The website sends its callback URL with each request |
| SasaPay | Nothing to do | Same |

### Check the cron jobs registered

In Vercel, click **Settings** → **Cron Jobs**. You should see both jobs listed
with their schedules. If the list is empty, `vercel.json` did not deploy —
check it is committed and redeploy.

---

## 11. The full end-to-end test

Do this on the **live site** with **real money** before you tell anyone about it.
Use a small amount and refund yourself afterwards.

- [ ] Open <https://cloudwise.co.ke/ai-training> — the next cohort dates show
- [ ] The navbar **AI Training** menu shows both tracks and the resources
- [ ] Click **Register & pay online**, fill the form, submit
- [ ] You receive the "you're nearly in" email within a minute
- [ ] Your admin addresses receive the "new signup" email, with the roster
- [ ] The payment page shows the right amount, dates and reference
- [ ] The paybill shows `4131947` and the account number matches the reference
- [ ] Enter your own number, click **Send M-Pesa prompt** — your phone rings
- [ ] Enter your PIN. **The page changes by itself** to "You're in"
- [ ] You receive the confirmation email and the preparation pack email
- [ ] Your admin addresses receive the "payment received" email
- [ ] `/studio` → Training → Paid shows the registration
- [ ] `/studio` → Training → Payments shows settlement state `settled`
- [ ] **The money is in the Equity account**
- [ ] Repeat once with a card, on the **Card** tab
- [ ] Repeat once paying the paybill **by hand** rather than using the prompt
- [ ] At 5pm, the round-up email arrives at your admin addresses

Only when every box is ticked should you send the registration link to anyone.

> **The paybill-by-hand test matters most.** It is the path a customer falls
> back to when their prompt does not arrive, and it only works if you ran the
> URL registration in section 6.5 **against the live site**. Test it with a real
> Ksh 10 payment to paybill 4131947 using a booking reference as the account
> number, and confirm the booking flips to Paid on its own.

---

## 12. When something goes wrong

### Where to look first

Vercel → your project → **Logs**. Filter by the failing path, e.g.
`/api/payments/mpesa/callback`. Every problem in this system logs a line
starting with the area in brackets: `[mpesa/stk]`, `[email]`, `[settlement]`.

Locally, the same messages appear in the PowerShell window running `npm run dev`.

### The payment page spins forever

The payment probably worked; the confirmation did not reach us.

1. Is your tunnel still running? They stop when the terminal closes.
2. Does `PUBLIC_BASE_URL` match the tunnel's *current* address?
3. Did you restart `npm run dev` after changing it?

The page also asks Safaricom directly every four seconds, so a lost callback
usually resolves itself within a minute. If it does not, open the registration in
`/studio` — if it says **Paid**, the person is fine and only the page is stale.

### "M-Pesa is not connected yet"

One of `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE` or
`MPESA_PASSKEY` is missing or empty. Check for a stray space after the `=`.

### Emails do not arrive

1. Check the log for `[email]` lines — they name the cause.
2. Is the domain fully verified in Resend (all rows green)?
3. Does `EMAIL_FROM` use the domain you verified? Sending from a domain you have
   not verified is rejected.
4. Check spam. If it landed there, the DNS records are incomplete.

### Someone paid but has no booking

Open `/studio` → **Training** → **Payments** and search for their M-Pesa code.

- **If the payment is there but the registration is not paid:** the callback
  arrived after something went wrong. Open the registration and note it, then
  contact them — nothing is lost.
- **If the payment is not there at all:** they paid the paybill by hand and the
  C2B URLs are not registered. Re-run section 6.5 against the live site, then
  confirm this person's payment in the M-Pesa Org portal and mark their booking
  by hand.
- **If you got an "unmatched payment" email:** they mistyped the account number.
  The email has their name, phone and M-Pesa code — call them, find their
  registration in `/studio`, and confirm it by hand.

### The bank settlement failed

Money is **safe** — it stays in the paybill. Only the transfer failed.

1. Open the payment in `/studio` and read **Settlement message**.
2. Common causes: the initiator password was reset, the account number is wrong,
   or the B2B API is not enabled on the paybill.
3. The website retries every morning at 9am. Once you fix the cause, the next run
   picks it up — you do not have to do anything by hand.

### I need to change the price or the dates

- **Price:** `src/lib/training.js`, the `priceKes` value for each track.
- **Cohort dates:** they generate themselves — the first two Saturdays of each
  month. To change the rule, edit `nthSaturday` and `buildCohort` in the same
  file.
- **The masterclass date and venue:** `src/lib/training.js`, the
  `wbh-masterclass` entry.

Everything else — the website, the emails, the admin round-up — reads from
those, so changing them in one place changes them everywhere.
