import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS, OWNER } from "../../config";
import { ArrowLeft, Clock, Calendar, Tag as TagIcon } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type PostParams = { slug: string };

// ── Metadata generation ───────────────────────────────────────────────────────
export async function generateMetadata(
    { params }: { params: Promise<PostParams> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return { title: "Post not found" };
    return {
        title: `${post.title} — ${OWNER.name}`,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            type: "article",
            publishedTime: post.date,
            authors: [OWNER.name],
        },
    };
}

// ── Static params for build ───────────────────────────────────────────────────
export function generateStaticParams(): PostParams[] {
    return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Render inline code blocks (```…```) and bold (**…**) in body text
function RichBody({ text }: { text: string }) {
    const parts = text.split(/(```[\s\S]*?```|\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
        <p className="text-zinc-700 leading-relaxed text-base whitespace-pre-line">
            {parts.map((part, i) => {
                if (part.startsWith("```") && part.endsWith("```")) {
                    const code = part.slice(3, -3).trim();
                    return (
                        <code
                            key={i}
                            className="block my-4 bg-zinc-950 text-emerald-400 font-mono text-sm p-4 rounded-xl overflow-x-auto whitespace-pre">
                            {code}
                        </code>
                    );
                }
                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <strong key={i} className="font-semibold text-zinc-900">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                if (part.startsWith("`") && part.endsWith("`")) {
                    return (
                        <code
                            key={i}
                            className="bg-zinc-100 text-rose-600 font-mono text-sm px-1.5 py-0.5 rounded">
                            {part.slice(1, -1)}
                        </code>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </p>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
    params,
}: {
    params: Promise<PostParams>;
}) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug && p.published);
    if (!post) notFound();

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: "#f6f6f7" }}>
            <div className="max-w-2xl mx-auto px-6 py-12">
                {/* Back */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 text-sm mb-10 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Blog
                </Link>

                {/* Header */}
                <header className="mb-10">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-medium border border-rose-100">
                                <TagIcon className="w-2.5 h-2.5" />
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-4">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime} min read
                        </span>
                    </div>
                </header>

                {/* Summary callout */}
                <div className="bg-rose-50 border border-rose-100 rounded-xl px-5 py-4 mb-10">
                    <p className="text-rose-800 text-sm leading-relaxed italic">
                        {post.summary}
                    </p>
                </div>

                {/* Article body */}
                <article className="space-y-8">
                    {post.content.map((section, i) => (
                        <section key={i}>
                            <h2 className="text-xl font-bold text-zinc-900 mb-3">
                                {section.heading}
                            </h2>
                            <RichBody text={section.body} />
                        </section>
                    ))}
                </article>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-zinc-200 flex items-center justify-between">
                    <p className="text-sm text-zinc-400">
                        Written by{" "}
                        <span className="font-medium text-zinc-600">
                            {OWNER.name}
                        </span>
                    </p>
                    <Link
                        href="/blog"
                        className="text-sm text-rose-600 hover:text-rose-700 font-medium transition-colors">
                        ← More articles
                    </Link>
                </div>
            </div>
        </div>
    );
}
