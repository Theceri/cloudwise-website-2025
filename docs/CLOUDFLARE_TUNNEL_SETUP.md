# A permanent web address for your laptop

### Setting up a named Cloudflare Tunnel at `dev-callbacks.cloudwise.co.ke`

---

## What this is and why you want it

When you are building on your own machine, your site lives at
`http://localhost:3000`. That address only exists inside your computer. Safaricom
cannot see it. Paystack cannot see it. Nothing on the internet can.

A **tunnel** fixes that. It creates a public web address on the internet and
quietly forwards everything sent to it down to your laptop.

You have been using **quick tunnels** — `cloudflared tunnel --url ...` and now
ngrok. They work, but they hand you a *different random address every time they
restart*:

```
https://affordable-cheers-promotion-injuries.trycloudflare.com   ← Monday
https://2541-105-27-122-130.ngrok-free.app                       ← Tuesday
```

Every time it changes you have to update `.env.local`, restart the dev server,
and re-tell every payment provider where to find you. And when you forget — or
when the address dies without telling you, which is exactly what happened on
this project — real payments get sent into a void and vanish.

A **named tunnel** gives you one address that never changes:

```
https://dev-callbacks.cloudwise.co.ke
```

Set it up once. Use it forever, on this project and every other one. It survives
reboots, restarts and router changes.

**It is free.** Cloudflare Tunnel is on the free plan, with no limits that
matter here and no credit card.

---

## Before you start

You need these three things. You already have all of them:

| | |
|---|---|
| A domain | `cloudwise.co.ke`, bought at Truehost |
| That domain on Cloudflare | Nameservers already pointed there ✅ |
| A Cloudflare login | The account managing that DNS |

**Quick check that the domain is really active on Cloudflare.** Go to
<https://dash.cloudflare.com>, log in, and look at your list of websites. Next to
`cloudwise.co.ke` you should see a green **Active**. If it says *Pending
nameserver update*, stop here — the rest will not work until that turns Active.
(It sounds like yours is already fine, since you manage DNS there.)

> **A note on words.** Cloudflare calls a domain a **zone**, and calls the
> `dev-callbacks` part of `dev-callbacks.cloudwise.co.ke` a **subdomain**. Same
> things, different names, depending on which screen you are looking at.

---

## Step 1 — Install cloudflared

Open **PowerShell** and run:

```powershell
cloudflared --version
```

If you get a version number back (e.g. `cloudflared version 2026.x.x`), it is
already installed — you installed it earlier for the quick tunnel. **Skip to
Step 2.**

If you get *"not recognized"*, install it:

```powershell
winget install --id Cloudflare.cloudflared
```

Then **close PowerShell and open a new one** (Windows only notices the new
program in a fresh window), and check again:

```powershell
cloudflared --version
```

---

## Step 2 — Log cloudflared into your Cloudflare account

This is a one-time handshake. It proves to Cloudflare that this laptop is
allowed to create tunnels on your domain.

```powershell
cloudflared tunnel login
```

**What happens:**

1. Your web browser opens by itself, to a Cloudflare page.
2. If you are not logged in, log in.
3. You see a page headed **"Select a website"** listing your domains.
4. **Click `cloudwise.co.ke`.**
5. Click the blue **Authorize** button.
6. The browser says something like *"You have successfully logged in"*. You can
   close that tab.
7. Back in PowerShell you will see a line ending in
   `.cloudflared\cert.pem`.

That `cert.pem` file is your permission slip. It has been saved to:

```
C:\Users\PAUL\.cloudflared\cert.pem
```

> **Do not put that folder in a Git repository and do not share it.** Anyone with
> those files can create tunnels on your domain.
>
> **Cannot find the folder?** It starts with a dot, so File Explorer hides it by
> default. Paste `C:\Users\PAUL\.cloudflared` straight into the File Explorer
> address bar and press Enter.

---

## Step 3 — Create the tunnel

A tunnel needs a name. The name is just for you — pick something you will still
understand in six months. `cloudwise-dev` is a good one.

```powershell
cloudflared tunnel create cloudwise-dev
```

**What you get back:**

```
Tunnel credentials written to C:\Users\PAUL\.cloudflared\6ff42ae2-765d-4d8f-9a1b-1f2c3d4e5f60.json
Created tunnel cloudwise-dev with id 6ff42ae2-765d-4d8f-9a1b-1f2c3d4e5f60
```

**Copy that long id somewhere** — the `6ff42ae2-...` string. You need it in the
next step. Yours will be different from the example.

That `.json` file is the tunnel's password. Same rule as before: never commit it,
never share it.

To see your tunnels at any time:

```powershell
cloudflared tunnel list
```

---

## Step 4 — Write the config file

This file tells cloudflared *"when a request arrives for this address, send it to
this port on my laptop"*.

Create a file called **`config.yml`** in `C:\Users\PAUL\.cloudflared\`.

The easy way, in PowerShell:

```powershell
notepad C:\Users\PAUL\.cloudflared\config.yml
```

Notepad will say the file does not exist and offer to create it — click **Yes**.

Paste this in, **replacing the long id on line 2 with your own** from Step 3:

```yaml
tunnel: cloudwise-dev
credentials-file: C:\Users\PAUL\.cloudflared\6ff42ae2-765d-4d8f-9a1b-1f2c3d4e5f60.json

ingress:
  # Cloudwise website — Next.js dev server on port 3000
  - hostname: dev-callbacks.cloudwise.co.ke
    service: http://localhost:3000

  # Anything that does not match a rule above gets a 404.
  # This last line is required. Leave it at the bottom.
  - service: http_status:404
```

Save and close.

### Rules for this file, so it does not bite you

- **Indentation is meaningful.** Use spaces, never tabs. Copy the shape above
  exactly.
- **`- service: http_status:404` must always be the last line.** cloudflared
  refuses to start without a catch-all at the end.
- **The order matters.** cloudflared reads the rules top to bottom and uses the
  first hostname that matches.

### Check the file is valid before going further

```powershell
cloudflared tunnel ingress validate
```

You want: `Validating rules from C:\Users\PAUL\.cloudflared\config.yml` followed
by **`OK`**. If it complains, it will name the line — almost always a tab
character or a missing space after a colon.

---

## Step 5 — Point the web address at the tunnel

This creates the DNS record. You could do it by hand in the Cloudflare
dashboard, but this command does it correctly in one go:

```powershell
cloudflared tunnel route dns cloudwise-dev dev-callbacks.cloudwise.co.ke
```

You should see something like:

```
Added CNAME dev-callbacks.cloudwise.co.ke which will route to this tunnel
```

**To see what it did:** Cloudflare dashboard → `cloudwise.co.ke` → **DNS** →
**Records**. There is now a row:

| Type | Name | Content | Proxy status |
|---|---|---|---|
| CNAME | dev-callbacks | `6ff42ae2-….cfargotunnel.com` | **Proxied** (orange cloud) |

**Leave the cloud orange.** Proxied is what gives you the free HTTPS certificate,
and grey would break the tunnel entirely.

> **"An A, AAAA, or CNAME record with that host already exists."** You already
> have something at `dev-callbacks`. Delete that old record in the DNS screen,
> then run the command again.

---

## Step 6 — Start it

Make sure your app is running first, in its own PowerShell window:

```powershell
cd D:\projects\cloudwise-website-2025
npm run dev
```

Then in a **second** PowerShell window:

```powershell
cloudflared tunnel run cloudwise-dev
```

You will see a few lines of startup, then `Registered tunnel connection` four
times (it opens four connections for resilience). **Leave this window open** —
closing it closes the tunnel.

### Check it works

Open <https://dev-callbacks.cloudwise.co.ke> in your browser. You should see your
Cloudwise site, with a padlock in the address bar.

Test the actual callback endpoint, in a third PowerShell window:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "https://dev-callbacks.cloudwise.co.ke/api/payments/paybill/c2b" `
  -ContentType "application/json" -Body '{}'
```

You want back:

```
ResultCode ResultDesc
---------- ----------
         0 Accepted
```

That is your app answering, through the tunnel, from the public internet. Which
means Safaricom can reach it.

---

## Step 7 — Tell the project to use it

Open `.env.local` in this project and change one line:

```env
PUBLIC_BASE_URL=https://dev-callbacks.cloudwise.co.ke
```

**You never have to touch this line again.** That was the whole point.

Save it. Next.js picks up `.env.local` changes on its own in development, but if
anything looks stale, stop `npm run dev` with `Ctrl+C` and start it again.

---

## Step 8 (optional but recommended) — Make it start with Windows

Right now the tunnel only runs while that PowerShell window is open. You can
install it as a Windows **service**, so it starts on boot and runs in the
background forever — no window, nothing to remember.

1. Click **Start**, type `powershell`.
2. **Right-click** *Windows PowerShell* → **Run as administrator**. (This step
   needs admin rights; the normal window will refuse.)
3. Run:

```powershell
cloudflared service install
```

It reads the `config.yml` you already wrote. Check it is running:

```powershell
Get-Service cloudflared
```

`Status` should say **Running**.

**Useful commands afterwards** (all need the admin window):

```powershell
Restart-Service cloudflared      # after editing config.yml
Stop-Service cloudflared         # pause it
Start-Service cloudflared        # resume
cloudflared service uninstall    # remove it completely
```

> **Important:** once the service is running, do **not** also run
> `cloudflared tunnel run` by hand. Two copies of the same tunnel fight over the
> connection and you get random failures that are miserable to diagnose.

---

## Adding another project later

The setup above serves this one project — the Cloudwise site on port 3000. When
another project needs a public address, you have two ways to go.

### The quick way: another tunnel, same recipe

Repeat Steps 3 to 6 with a different name, subdomain and port. You do **not**
repeat Step 2 — `cloudflared tunnel login` is once per machine, and the
permission slip it wrote covers every tunnel you ever create on this domain.

```powershell
cloudflared tunnel create thrivecap-dev
cloudflared tunnel route dns thrivecap-dev dev-thrivecap.cloudwise.co.ke
```

Then give that tunnel its own config file and point `run` at it with
`--config`. Fine for occasional use; it does mean one `cloudflared` window per
project.

### The tidier way: one tunnel, several subdomains

A single tunnel can serve any number of projects at once. Add a hostname block
per project to `C:\Users\PAUL\.cloudflared\config.yml`:

```yaml
tunnel: cloudwise-dev
credentials-file: C:\Users\PAUL\.cloudflared\6ff42ae2-765d-4d8f-9a1b-1f2c3d4e5f60.json

ingress:
  - hostname: dev-callbacks.cloudwise.co.ke
    service: http://localhost:3000

  # ── add a block like this per project ──
  # - hostname: dev-thrivecap.cloudwise.co.ke
  #   service: http://localhost:3001

  # Always last.
  - service: http_status:404
```

Run the route command once for each new subdomain:

```powershell
cloudflared tunnel route dns cloudwise-dev dev-thrivecap.cloudwise.co.ke
```

Then restart the tunnel (`Restart-Service cloudflared` as admin, or `Ctrl+C` and
`cloudflared tunnel run cloudwise-dev` again).

Whichever projects happen to be running get served; the ones that are not return
a `502`, which is harmless — nothing breaks by listing a project you are not
working on today.

> **Stick to one dot.** `dev-callbacks.cloudwise.co.ke` has one level of
> subdomain, which the free Cloudflare certificate covers. Something like
> `api.dev.cloudwise.co.ke` has two, which it does **not** — you would get
> certificate warnings and Safaricom would refuse to connect. One dot before
> `cloudwise.co.ke`. Always.

---

## What this means for M-Pesa specifically

Worth being clear, because it is not obvious:

**STK push** sends its callback address with every single request, so it always
uses whatever `PUBLIC_BASE_URL` currently says. The named tunnel makes this
reliable, and that is the path to use for live end-to-end testing.

**C2B (paying the paybill directly)** is different. Safaricom stores one
confirmation URL per shortcode, and **on a live shortcode you only ever get to
set it once** — the second attempt is refused with *"URLs are already
registered"*. So:

- ❌ **Never register a tunnel address on the live paybill (4131947).** You get
  one shot, and it must be `https://cloudwise.co.ke/api/payments/paybill/c2b`.
- ✅ **Do use the tunnel for sandbox C2B testing**, where you can re-register as
  often as you like.
- ✅ **Do use it for STK push testing** on either environment.

The full detail is in `PAYMENTS_SETUP.md`, section 6.5.

---

## When something is wrong

| What you see | What it means | What to do |
|---|---|---|
| **Error 1033** or *"Argo Tunnel error"* | The tunnel is not running | Start it: `cloudflared tunnel run cloudwise-dev`, or `Start-Service cloudflared` |
| **502 Bad Gateway** | Tunnel is fine, your app is not running | Start `npm run dev`, and check the port in `config.yml` matches |
| **404 from the tunnel** | The hostname does not match any `ingress` rule | Check for a typo in `config.yml`, then restart the tunnel |
| **Certificate / privacy warning** | Two dots in the subdomain, or the DNS record is grey-clouded | Use one level of subdomain; set the record back to **Proxied** |
| **`failed to create tunnel: Duplicate tunnel`** | The name is taken | `cloudflared tunnel list`, then use the existing one or pick a new name |
| **Nothing arrives from Safaricom, but the browser works** | Cloudflare's security may be blocking a machine-to-machine POST | Dashboard → **Security** → **Events**, look for blocks on `/api/payments/…` (see below) |
| **Random dropped connections** | Two copies of the tunnel running | `Stop-Service cloudflared`, or close the stray PowerShell window |

### If Cloudflare is blocking the callbacks

Rare on the free plan, but it happens if Bot Fight Mode is on. Safaricom's
servers are not a browser, and can look like a bot.

1. Dashboard → `cloudwise.co.ke` → **Security** → **Events**.
2. Look for blocked requests to `/api/payments/…`.
3. If you find some: **Security** → **WAF** → **Custom rules** → **Create rule**.
   - Name: `Allow payment callbacks`
   - Field `URI Path` · Operator `starts with` · Value `/api/payments/`
   - Action: **Skip** → tick *All remaining custom rules* and *Bot Fight Mode*
4. Deploy.

Also make sure **Under Attack Mode** is off (Security → Settings). It challenges
every visitor with a browser check, which no payment provider can pass.

---

## The short version, for next time

Once it is set up, this is the entire routine — and after Step 8 there is no
routine at all, because it just runs.

```powershell
# Terminal 1 — your app
cd D:\projects\cloudwise-website-2025
npm run dev

# Terminal 2 — the tunnel (skip entirely if installed as a service)
cloudflared tunnel run cloudwise-dev
```

Your public address is always `https://dev-callbacks.cloudwise.co.ke`. It never
changes again.

---

## If you get stuck, tell me

Paste me the output of whichever command failed, plus:

- What `cloudflared tunnel list` prints
- What `cloudflared tunnel ingress validate` prints
- A screenshot of the DNS row for `dev-callbacks` (Type / Name / Content / Proxy
  status)

When you come to put another project on a tunnel, tell me its name and the port
it runs on and I will write the config for it.
