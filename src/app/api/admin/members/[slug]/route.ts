import { NextResponse } from 'next/server';

import { removeMember, sanitizeMemberInput, updateMember } from '@/lib/admin-content';
import { requireAdminSession } from '@/lib/admin-access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: { slug: string } }) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = context.params.slug;
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const payload = await request.json();
  const { name, nickname, role, bio, avatar } = payload ?? {};

  if (!name || !nickname || !role || !bio || !avatar) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const sanitized = sanitizeMemberInput({ name, nickname, role, bio, avatar });
    await updateMember(slug, sanitized);
    return NextResponse.json({ slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update member';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: { slug: string } }) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = context.params.slug;
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  await removeMember(slug);
  return NextResponse.json({ success: true });
}
