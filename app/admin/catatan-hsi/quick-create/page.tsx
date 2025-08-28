'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/auth/auth-utils';

export default function QuickCreatePage() {
  const router = useRouter();
  const [transcription, setTranscription] = useState('');
  const [processing, setProcessing] = useState(false);

  async function handleQuickCreate(e: React.FormEvent) {
    e.preventDefault();
    
    if (!transcription.trim()) {
      alert('Please enter the raw transcription');
      return;
    }

    setProcessing(true);

    try {
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Step 1: AI combines transcription (no DB yet)
      const combineResponse = await fetch('/api/admin/combine-transcription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcription: transcription.trim()
        })
      });

      const combineResult = await combineResponse.json();
      if (!combineResponse.ok) {
        throw new Error(combineResult.error || 'Transcription combining failed');
      }

      // Step 2: Save combined transcription as raw
      const timestamp = Date.now();
      const tempTitle = `Raw Content ${timestamp}`;
      const tempSlug = `raw-${timestamp}`;
      
      const { data: existingContent } = await supabase
        .from('catatan_hsi')
        .select('episode')
        .eq('series', 'Processing')
        .order('episode', { ascending: false })
        .limit(1);
      
      const nextEpisode = existingContent && existingContent.length > 0 
        ? existingContent[0].episode + 1 
        : 1;
      
      const { data: rawContent, error: insertError } = await supabase
        .from('catatan_hsi')
        .insert([{
          title: tempTitle,
          slug: tempSlug,
          series: 'Processing',
          ustad: 'TBD',
          episode: nextEpisode,
          total_episodes: 1,
          published_at: new Date().toISOString().split('T')[0],
          transcription: combineResult.combined_transcription,
          summary: 'Processing...',
          tags: [],
          source: '',
          audio_src: null, // Will be set in edit form
          created_by: user.id,
          status: 'raw'
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Step 3: AI enhances transcript and creates content
      const enhanceResponse = await fetch('/api/admin/enhance-only', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          combined_transcription: combineResult.combined_transcription
        })
      });

      const enhanceResult = await enhanceResponse.json();
      if (!enhanceResponse.ok) {
        throw new Error(enhanceResult.error || 'AI enhancement failed');
      }

      // Step 4: Update DB with enhanced content as draft
      const enhancement = enhanceResult.enhancement || enhanceResult;
      
      const { error: updateError } = await supabase
        .from('catatan_hsi')
        .update({
          title: enhancement.extracted_title,
          slug: enhancement.extracted_title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() + `-${Date.now()}`,
          transcription: enhancement.enhanced_transcription, // Correct field for transcription
          content: enhancement.enhanced_content,           // Correct field for content
          summary: enhancement.improved_summary,
          tags: enhancement.suggested_tags,
          ustad: enhancement.extracted_ustad,
          series: enhancement.extracted_series,
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', rawContent.id);

      if (updateError) throw updateError;

      // Step 5: Redirect to edit page for review
      router.push(`/admin/catatan-hsi/${rawContent.id}/edit?created=quick`);
      
    } catch (error) {
      console.error('Quick create error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
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
            <h1 className="text-2xl font-bold">Quick Create from Raw Transcription</h1>
            <p className="text-gray-600">Paste raw transcription and let AI do the magic ✨</p>
          </div>
        </div>

        {/* Quick Create Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              AI-Powered Content Creation
            </CardTitle>
            <CardDescription>
              Simply paste your raw transcription below. Our AI will:
              <br />• Combine and clean up transcription with timestamps 
              <br />• Convert to proper Arabic text for Quran/Hadith
              <br />• Generate structured article with Markdown format
              <br />• Extract title, ustad, and series information
              <br />• Follow HSI content guidelines and formatting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuickCreate} className="space-y-6">
              {/* Raw Transcription Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Raw Transcription *
                </label>
                <Textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Paste your raw transcription here...

Example:
Bismillahirrahmanirrahim. Assalamu'alaikum warahmatullahi wabarakatuh. Hari ini kita akan membahas tentang pentingnya sholat dalam kehidupan seorang muslim. Sholat adalah tiang agama..."
                  rows={15}
                  className="min-h-[300px]"
                  disabled={processing}
                  required
                />
              </div>

              {/* Processing Info */}
              {processing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="font-medium">Processing with AI...</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    This may take 30-60 seconds. Please don't close this page.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  asChild
                  disabled={processing}
                >
                  <Link href="/admin/catatan-hsi">Cancel</Link>
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={processing || !transcription.trim()}
                  className="min-w-[160px]"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create with AI
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Alternative Option */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center text-gray-600">
              <p className="mb-3">Need more control over the content details?</p>
              <Button variant="outline" asChild>
                <Link href="/admin/catatan-hsi/create">
                  Use Detailed Form Instead
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}