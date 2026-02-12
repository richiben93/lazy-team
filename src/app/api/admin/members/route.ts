import { NextResponse } from 'next/server';

import { getMembers } from '@/lib/content';
import { createMember, sanitizeMemberInput } from '@/lib/admin-content';
import { requireAdminSession } from '@/lib/admin-access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const members = await getMembers();
    return NextResponse.json({ members });
  } catch {
    return NextResponse.json({ members: [] });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const { name, nickname, role, bio, avatar } = payload ?? {};

  if (!name || !nickname || !role || !bio || !avatar) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const sanitized = sanitizeMemberInput({ name, nickname, role, bio, avatar });
    const slug = await createMember(sanitized);
    return NextResponse.json({ slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create member';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
