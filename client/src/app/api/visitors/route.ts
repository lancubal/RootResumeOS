import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In-memory counter — persists for the lifetime of the process (single Docker container).
// Resets on redeploy, which is fine for a decorative counter.
let visitorCount = 0;

export async function GET(_req: NextRequest) {
    const cookieStore = await cookies();
    const alreadyCounted = cookieStore.get('rv_visited');

    if (!alreadyCounted) {
        visitorCount++;
    }

    const res = NextResponse.json({ count: visitorCount });

    if (!alreadyCounted) {
        res.cookies.set('rv_visited', '1', {
            maxAge: 60 * 60 * 24, // 24 hours
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });
    }

    return res;
}
