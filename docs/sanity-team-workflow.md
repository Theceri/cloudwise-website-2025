# Cloudwise Blog — Team & Publishing Workflow (Sanity)

A beginner-friendly guide to letting staff (e.g. your intern) **write** blog
posts with their **own** Sanity login, so **you** can review and **publish** —
without ever sharing your private Google account.

---

## 0. The one idea to understand first

- Your public website (`https://cloudwise.co.ke/blog`) **only ever shows
  _published_ posts.** Anything still a **draft** is private — it lives inside
  the Studio and is invisible to the world.
- So the workflow is always:
  1. A writer creates/edits a post and **leaves it as a draft** (clicks *Save*,
     not *Publish*).
  2. You open that draft in the Studio, read it, and either **Publish** it
     (it goes live) or send it back / discard it.
- The only real question is: *can the intern technically click "Publish"
  themselves, or is that blocked?* That depends on the **role** you give them
  (explained in Part 3). Either way, nothing reaches the website until a
  published version exists.

Everyone logs into the **same** Studio at `https://cloudwise.co.ke/studio` —
but each person uses **their own account**, and what they're allowed to do is
decided by their role.

---

## 1. Invite your intern (with their own account)

You do this once per person.

1. Go to **https://www.sanity.io/manage** and log in (your Google account).
2. Click your project (the Cloudwise blog one, project id `qv1odqol`).
3. In the top tabs, click **Members**.
4. Click the **Invite members** button (top right).
5. Type your intern's **email address** (the email they'll use — ideally a work
   email like `name@cloudwise.co.ke`, but any email works).
6. Pick a **role** from the dropdown — see **Part 3** to choose the right one.
   (If unsure for now, pick **Viewer** and change it later.)
7. Click **Invite**.
8. Your intern gets an email: *"You've been invited to a Sanity project."* They
   click the link and **create their own account** — they can:
   - "Continue with Google" using **their own** Google account, **or**
   - "Continue with GitHub", **or**
   - sign up with **email + password**.
   > 👉 This is the important part: they make their **own** login. Your Google
   > account stays private and is never shared.
9. Once they accept, they appear in your **Members** list.
10. They can now go to **https://cloudwise.co.ke/studio**, log in with **their
    own** account, and they'll see the Studio with the permissions their role
    allows.

To add **more staff** later, just repeat steps 3–9 for each person.

---

## 2. Understand the built-in roles

When inviting (or later, in Members → click a person → change role), you'll see
roles. The common ones:

| Role | Can read | Can create/edit drafts | Can **publish** | Can change settings |
|------|:--:|:--:|:--:|:--:|
| **Administrator** | ✅ | ✅ | ✅ | ✅ (this is you) |
| **Editor** | ✅ | ✅ | ✅ | ❌ |
| **Contributor** *(if shown)* | ✅ | ✅ | ❌ | ❌ |
| **Viewer** | ✅ | ❌ | ❌ | ❌ |

- **You** stay an **Administrator**.
- For an intern who should **write but not publish**, you want a role that can
  edit drafts but **cannot publish** — that's a **Contributor** (if your plan
  shows it) or a **custom role** (Part 3, Option B).

> ⚠️ Important: the **Editor** role **can publish**. If you give the intern
> Editor, they *can* push things live themselves. That's fine if you trust the
> process (Part 3, Option C), but it is not a hard block.

---

## 3. Choose how to gate publishing

Pick **one** of these three options based on your Sanity plan and how strict you
want to be.

### Option A — Use the built-in "Contributor" role (easiest, if available)
1. Manage → **Members** → **Invite members** (or edit the existing member).
2. In the role dropdown, choose **Contributor**.
3. Done. In the Studio, that person can create and edit, but the **Publish
   button is disabled** for them. Only you (Administrator) can publish.

> If you **don't** see "Contributor" in the dropdown, your plan only offers
> Administrator / Editor / Viewer — use **Option B** or **Option C**.

### Option B — Create a custom "Writer" role that can't publish (most control)
> Custom roles require Sanity's **Growth plan** or above (there's usually a free
> trial). Check **Manage → Settings → Plan / Billing**.

1. Manage → **Members** → look for a **Roles** tab/section → **Add role**
   (wording may be "Create custom role").
2. **Name** it `Writer`.
3. Start from the **Editor** template (so they can do everything an editor can).
4. In the permission list, find the **Publish** capability for documents and set
   it to **Deny / off**. (Optionally also deny **Delete** so they can't remove
   published posts.) Keep **Create**, **Read**, and **Edit/Update** allowed.
5. **Save** the role.
6. Go to **Members**, open your intern, and set their role to **Writer**.

Result: the intern can create and edit posts and save drafts, but the **Publish**
button is greyed out for them. You review and publish.

### Option C — Free-plan workflow by convention (no publishing block)
If you're on the Free plan and can't restrict publishing by role, use a simple
agreed process plus a status field so nothing slips through by accident:

1. Invite the intern as an **Editor**.
2. **Agreement:** they only ever click **Save** (which creates/updates a draft).
   They **never** click **Publish** — that's your job.
3. (Recommended) Add a small "Review status" field so drafts are clearly marked
   — see **Part 4**. The intern sets it to *"Ready for review"*; you filter by
   it, review, and publish.

This relies on trust + habit rather than a hard lock, but combined with the
status field it works well for a small team.

---

## 4. (Optional) Add a "Review status" field

This gives writers a clear way to say "this is ready" and gives you a clean
review queue. It's a tiny code change in this project.

1. Open the file `src/sanity/schemaTypes/post.js`.
2. Inside the `fields: [ ... ]` array (e.g. right after the `featured` field),
   add this field:

   ```js
   defineField({
     name: 'reviewStatus',
     title: 'Review status',
     type: 'string',
     group: 'meta',
     options: {
       list: [
         { title: 'Draft (in progress)', value: 'draft' },
         { title: 'Ready for review', value: 'review' },
         { title: 'Approved', value: 'approved' },
       ],
       layout: 'radio',
     },
     initialValue: 'draft',
   }),
   ```

3. Save the file. The new field appears automatically in the Studio (refresh
   `/studio`). Writers pick "Ready for review" when done; you look for those.
4. Commit and deploy the change so the live Studio gets it (or ask me to do it).

> This is just an organisational label. The real "is it live?" switch is still
> **Publish**.

---

## 5. Your review-and-publish routine (the part you do)

1. Go to **https://cloudwise.co.ke/studio** and log in (your account).
2. Click **Posts** in the left sidebar.
3. Posts with unpublished changes show a small **draft indicator** (a yellow/grey
   dot or "Edited" label). If you added the review-status field (Part 4), look
   for ones marked **"Ready for review."**
4. Click the post to open it. Read it. You can edit anything yourself.
5. When happy, click the green **Publish** button (bottom of the editor).
   - The post is now live on `cloudwise.co.ke/blog` within a minute or two.
6. If it's not ready, just **don't publish** — leave it as a draft, or message
   the writer. (To throw away draft changes, use the document menu **⋯ →
   Discard changes**.)

> Tip: comments left by website visitors are reviewed the same way — sidebar →
> **Comments → 🟡 Pending moderation** → open → toggle **Approved** → **Publish**.

---

## 6. Managing people over time

- **Add another staff member:** Manage → Members → Invite members → their email →
  role → Invite (Part 1).
- **Change someone's role:** Manage → Members → click the person → change role.
- **Remove someone (e.g. intern leaves):** Manage → Members → click the person →
  **Remove from project**. They instantly lose all access.
- **See who did what:** Manage → **Activity** shows a history of changes.

---

## 7. (Optional, advanced) A nicer editorial board

If you later want a proper "Assigned → In review → Approved → Published" board
with drag-and-drop and reviewer assignments, there's an official plugin called
**`sanity-plugin-workflow`**. It's more setup than the above and is overkill for
one intern, but it's there when the team grows. Ask me and I can wire it in.

---

## Quick recap

1. **Invite** the intern by email → they make **their own** login (Part 1).
2. Give them a role that **can't publish**: **Contributor** (Option A) or a
   custom **Writer** role (Option B); on Free plan, use the **convention**
   workflow (Option C).
3. They write and **Save drafts**; **you Publish** after reviewing (Part 5).
4. Repeat the invite for any future staff (Part 6).

Nothing goes live on the website until **you** publish it. ✅
