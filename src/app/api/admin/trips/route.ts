import { NextResponse } from 'next/server';

import { getTrips } from '@/lib/content';
import { createTrip, sanitizeTripInput } from '@/lib/admin-content';
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

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const trips = await getTrips();
    return NextResponse.json({ trips });
  } catch {
    return NextResponse.json({ trips: [] });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const slug = await createTrip(sanitized);
    return NextResponse.json({ slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create trip';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
