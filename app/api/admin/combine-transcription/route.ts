import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { combineTranscriptions } from "@/lib/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return NextResponse.json({ error: `Auth error: ${error.message}` }, { status: 401 });
    }
    
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: `Profile error: ${profileError.message}` }, { status: 500 });
    }

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: `Access denied. Role: ${profile?.role}` }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { transcription } = body;

    if (!transcription) {
      return NextResponse.json(
        { error: "Missing transcription" },
        { status: 400 }
      );
    }

    // Step 1: Combine transcription
    const combineResult = await combineTranscriptions({
      transcription: transcription.trim(),
    });

    return NextResponse.json({
      success: true,
      combined_transcription: combineResult.combined_transcription,
    });
  } catch (error) {
    console.error("Combine transcription API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Combining failed" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "Transcription combining service is running",
  });
}
