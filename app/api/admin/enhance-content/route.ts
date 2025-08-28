import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  combineTranscriptions,
  enhanceTranscription,
} from "@/lib/ai/openrouter";
import type { Database } from "@/integrations/supabase/types";

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client for server-side authentication
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    // Check authentication
    const { data } = await supabase.auth.getSession();
    console.log(123, data);
    const { session } = data || {};
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { id, transcription, title, ustad, series } = body;

    if (!id || !transcription || !title || !ustad || !series) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Combine transcription
    console.log("Step 1: Combining transcription...");
    const combineResult = await combineTranscriptions({
      transcription,
    });

    // Step 2: Enhance content with AI
    console.log("Step 2: Enhancing content...");
    const enhancement = await enhanceTranscription({
      combined_transcription: combineResult.combined_transcription,
    });

    // Update content in database
    const { error: updateError } = await supabase
      .from("catatan_hsi")
      .update({
        transcription: combineResult.combined_transcription,
        content: enhancement.enhanced_content,
        summary: enhancement.improved_summary,
        tags: enhancement.suggested_tags,
        title: enhancement.extracted_title,
        slug:
          enhancement.extracted_title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim() + `-${Date.now()}`,
        ustad: enhancement.extracted_ustad,
        series: enhancement.extracted_series,
        status: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      enhancement: {
        ...enhancement,
        combined_transcription: combineResult.combined_transcription,
      },
    });
  } catch (error) {
    console.error("Enhancement API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enhancement failed" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: "AI enhancement service is running" });
}
