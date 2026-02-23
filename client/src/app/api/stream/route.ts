import { NextRequest } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:3001';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const vizId = searchParams.get('vizId');

  if (!sessionId || !vizId) {
    return new Response('Missing sessionId or vizId', { status: 400 });
  }

  // Fetch the upstream SSE stream without buffering
  const upstream = await fetch(
    `${BACKEND}/stream?sessionId=${sessionId}&vizId=${vizId}`,
    { cache: 'no-store' }
  );

  if (!upstream.ok || !upstream.body) {
    return new Response('Upstream stream failed', { status: 502 });
  }

  // Pipe the ReadableStream directly to the client — no buffering
  return new Response(upstream.body, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no', // disables Nginx buffering too
    },
  });
}
