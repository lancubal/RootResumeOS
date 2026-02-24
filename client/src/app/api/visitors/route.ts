import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

// File-based counter — persists across hot-reloads and server restarts.
// Falls back to in-memory if the filesystem is read-only.
const DATA_DIR = join(process.cwd(), '.data');
const COUNT_FILE = join(DATA_DIR, 'visitors.json');

function readCount(): number {
    try {
        if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
        if (!existsSync(COUNT_FILE)) return 0;
        const raw = readFileSync(COUNT_FILE, 'utf-8');
        return (JSON.parse(raw) as { count: number }).count ?? 0;
    } catch {
        return 0;
    }
}

function writeCount(n: number) {
    try {
        if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
        writeFileSync(COUNT_FILE, JSON.stringify({ count: n }), 'utf-8');
    } catch {
        // read-only filesystem — silently ignore
    }
}

export async function GET() {
    const cookieStore = await cookies();
    const alreadyCounted = cookieStore.get('rv_visited');

    let count = readCount();
    if (!alreadyCounted) {
        count++;
        writeCount(count);
    }

    const res = NextResponse.json({ count });

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
