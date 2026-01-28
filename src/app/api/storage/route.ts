import { NextResponse } from 'next/server';
import { listBlobs, downloadBlobAsText } from '@/lib/azure-storage';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'list';
  const blob = searchParams.get('blob');

  try {
    if (action === 'list') {
      const blobs = await listBlobs();
      return NextResponse.json({ success: true, blobs });
    }

    if (action === 'preview' && blob) {
      const content = await downloadBlobAsText(blob);
      const lines = content.split('\n').slice(0, 6); // Header + 5 rows
      return NextResponse.json({
        success: true,
        blob,
        preview: lines.join('\n'),
        totalLines: content.split('\n').length,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
