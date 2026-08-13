# Deploying to Vercel, and why environment variables need a redeploy

### A beginner's guide, using this project as the example

---

## First: your PR is not missing

You went to <https://github.com/Theceri/cloudwise-website-2025/pulls> and saw nothing. That is not a bug and nothing was lost.

**GitHub's Pulls tab shows _open_ pull requests by default.** PR #5 was merged on 4 August at 10:21pm, so it moved out of that view.

To see it:

1. Go to <https://github.com/Theceri/cloudwise-website-2025/pulls>
2. Just above the list is a bar reading **`3 Open`** and **`5 Closed`** — click **Closed**
3. PR #5 is there with a **purple `Merged`** badge

Purple means merged; red means closed without merging. Yours is purple. The code is on `main`.

Or jump straight to it: <https://github.com/Theceri/cloudwise-website-2025/pull/5>

---

## The one idea that explains everything

> **Environment variables are read when the site is _built_, not when someone visits it.**

A Vercel deployment is a frozen snapshot. When Vercel builds your site it takes a copy of whatever environment variables exist **at that moment** and bakes them in. Changing a variable afterwards does nothing to a site that is already built — the snapshot has already been taken.

**So: add or change a variable → you must build again.** In Vercel's language, *redeploy*.

This is exactly what went wrong here, and it is worth seeing the evidence because it is such a clean example:

| Variable | Existed at build time? | Result on the live site |
|---|---|---|
| `CRON_SECRET` | Yes | Worked |
| `MPESA_CONSUMER_KEY` | No | Empty → "M-Pesa is not configured" |

Both were correct in Vercel's dashboard. Only one was correct on the live site, and the difference was purely *when* each one arrived relative to the build.

---

## Step 1 — Look at your environment variables

1. Go to <https://vercel.com/cloudwise/cloudwise>
2. Click **Settings** in the top row of tabs
3. Click **Environment Variables** in the left sidebar

You will see a table of names. Values show as **Encrypted** or **Sensitive** — Vercel hides them on purpose, and for the sensitive ones it can never show them again, even to you.

There should be **41 variables**, each ticked for **Production** and **Preview**.

> **Why you could not get the file upload to work.** Vercel's "import .env" reads the file literally, and yours has two things it cannot handle:
>
> - **Quotes.** `MPESA_SHORTCODE="4131947"` gets stored *with* the quote marks, so the shortcode becomes `"4131947"` instead of `4131947`. Your local Next.js strips those quotes; the uploader does not.
> - **Trailing comments.** `MPESA_PASSKEY=abc123  # the live passkey` stores the comment as part of the passkey.
>
> That is why they are now set through the CLI instead, which strips both.

---

## Step 2 — Redeploy so the variables take effect

### The clicking way

1. Go to <https://vercel.com/cloudwise/cloudwise>
2. Click the **Deployments** tab
3. Find the **top row** — the newest one. Check it says **Production** and has a green ● **Ready**
4. On the far right of that row, click the **⋯** (three dots)
5. Click **Redeploy**
6. A box appears. **Untick "Use existing Build Cache"** — you want a genuinely fresh build
7. Click **Redeploy**

Wait about two minutes. The row shows **Building**, then **Ready**.

> ### ⚠️ The trap I fell into — read this
>
> **Redeploy rebuilds _that specific row's_ code, not your newest code.**
>
> I picked a row from a list I had misread, and it turned out to be **36 days old**. Rebuilding it published 36-day-old code to cloudwise.co.ke. The training pages and payment routes vanished for about four minutes until I put it back.
>
> **Always redeploy the top row**, and check its date before you click. If the date looks old, you are on the wrong row.

### The command way

```powershell
cd D:\projects\cloudwise-website-2025
npx vercel ls --scope cloudwise cloudwise --prod
```

Read the **Age** column and take the URL from the **newest** row — this is the check I skipped. Then:

```powershell
npx vercel redeploy --scope cloudwise https://THAT-URL.vercel.app --target production
```

`--scope cloudwise` matters. Without it the CLI looks in your personal account, not the CloudWise team, and says it cannot find the deployment.

---

## Step 3 — Check it actually worked

Do not trust "Ready" alone — it only means the build compiled.

**In a browser**, open <https://www.cloudwise.co.ke/ai-training> — the training page should load.

**The real test**, in PowerShell:

```powershell
Invoke-RestMethod "https://www.cloudwise.co.ke/api/payments/mpesa/register-urls?secret=YOUR_CRON_SECRET"
```

| What comes back | What it means |
|---|---|
| A `meaning` field about URLs already being registered | ✅ **Working.** M-Pesa credentials loaded and Safaricom accepted the login |
| `"M-Pesa is not configured"` | ❌ Variables did not make it into this build — redeploy again |
| `"Unauthorised"` | Your `CRON_SECRET` does not match the one in Vercel |
| A page of HTML instead of data | ❌ You are on the wrong deployment — old code, no such route |

That last row is how I caught my mistake: an API address returning a web page means the route does not exist in whatever is live.

---

## Step 4 — If you break production, put it back

You do not need to rebuild. Vercel keeps every old deployment and can point the domain at one instantly.

### Clicking

1. **Deployments** tab
2. Find the last row you know was good — check the date
3. Click **⋯** → **Promote to Production**
4. Confirm

Takes seconds. There is no build, because that deployment was built long ago.

### Command

```powershell
npx vercel promote --scope cloudwise https://GOOD-DEPLOYMENT-URL.vercel.app
```

This is how the site came back within minutes. Worth practising once while nothing is wrong, so it is familiar when something is.

---

## What is set up right now

| | |
|---|---|
| Live site | <https://www.cloudwise.co.ke> |
| Payment methods | **M-Pesa STK prompt only** |
| Card payments | Off — `CARD_PAYMENTS_ENABLED=false` |
| Paybill fallback | Off — `PAYBILL_FALLBACK_ENABLED=false` |
| Price charged | **Ksh 2** — `TEST_PAYMENT_AMOUNT_KES=2` |
| Price displayed | Ksh 13,500 / Ksh 7,500, unchanged |
| Bank settlement | Off — `SETTLEMENT_ADAPTER=none`, so no money moves automatically |

### One variable worth understanding: `PUBLIC_BASE_URL`

Your site answers on **`www.cloudwise.co.ke`**. The version without `www` redirects there.

That matters because the code tells Safaricom where to send payment confirmations, and it built that address from `SITE_URL` in `src/lib/constants.js`, which is the **non-www** version. Safaricom would have been sent to an address that bounces — and payment systems often refuse to follow a bounce.

So `PUBLIC_BASE_URL=https://www.cloudwise.co.ke` is now set **on Production only**. Preview deployments must *not* have it: each preview needs to talk about itself, not about the live site.

---

## Testing it, the way Meg will

1. Open <https://www.cloudwise.co.ke/ai-training>
2. Click through to register and fill in the form
3. You land on the checkout page. You should see **only** the M-Pesa prompt — no card tab, no paybill number
4. Enter a real Safaricom number and click **Send M-Pesa prompt · Ksh 2**
5. A PIN request arrives on the phone. Enter the PIN
6. **Do not refresh.** The page notices the payment by itself within a few seconds and turns into "You're in 🎉"
7. Check the inbox for the receipt and the preparation pack, and `paul@cloudwise.co.ke` for the admin alert with the roster spreadsheet attached

**Use the prompt, not the paybill.** Paying the paybill directly still does not confirm anything until Safaricom repoints the C2B URLs — that is the outstanding email with them.

### If a payment does get stranded

Take the M-Pesa code from the SMS:

```powershell
Invoke-RestMethod -Method Post -Uri "https://www.cloudwise.co.ke/api/payments/paybill/reconcile" `
  -Headers @{ Authorization = "Bearer YOUR_CRON_SECRET" } `
  -ContentType "application/json" `
  -Body '{"reference":"A66DHR","receipt":"UH48Z1N6V8"}'
```

Replace the reference and receipt. Safe to run twice.

---

## When testing is finished

To go from test prices to real prices:

1. **Settings** → **Environment Variables**
2. Find `TEST_PAYMENT_AMOUNT_KES`, click **⋯** → **Remove**
3. **Redeploy the top row** (Step 2)
4. Check the checkout page now says Ksh 13,500

No code change — the real prices already live in `src/lib/training.js`. Bookings taken at Ksh 2 keep that amount on their record, so the history stays honest.

The same routine turns the other switches off when their blockers clear: delete `CARD_PAYMENTS_ENABLED` when Paystack approves, delete `PAYBILL_FALLBACK_ENABLED` when Safaricom confirms the C2B URLs. Delete, redeploy, verify. Always in that order.

---

## The short version

```
Change a variable in Vercel
        ↓
Deployments tab → top row (check the date!) → ⋯ → Redeploy
        ↓
Wait ~2 minutes for "Ready"
        ↓
Test a real address on the live site — never trust "Ready" alone
        ↓
If it is broken: ⋯ → Promote to Production on the last good row
```
