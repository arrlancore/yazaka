import { NextRequest, NextResponse } from 'next/server';
import { getR2Service } from '@/services/r2Services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    const r2Service = getR2Service();
    const fileKey = r2Service.generateFileKey(file.name, folder);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    await r2Service.uploadFile(fileKey, buffer, file.type);

    // Generate presigned URL for secure access (24 hours expiry)
    const presignedUrl = await r2Service.getPresignedDownloadUrl(fileKey, 86400);

    return NextResponse.json({
      success: true,
      fileKey,
      url: presignedUrl,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { fileKey } = await request.json();

    if (!fileKey) {
      return NextResponse.json(
        { error: 'fileKey required' },
        { status: 400 }
      );
    }

    const r2Service = getR2Service();
    await r2Service.deleteFile(fileKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('key');
    const action = searchParams.get('action') || 'presigned';

    if (!fileKey) {
      return NextResponse.json(
        { error: 'fileKey required' },
        { status: 400 }
      );
    }

    const r2Service = getR2Service();

    if (action === 'redirect') {
      const url = await r2Service.getPresignedDownloadUrl(fileKey);
      return NextResponse.redirect(url);
    }

    // Default: return presigned URL
    const presignedUrl = await r2Service.getPresignedDownloadUrl(fileKey);
    return NextResponse.json({ 
      presignedUrl,
      publicUrl: r2Service.getPublicUrl(fileKey) 
    });
  } catch (error) {
    console.error('Get error:', error);
    return NextResponse.json(
      { error: 'Failed to get file' },
      { status: 500 }
    );
  }
}