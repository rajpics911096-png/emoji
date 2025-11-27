
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = body.content || '';

    // IMPORTANT: This writes to the `public` directory.
    // In a real, production environment, you would use a more secure and robust
    // storage solution like a database or a cloud storage bucket.
    // This is a simplified approach for a prototype.
    const filePath = path.join(process.cwd(), 'public', 'ads.txt');
    await fs.writeFile(filePath, content, 'utf8');

    return NextResponse.json({ message: 'ads.txt updated successfully' });
  } catch (error) {
    console.error('Failed to write ads.txt:', error);
    return NextResponse.json(
      { message: 'Failed to update ads.txt' },
      { status: 500 }
    );
  }
}
