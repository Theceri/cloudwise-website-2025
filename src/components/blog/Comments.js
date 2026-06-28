'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CornerDownRight } from 'lucide-react';

import { formatDate } from '@/lib/utils';

// Build a parent→children tree from the flat approved-comments list.
function buildTree(comments) {
  const byId = new Map();
  comments.forEach((c) => byId.set(c._id, { ...c, replies: [] }));
  const roots = [];
  byId.forEach((c) => {
    if (c.parent && byId.has(c.parent)) {
      byId.get(c.parent).replies.push(c);
    } else {
      roots.push(c);
    }
  });
  return roots;
}

function Avatar({ name }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember/20 font-display text-sm text-ember">
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

function CommentNode({ node, onReply, depth = 0 }) {
  return (
    <li>
      <div className="flex gap-3">
        <Avatar name={node.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-sm font-semibold text-white">{node.name}</span>
            {node.createdAt && (
              <span className="text-xs text-white/35">{formatDate(node.createdAt)}</span>
            )}
          </div>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-white/70">
            {node.comment}
          </p>
          <button
            onClick={() => onReply(node)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-white/40 transition-colors hover:text-ember"
          >
            <CornerDownRight size={13} /> Reply
          </button>
        </div>
      </div>
      {node.replies?.length > 0 && (
        <ul className="mt-5 space-y-5 border-l border-white/10 pl-5 sm:pl-7">
          {node.replies.map((r) => (
            <CommentNode key={r._id} node={r} onReply={onReply} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Comments({ postId, comments = [] }) {
  const tree = useMemo(() => buildTree(comments), [comments]);
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill hidden fields.
    if (data.get('website')) return;

    const payload = {
      postId,
      name: data.get('name')?.toString().trim(),
      email: data.get('email')?.toString().trim(),
      comment: data.get('comment')?.toString().trim(),
      parentId: replyTo?._id || null,
    };

    if (!payload.name || !payload.email || !payload.comment) {
      toast.error('Please fill in your name, email and comment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      setReplyTo(null);
      setDone(true);
      toast.success('Thanks! Your comment is awaiting moderation.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="comments" className="mt-16 border-t border-white/10 pt-12">
      <h2 className="font-display text-2xl font-bold text-white">
        Comments {comments.length > 0 && <span className="text-white/40">({comments.length})</span>}
      </h2>

      {tree.length > 0 ? (
        <ul className="mt-8 space-y-7">
          {tree.map((node) => (
            <CommentNode key={node._id} node={node} onReply={setReplyTo} />
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-white/45">Be the first to comment.</p>
      )}

      {/* Form */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-ink-800/40 p-6 md:p-8">
        <h3 className="font-display text-lg font-semibold text-white">
          {replyTo ? `Reply to ${replyTo.name}` : 'Leave a comment'}
        </h3>
        {replyTo && (
          <button
            onClick={() => setReplyTo(null)}
            className="mt-1 text-xs text-ember hover:underline"
          >
            Cancel reply
          </button>
        )}
        {done && (
          <p className="mt-3 rounded-xl border border-ice/20 bg-ice/5 px-4 py-3 text-sm text-ice">
            Your comment was submitted and will appear once approved.
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              type="text"
              placeholder="Your name"
              required
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-ember focus:outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email (not published)"
              required
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-ember focus:outline-none"
            />
          </div>
          {/* Honeypot */}
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <textarea
            name="comment"
            rows={4}
            placeholder="Share your thoughts…"
            required
            className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-ember focus:outline-none"
          />
          <button type="submit" disabled={submitting} className="btn-ember text-sm disabled:opacity-60">
            {submitting ? 'Submitting…' : 'Post comment'}
          </button>
        </form>
      </div>
    </section>
  );
}
