import { NextResponse } from 'next/server';

import { removeTrip, sanitizeTripInput, updateTrip } from '@/lib/admin-content';
import { requireAdminSession } from '@/lib/admin-access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function readTripPayload(request: Request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const gpxFile = formData.get('gpxFile');
    const gpxContentField = formData.get('gpxContent');
    const gpxContent = gpxFile instanceof File
      ? await gpxFile.text()
      : typeof gpxContentField === 'string'
        ? gpxContentField
        : null;

    return {
      title: formData.get('title'),
      date: formData.get('date'),
      location: formData.get('location'),
      tags: formData.get('tags'),
      coverImage: formData.get('coverImage'),
      excerpt: formData.get('excerpt'),
      photos: formData.get('photos'),
      gpxContent,
    };
  }

  return request.json();
}

export async function PUT(request: Request, context: { params: { slug: string } }) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = context.params.slug;
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const payload = await readTripPayload(request);
  const { title, date, location, tags, coverImage, excerpt, photos, gpxContent } = payload ?? {};

  if (!title || !date || !location || !coverImage || !excerpt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const tagList = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
        ? tags.split(',')
        : [];

    const photoList = Array.isArray(photos)
      ? photos
      : typeof photos === 'string'
        ? photos.split(',')
        : [];

    const sanitized = sanitizeTripInput({
      title,
      date,
      location,
      coverImage,
      excerpt,
      tags: tagList,
      photos: photoList,
      gpxContent: typeof gpxContent === 'string' ? gpxContent : null,
    });

    await updateTrip(slug, sanitized);
    return NextResponse.json({ slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update trip';
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

  await removeTrip(slug);
  return NextResponse.json({ success: true });
}
