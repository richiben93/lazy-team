'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Database, Pencil, PlusCircle, Trash2, Upload, FileText, Info } from 'lucide-react';

import type { Trip, AboutContent } from '@/types';

type Props = {
  trips: Trip[];
  initialAboutContent: AboutContent;
};

type Status = { type: 'idle' | 'success' | 'error'; message: string };

const emptyTripForm = {
  title: '',
  date: '',
  location: '',
  tags: '',
  coverImage: '',
  excerpt: '',
  photos: '',
  gpxContent: '',
};

export default function AdminClient({ trips, initialAboutContent }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'trips' | 'about'>('trips');

  // Trip State
  const [tripForm, setTripForm] = useState(emptyTripForm);
  const [editingTripSlug, setEditingTripSlug] = useState<string | null>(null);
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [gpxFileName, setGpxFileName] = useState('');

  // About State
  const [aboutForm, setAboutForm] = useState<AboutContent>(initialAboutContent);

  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetTripForm = () => {
    setTripForm(emptyTripForm);
    setEditingTripSlug(null);
    setGpxFile(null);
    setGpxFileName('');
  };

  const handleTripSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    const url = editingTripSlug ? `/api/admin/trips/${editingTripSlug}` : '/api/admin/trips';
    const method = editingTripSlug ? 'PUT' : 'POST';

    const formData = new FormData();
    formData.append('title', tripForm.title);
    formData.append('date', tripForm.date);
    formData.append('location', tripForm.location);
    formData.append('tags', tripForm.tags);
    formData.append('coverImage', tripForm.coverImage);
    formData.append('excerpt', tripForm.excerpt);
    formData.append('photos', tripForm.photos);

    if (gpxFile) {
      formData.append('gpxFile', gpxFile, gpxFile.name);
    } else if (tripForm.gpxContent.trim().length > 0) {
      formData.append('gpxContent', tripForm.gpxContent.trim());
    }

    const response = await fetch(url, {
      method,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      setStatus({ type: 'error', message: error.error || 'Failed to save trip' });
      setIsSubmitting(false);
      return;
    }

    setStatus({ type: 'success', message: editingTripSlug ? 'Trip updated.' : 'Trip added.' });
    resetTripForm();
    setIsSubmitting(false);
    router.refresh();
  };

  const handleTripDelete = async (slug: string) => {
    setIsSubmitting(true);
    const response = await fetch(`/api/admin/trips/${slug}`, { method: 'DELETE' });
    if (!response.ok) {
      const error = await response.json();
      setStatus({ type: 'error', message: error.error || 'Failed to delete trip' });
      setIsSubmitting(false);
      return;
    }

    setStatus({ type: 'success', message: 'Trip removed.' });
    setIsSubmitting(false);
    router.refresh();
  };

  const handleAboutSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    const response = await fetch('/api/admin/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aboutForm),
    });

    if (!response.ok) {
      const error = await response.json();
      setStatus({ type: 'error', message: error.error || 'Failed to update about page' });
      setIsSubmitting(false);
      return;
    }

    setStatus({ type: 'success', message: 'About page updated.' });
    setIsSubmitting(false);
    router.refresh();
  };

  const startEditTrip = (trip: Trip) => {
    setEditingTripSlug(trip.slug);
    setTripForm({
      title: trip.title,
      date: trip.date,
      location: trip.location,
      tags: trip.tags.join(', '),
      coverImage: trip.coverImage,
      excerpt: trip.excerpt,
      photos: trip.photos?.join(', ') ?? '',
      gpxContent: '',
    });
    setGpxFile(null);
    setGpxFileName('');
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.gpx')) {
      setStatus({ type: 'error', message: 'Please upload a .gpx file.' });
      return;
    }
    setGpxFile(file);
    setGpxFileName(file.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-700 pb-4">
        <button
          onClick={() => setActiveTab('trips')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'trips' 
              ? 'bg-amber-500/20 text-amber-300' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          Trips
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'about' 
              ? 'bg-cyan-500/20 text-cyan-300' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          About Page
        </button>
      </div>

      {status.message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            status.type === 'error'
              ? 'border-red-500/40 bg-red-500/10 text-red-200'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {status.message}
        </div>
      )}

      {activeTab === 'trips' && (
        <>
          <section className="grid grid-cols-1 gap-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <PlusCircle className="h-5 w-5 text-amber-300" />
                  <h2 className="text-xl font-semibold text-white">
                    {editingTripSlug ? 'Edit Trip' : 'Add Trip'}
                  </h2>
                </div>
                {editingTripSlug && (
                  <button
                    type="button"
                    onClick={resetTripForm}
                    className="text-xs text-slate-300 hover:text-white"
                  >
                    Cancel edit
                  </button>
                )}
              </div>
              <form onSubmit={handleTripSubmit} className="space-y-4">
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  placeholder="Trip title"
                  value={tripForm.title}
                  onChange={(event) => setTripForm({ ...tripForm, title: event.target.value })}
                  required
                />
                {editingTripSlug && (
                  <p className="text-xs text-slate-400">
                    Editing keeps the same slug. To change slug, remove and re-add.
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    value={tripForm.date}
                    onChange={(event) => setTripForm({ ...tripForm, date: event.target.value })}
                    required
                  />
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    placeholder="Location"
                    value={tripForm.location}
                    onChange={(event) => setTripForm({ ...tripForm, location: event.target.value })}
                    required
                  />
                </div>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  placeholder="Tags (comma separated)"
                  value={tripForm.tags}
                  onChange={(event) => setTripForm({ ...tripForm, tags: event.target.value })}
                />
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  placeholder="Cover image URL or /path"
                  value={tripForm.coverImage}
                  onChange={(event) => setTripForm({ ...tripForm, coverImage: event.target.value })}
                  required
                />
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  placeholder="Short excerpt"
                  value={tripForm.excerpt}
                  onChange={(event) => setTripForm({ ...tripForm, excerpt: event.target.value })}
                  required
                />
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  placeholder="Photo URLs or /paths (comma separated)"
                  value={tripForm.photos}
                  onChange={(event) => setTripForm({ ...tripForm, photos: event.target.value })}
                />

                <div
                  className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-4 text-sm text-slate-300"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleFileSelect(event.dataTransfer.files?.[0] ?? null);
                  }}
                >
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Upload className="h-4 w-4" />
                    <span>Drag & drop a GPX file here, or choose one below.</span>
                  </div>
                  {gpxFileName && (
                    <p className="mt-2 text-xs text-emerald-300">Selected: {gpxFileName}</p>
                  )}
                  {editingTripSlug && (
                    <p className="mt-2 text-xs text-slate-400">
                      Leaving GPX empty keeps the current route.
                    </p>
                  )}
                  <input
                    type="file"
                    accept=".gpx"
                    onChange={(event) => handleFileSelect(event.target.files?.[0] ?? null)}
                    className="mt-3 block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:text-white"
                  />
                </div>

                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  placeholder="Or paste GPX file content"
                  value={tripForm.gpxContent}
                  onChange={(event) => setTripForm({ ...tripForm, gpxContent: event.target.value })}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-amber-500/80 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-60"
                >
                  {editingTripSlug ? 'Save Trip' : 'Add Trip'}
                </button>
              </form>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-5 w-5 text-amber-300" />
                <h2 className="text-xl font-semibold text-white">Trips</h2>
              </div>
              <div className="space-y-3">
                {trips.length === 0 && (
                  <p className="text-sm text-slate-400">No trips yet.</p>
                )}
                {trips.map((trip) => (
                  <div key={trip.slug} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{trip.title}</p>
                      <p className="text-xs text-slate-400">{trip.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => startEditTrip(trip)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleTripDelete(trip.slug)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'about' && (
        <section className="grid grid-cols-1 gap-6">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-5 w-5 text-cyan-300" />
              <h2 className="text-xl font-semibold text-white">Edit About Page</h2>
            </div>
            <form onSubmit={handleAboutSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Page Title</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Subtitle</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    value={aboutForm.subtitle}
                    onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400">Main Description</label>
                <textarea
                  rows={6}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  value={aboutForm.description}
                  onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400">Hero Image URL</label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  value={aboutForm.image}
                  onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.value })}
                  required
                />
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Values</h3>
                <div className="space-y-4">
                  {aboutForm.values.map((value, index) => (
                    <div key={index} className="p-4 rounded-xl border border-slate-700 bg-slate-950/40 space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Value Title</label>
                        <input
                          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                          value={value.title}
                          onChange={(e) => {
                            const newValues = [...aboutForm.values];
                            newValues[index].title = e.target.value;
                            setAboutForm({ ...aboutForm, values: newValues });
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Value Description</label>
                        <textarea
                          rows={2}
                          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"
                          value={value.description}
                          onChange={(e) => {
                            const newValues = [...aboutForm.values];
                            newValues[index].description = e.target.value;
                            setAboutForm({ ...aboutForm, values: newValues });
                          }}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-cyan-500/80 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
              >
                Save Changes
              </button>
            </form>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Activity className="h-5 w-5 text-emerald-300" />
          <h2 className="text-xl font-semibold text-white">Automation</h2>
        </div>
        <p className="text-sm text-slate-300">
          Every add/update/remove action regenerates `public/data/*.json` automatically using the existing
          `scripts/generate-data.mjs` pipeline.
        </p>
      </section>
    </div>
  );
}
