'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/auth/auth-utils';

export default function CreateContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    series: '',
    ustad: '',
    episode: 1,
    total_episodes: 1,
    published_at: '',
    transcription: '',
    summary: '',
    tags: '',
    source: '',
    audio_src: ''
  });

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function handleInputChange(field: string, value: string | number) {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title
      if (field === 'title') {
        updated.slug = generateSlug(value as string);
      }
      
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Parse tags from comma-separated string
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { data, error } = await supabase
        .from('catatan_hsi')
        .insert([{
          title: formData.title,
          slug: formData.slug,
          series: formData.series,
          ustad: formData.ustad,
          episode: formData.episode,
          total_episodes: formData.total_episodes,
          published_at: formData.published_at,
          transcription: formData.transcription,
          summary: formData.summary,
          tags: tags,
          source: formData.source,
          audio_src: formData.audio_src || null,
          created_by: user.id,
          status: 'raw'
        }])
        .select()
        .single();

      if (error) throw error;

      router.push(`/admin/catatan-hsi/${data.id}/edit`);
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Error creating content. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/catatan-hsi">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Content</h1>
            <p className="text-gray-600">Add raw transcription to begin processing</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Content title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="url-friendly-slug"
                    required
                  />
                </div>
              </div>

              {/* Series Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="series">Series *</Label>
                  <Input
                    id="series"
                    value={formData.series}
                    onChange={(e) => handleInputChange('series', e.target.value)}
                    placeholder="Series name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="episode">Episode *</Label>
                  <Input
                    id="episode"
                    type="number"
                    min="1"
                    value={formData.episode}
                    onChange={(e) => handleInputChange('episode', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_episodes">Total Episodes *</Label>
                  <Input
                    id="total_episodes"
                    type="number"
                    min="1"
                    value={formData.total_episodes}
                    onChange={(e) => handleInputChange('total_episodes', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
              </div>

              {/* Other Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ustad">Ustad *</Label>
                  <Input
                    id="ustad"
                    value={formData.ustad}
                    onChange={(e) => handleInputChange('ustad', e.target.value)}
                    placeholder="Speaker name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="published_at">Published Date *</Label>
                  <Input
                    id="published_at"
                    type="date"
                    value={formData.published_at}
                    onChange={(e) => handleInputChange('published_at', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Brief summary of the content"
                  rows={3}
                  required
                />
              </div>

              {/* Transcription */}
              <div className="space-y-2">
                <Label htmlFor="transcription">Raw Transcription *</Label>
                <Textarea
                  id="transcription"
                  value={formData.transcription}
                  onChange={(e) => handleInputChange('transcription', e.target.value)}
                  placeholder="Paste the raw transcription here..."
                  rows={10}
                  required
                />
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-gray-500">Comma-separated tags</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    placeholder="Source or reference"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio_src">Audio URL (Optional)</Label>
                <Input
                  id="audio_src"
                  value={formData.audio_src}
                  onChange={(e) => handleInputChange('audio_src', e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/catatan-hsi">Cancel</Link>
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save as Raw
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}