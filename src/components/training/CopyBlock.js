'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * A prompt, with a copy button.
 *
 * The entire point of the prompt pack is that people paste these somewhere
 * else, so copying has to be one tap — selecting eight lines of pre-formatted
 * text on a phone is exactly where people give up.
 */
export function CopyBlock({ text, label = 'Copy prompt' }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Some in-app browsers block the clipboard; the text is selectable anyway.
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-[0.6rem] uppercase tracking-eyebrow text-white/40">
          Prompt
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/75 transition-colors hover:border-ember/50 hover:text-white"
        >
          {copied ? (
            <>
              <Check size={12} className="text-ember" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> {label}
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-white/80">
        <code className="whitespace-pre-wrap break-words">{text}</code>
      </pre>
    </div>
  );
}
