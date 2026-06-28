import { NextResponse } from 'next/server';

import { writeClient } from '@/sanity/lib/writeClient';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { postId, name, email, comment, parentId } = body || {};

  // Validation
  if (!postId || typeof postId !== 'string') {
    return NextResponse.json({ error: 'Missing post.' }, { status: 400 });
  }
  if (!name || name.trim().length < 2 || name.length > 80) {
    return NextResponse.json({ error: 'Invalid name.' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 120) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }
  if (!comment || comment.trim().length < 2 || comment.length > 5000) {
    return NextResponse.json({ error: 'Invalid comment.' }, { status: 400 });
  }

  if (!writeClient.config().token) {
    return NextResponse.json(
      { error: 'Comments are not configured.' },
      { status: 500 }
    );
  }

  try {
    // Verify the referenced post exists (prevents junk references).
    const exists = await writeClient.fetch(
      '*[_type == "post" && _id == $id][0]._id',
      { id: postId }
    );
    if (!exists) {
      return NextResponse.json({ error: 'Unknown post.' }, { status: 400 });
    }

    const doc = {
      _type: 'comment',
      name: name.trim(),
      email: email.trim(),
      comment: comment.trim(),
      approved: false,
      createdAt: new Date().toISOString(),
      post: { _type: 'reference', _ref: postId },
      ...(parentId
        ? { parent: { _type: 'reference', _ref: parentId } }
        : {}),
    };

    await writeClient.create(doc);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('[comments] create failed:', err?.message);
    return NextResponse.json({ error: 'Could not save comment.' }, { status: 500 });
  }
}
