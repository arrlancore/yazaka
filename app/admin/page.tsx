'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type CatatanHSI = Database['public']['Tables']['catatan_hsi']['Row'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    raw: 0,
    draft: 0,
    published: 0
  });
  const [recentContent, setRecentContent] = useState<CatatanHSI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch stats
      const { data: allContent } = await supabase
        .from('catatan_hsi')
        .select('status');

      const stats = allContent?.reduce((acc, item) => {
        acc.total++;
        acc[item.status as keyof typeof acc]++;
        return acc;
      }, { total: 0, raw: 0, draft: 0, published: 0 }) || { total: 0, raw: 0, draft: 0, published: 0 };

      setStats(stats);

      // Fetch recent content
      const { data: recent } = await supabase
        .from('catatan_hsi')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recent) setRecentContent(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage HSI content and track progress</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/catatan-hsi/quick-create">
                <Plus className="mr-2 h-4 w-4" />
                Quick Create
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/catatan-hsi/create">
                Detailed Form
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.total}</div>
              <p className="text-xs text-gray-600">All content items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Raw</CardTitle>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.raw}</div>
              <p className="text-xs text-gray-600">Needs processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.draft}</div>
              <p className="text-xs text-gray-600">Ready for review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.published}</div>
              <p className="text-xs text-gray-600">Live on website</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Content</CardTitle>
                <CardDescription>Latest content added to the system</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/catatan-hsi">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : recentContent.length === 0 ? (
              <p className="text-gray-600">No content yet. Create your first piece!</p>
            ) : (
              <div className="space-y-4">
                {recentContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>{item.series} - Episode {item.episode}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'published' ? 'bg-green-100 text-green-800' :
                          item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/catatan-hsi/${item.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      {item.status === 'published' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/catatan-hsi/${item.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}