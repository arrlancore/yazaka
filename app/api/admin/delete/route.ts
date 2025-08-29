import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check auth
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 });
    }

    // Get content from DB first (to get slug for GitHub deletion)
    const { data: content, error: fetchError } = await supabase
      .from("catatan_hsi")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // GitHub API setup
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO;
    const githubBranch = process.env.GITHUB_BRANCH || "main";

    // Delete from GitHub if published
    if (content.status === "published" && githubToken && githubRepo) {
      const baseUrl = `https://api.github.com/repos/${githubRepo}/contents/content/catatan-hsi/${content.slug}`;
      
      const headers = {
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      };

      // First, get the current file SHAs to delete them
      try {
        const folderResponse = await fetch(`${baseUrl}`, {
          method: "GET",
          headers,
        });

        if (folderResponse.ok) {
          const files = await folderResponse.json();
          
          // Delete each file in the folder
          for (const file of files) {
            const deleteResponse = await fetch(`${baseUrl}/${file.name}`, {
              method: "DELETE",
              headers,
              body: JSON.stringify({
                message: `Delete: ${content.title} - ${file.name}`,
                sha: file.sha,
                branch: githubBranch,
                author: {
                  name: process.env.GITHUB_AUTHOR_NAME || "Bekhair Admin",
                  email: process.env.GITHUB_AUTHOR_EMAIL || "admin@bekhair.com",
                },
              }),
            });

            if (!deleteResponse.ok) {
              console.warn(`Failed to delete ${file.name} from GitHub:`, await deleteResponse.text());
            }
          }
        }
      } catch (githubError) {
        console.warn("GitHub deletion failed:", githubError);
        // Continue with database deletion even if GitHub fails
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("catatan_hsi")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(`Database deletion failed: ${deleteError.message}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Content deleted successfully",
      deletedTitle: content.title 
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete content" }, 
      { status: 500 }
    );
  }
}