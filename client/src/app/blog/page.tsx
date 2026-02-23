"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Clock, Tag as TagIcon, X, Rss } from "lucide-react";
import { BLOG_POSTS } from "../config";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// ── Tag pill ──────────────────────────────────────────────────────────────────
function TagPill({
    text,
    active,
    onClick,
}: {
    text: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all
                ${active
                    ? "bg-rose-600 text-white border-rose-600 shadow"
                    : "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200"
                }`}>
            {text}
            {active && <X className="w-3 h-3" />}
        </button>
    );
}

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({
    post,
    index,
}: {
    post: (typeof BLOG_POSTS)[number];
    index: number;
}) {
    return (
        <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
            className="group bg-white rounded-2xl border border-zinc-100 shadow-sm p-7 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer">
            {/* Meta row */}
            <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min read
                </span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-zinc-900 leading-snug group-hover:text-rose-600 transition-colors">
                {post.title}
            </h2>

            {/* Summary */}
            <p className="text-zinc-600 text-sm leading-relaxed">
                {post.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-medium">
                        <TagIcon className="w-2.5 h-2.5" />
                        {tag}
                    </span>
                ))}
            </div>

            {/* Read more hint */}
            <div className="text-xs text-zinc-400 group-hover:text-rose-500 transition-colors font-medium pt-1 border-t border-zinc-50">
                Read article →
            </div>
        </motion.article>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogPage() {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // All unique tags
    const allTags = useMemo(() => {
        const set = new Set<string>();
        BLOG_POSTS.forEach((p) => p.tags.forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, []);

    // Filtered + sorted (newest first)
    const filtered = useMemo(() => {
        return BLOG_POSTS.filter(
            (p) =>
                p.published &&
                (!activeTag || p.tags.includes(activeTag)),
        ).sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    }, [activeTag]);

    const toggleTag = (tag: string) =>
        setActiveTag((prev) => (prev === tag ? null : tag));

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#f6f6f7" }}>
            {/* Top bar */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-zinc-200 px-6 py-4 flex items-center gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
                <div className="h-4 w-px bg-zinc-300" />
                <span className="text-zinc-400 text-sm">Blog</span>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10">
                    <div className="flex items-center gap-2 text-sm text-rose-600 font-medium mb-3">
                        <Rss className="w-4 h-4" />
                        Personal blog
                    </div>
                    <h1 className="text-4xl font-bold text-zinc-900 mb-3">Writing</h1>
                    <p className="text-zinc-500 text-lg leading-relaxed max-w-xl">
                        Thoughts on architecture, containers, developer tooling, and building
                        things that last. No medium paywalls — just plain writing.
                    </p>
                </motion.div>

                {/* Tag filters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap gap-2 mb-8">
                    {allTags.map((tag) => (
                        <TagPill
                            key={tag}
                            text={tag}
                            active={activeTag === tag}
                            onClick={() => toggleTag(tag)}
                        />
                    ))}
                </motion.div>

                {/* Results count */}
                <div className="text-xs text-zinc-400 mb-6 font-medium uppercase tracking-widest">
                    {filtered.length} post{filtered.length !== 1 ? "s" : ""}
                    {activeTag && ` tagged "${activeTag}"`}
                </div>

                {/* Posts */}
                {filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 text-zinc-400">
                        <p className="text-lg font-medium">No posts match this tag.</p>
                        <button
                            onClick={() => setActiveTag(null)}
                            className="mt-3 text-sm text-rose-500 hover:underline">
                            Clear filter
                        </button>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="space-y-6">
                            {filtered.map((post, i) => (
                                <PostCard key={post.id} post={post} index={i} />
                            ))}
                        </div>
                    </AnimatePresence>
                )}

                {/* Footer note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-zinc-300 text-xs mt-16">
                    Full articles coming soon — these are previews of upcoming posts.
                </motion.p>
            </main>
        </div>
    );
}
