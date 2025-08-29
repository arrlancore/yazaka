"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Loader2,
  Sparkles,
  FileText,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type CatatanHSI = Database["public"]["Tables"]["catatan_hsi"]["Row"];
type FormData = {
  title: string;
  slug: string;
  series: string;
  ustad: string;
  episode: number;
  total_episodes: number;
  published_at: string;
  transcription: string;
  content: string;
  summary: string;
  tags: string;
  source: string;
  audio_src: string;
  status: CatatanHSI["status"]; // 'raw' | 'draft' | 'published'
};

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [content, setContent] = useState<CatatanHSI | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    series: "",
    ustad: "",
    episode: 1,
    total_episodes: 1,
    published_at: "",
    transcription: "",
    content: "",
    summary: "",
    tags: "",
    source: "",
    audio_src: "",
    status: "raw",
  });

  useEffect(() => {
    if (params.id) {
      fetchContent(params.id as string);
    }
  }, [params.id]);

  async function fetchContent(id: string) {
    try {
      const { data, error } = await supabase
        .from("catatan_hsi")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Content not found");

      setContent(data);
      setFormData({
        title: data.title,
        slug: data.slug,
        series: data.series,
        ustad: data.ustad,
        episode: data.episode,
        total_episodes: data.total_episodes,
        published_at: data.published_at,
        transcription: data.transcription,
        content: data.content || "",
        summary: data.summary,
        tags: data.tags.join(", "),
        source: data.source,
        audio_src: data.audio_src || "",
        status: data.status,
      });
    } catch (error) {
      console.error("Error fetching content:", error);
      alert("Error loading content");
      router.push("/admin/catatan-hsi");
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(field: keyof FormData, value: string | number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function enhanceWithAI() {
    if (!formData.transcription) {
      alert("Please add transcription first");
      return;
    }

    if (!content) {
      alert("Content not loaded");
      return;
    }

    setEnhancing(true);
    try {
      const response = await fetch("/api/admin/enhance-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: content.id,
          transcription: formData.transcription,
          title: formData.title,
          ustad: formData.ustad,
          series: formData.series,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Enhancement failed");
      }

      // Update form data with enhancement results
      setFormData((prev) => ({
        ...prev,
        content: result.enhancement.enhanced_content,
        summary: result.enhancement.improved_summary,
        tags: result.enhancement.suggested_tags.join(", "),
        status: "draft",
      }));

      alert("Content enhanced successfully!");
    } catch (error) {
      console.error("Enhancement error:", error);
      alert(
        `Error enhancing content: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setEnhancing(false);
    }
  }

  async function saveContent() {
    setSaving(true);
    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const { error } = await supabase
        .from("catatan_hsi")
        .update({
          title: formData.title,
          slug: formData.slug,
          series: formData.series,
          ustad: formData.ustad,
          episode: formData.episode,
          total_episodes: formData.total_episodes,
          published_at: formData.published_at,
          transcription: formData.transcription,
          content: formData.content,
          summary: formData.summary,
          tags: tags,
          source: formData.source,
          audio_src: formData.audio_src || null,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) throw error;
      alert("Content saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving content");
    } finally {
      setSaving(false);
    }
  }

  async function publishToMDX() {
    if (!content) {
      alert("Content not loaded");
      return;
    }

    if (!formData.content || formData.content.trim().length === 0) {
      alert("Please enhance content with AI before publishing");
      return;
    }

    setPublishing(true);
    try {
      const response = await fetch("/api/admin/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: content.id,
          action: "publish",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Publishing failed");
      }

      // Update form status
      setFormData((prev) => ({ ...prev, status: "published" }));

      alert(
        `Content published successfully! Available at /catatan-hsi/${result.slug}`
      );
    } catch (error) {
      console.error("Publishing error:", error);
      alert(
        `Error publishing content: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setPublishing(false);
    }
  }

  async function unpublishFromMDX() {
    if (!content) {
      alert("Content not loaded");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to unpublish this content? It will no longer be visible on the website."
      )
    ) {
      return;
    }

    setUnpublishing(true);
    try {
      const response = await fetch("/api/admin/publish-mdx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: content.id,
          action: "unpublish",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unpublishing failed");
      }

      // Update form status
      setFormData((prev) => ({ ...prev, status: "draft" }));

      alert("Content unpublished successfully!");
    } catch (error) {
      console.error("Unpublishing error:", error);
      alert(
        `Error unpublishing content: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setUnpublishing(false);
    }
  }

  async function deleteContent() {
    if (!content) {
      alert("Content not loaded");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to permanently delete "${content.title}"? This action cannot be undone and will remove the content from both the database and GitHub repository.`
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: content.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Delete failed");
      }

      alert(`Content "${result.deletedTitle}" deleted successfully!`);
      router.push("/admin/catatan-hsi");
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        `Error deleting content: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/catatan-hsi">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{formData.title}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  className={
                    formData.status === "published"
                      ? "bg-green-100 text-green-800"
                      : formData.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {formData.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {formData.series} - Episode {formData.episode}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteContent}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
            {formData.status === "raw" && (
              <Button onClick={enhanceWithAI} disabled={enhancing}>
                {enhancing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Enhance with AI
              </Button>
            )}

            {formData.status === "draft" && (
              <Button onClick={publishToMDX} disabled={publishing}>
                {publishing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Publish
              </Button>
            )}

            {formData.status === "published" && (
              <Button
                variant="destructive"
                onClick={unpublishFromMDX}
                disabled={unpublishing}
              >
                {unpublishing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <EyeOff className="mr-2 h-4 w-4" />
                )}
                Unpublish
              </Button>
            )}

            <Button onClick={saveContent} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Raw Transcription */}
            <Card>
              <CardHeader>
                <CardTitle>Raw Transcription</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.transcription}
                  onChange={(e) =>
                    handleInputChange("transcription", e.target.value)
                  }
                  rows={10}
                  placeholder="Raw transcription..."
                />
              </CardContent>
            </Card>

            {/* Enhanced Content */}
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  rows={15}
                  placeholder="AI-enhanced content will appear here..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as FormData["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw">Raw</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Basic Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Summary</Label>
                  <Textarea
                    value={formData.summary}
                    onChange={(e) =>
                      handleInputChange("summary", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Series</Label>
                  <Input
                    value={formData.series}
                    onChange={(e) =>
                      handleInputChange("series", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Ustad</Label>
                  <Input
                    value={formData.ustad}
                    onChange={(e) => handleInputChange("ustad", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Episode</Label>
                    <Input
                      type="number"
                      value={formData.episode}
                      onChange={(e) =>
                        handleInputChange(
                          "episode",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Total</Label>
                    <Input
                      type="number"
                      value={formData.total_episodes}
                      onChange={(e) =>
                        handleInputChange(
                          "total_episodes",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Published Date</Label>
                  <Input
                    type="date"
                    value={formData.published_at}
                    onChange={(e) =>
                      handleInputChange("published_at", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Tags</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div>
                  <Label>Source</Label>
                  <Input
                    value={formData.source}
                    onChange={(e) =>
                      handleInputChange("source", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Audio URL</Label>
                  <Input
                    value={formData.audio_src}
                    onChange={(e) =>
                      handleInputChange("audio_src", e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
