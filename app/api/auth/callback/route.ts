import { NextRequest, NextResponse } from 'next/server';

// Placeholder: Supabase Auth callback route
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    // TODO: exchange code for session using Supabase server client
    return NextResponse.redirect(`${origin}/kpt`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
