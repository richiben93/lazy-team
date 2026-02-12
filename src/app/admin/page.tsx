import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { LogOut, Shield, Users, Database } from 'lucide-react';
import Link from 'next/link';

import { authOptions } from '@/lib/auth';
import { getMembers, getTrips } from '@/lib/content';
import { getAboutContent } from '@/lib/about-content';
import AdminClient from '@/app/admin/AdminClient';
import type { Member, Trip, AboutContent } from '@/types';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  let trips: Trip[] = [];
  let members: Member[] = [];
  let aboutContent: AboutContent;

  try {
    trips = await getTrips();
    members = await getMembers();
    aboutContent = getAboutContent();
  } catch {
    trips = [];
    members = [];
    aboutContent = {
      title: "The Story",
      subtitle: "We ride because it's hard.",
      description: "Default description",
      image: "",
      values: []
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-cyan-300" />
                <span className="text-xl font-semibold text-white">Admin Studio</span>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:text-cyan-300 transition-colors"
                >
                  <Database className="w-4 h-4" />
                  Content
                </Link>
                <Link 
                  href="/admin/users"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Admin Users
                </Link>
              </div>
            </div>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 border border-red-500/40 text-red-300 rounded-lg transition-colors hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Content Control</h1>
          <p className="text-slate-400">Manage trips and website content.</p>
        </div>

        <AdminClient trips={trips} initialAboutContent={aboutContent} />
      </main>
    </div>
  );
}
