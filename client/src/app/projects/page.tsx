"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
    ArrowLeft,
    Search,
    Github,
    ExternalLink,
    X,
    Star,
} from "lucide-react";
import { PROJECTS, type ProjectStatus } from "../config";

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<ProjectStatus, string> = {
    "Production-Ready": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "In Progress":      "bg-blue-100   text-blue-700   border-blue-200",
    "Concept":          "bg-amber-100  text-amber-700  border-amber-200",
    "Archived":         "bg-zinc-100   text-zinc-500   border-zinc-200",
};

function StatusBadge({ status }: { status: ProjectStatus }) {
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}>
            {status}
        </span>
    );
}

// ── Tag pill ──────────────────────────────────────────────────────────────────
function Tag({
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
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200"
                }`}>
            {text}
            {active && <X className="w-3 h-3" />}
        </button>
    );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({
    project,
    index,
}: {
    project: (typeof PROJECTS)[number];
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            layout
            className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    {project.featured && (
                        <Star className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
                    )}
                    <h3 className="font-bold text-zinc-900 text-base truncate">
                        {project.name}
                    </h3>
                    <span className="text-zinc-400 text-xs shrink-0">
                        {project.year}
                    </span>
                </div>
                <StatusBadge status={project.status} />
            </div>

            {/* Description */}
            <p className="text-zinc-600 text-sm leading-relaxed">
                {project.description}
            </p>

            {/* Stack */}
            <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                    <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-100 text-xs font-mono">
                        {tech}
                    </span>
                ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-xs">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 pt-1 border-t border-zinc-50">
                {project.github && (
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                    </a>
                )}
                {project.url && (
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live
                    </a>
                )}
            </div>
        </motion.div>
    );
}

// ── Category colour dot ───────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
    Web:     "bg-cyan-500",
    Backend: "bg-emerald-500",
    DevOps:  "bg-amber-500",
    Mobile:  "bg-violet-500",
    Other:   "bg-zinc-400",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
    const [query, setQuery] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // All unique tags across all projects
    const allTags = useMemo(() => {
        const set = new Set<string>();
        PROJECTS.forEach((p) => p.tags.forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, []);

    // Filtered list
    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        return PROJECTS.filter((p) => {
            const matchesQuery =
                !q ||
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.stack.some((s) => s.toLowerCase().includes(q)) ||
                p.tags.some((t) => t.toLowerCase().includes(q));
            const matchesTag = !activeTag || p.tags.includes(activeTag);
            return matchesQuery && matchesTag;
        });
    }, [query, activeTag]);

    // Group filtered projects by category, preserving categories in insertion order
    const grouped = useMemo(() => {
        const map = new Map<string, (typeof PROJECTS)[number][]>();
        filtered.forEach((p) => {
            const cat = p.category || "Other";
            if (!map.has(cat)) map.set(cat, []);
            map.get(cat)!.push(p);
        });
        return map;
    }, [filtered]);

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
                <span className="text-zinc-400 text-sm">Projects</span>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10">
                    <h1 className="text-4xl font-bold text-zinc-900 mb-3">Projects</h1>
                    <p className="text-zinc-500 text-lg max-w-xl leading-relaxed">
                        Things I&apos;ve built, explored, or am currently working on.
                        Grouped by category — search by name, tech, or tag.
                    </p>
                </motion.div>

                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, tech, or tag…"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>

                {/* Tag filters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap gap-2 mb-10">
                    {allTags.map((tag) => (
                        <Tag
                            key={tag}
                            text={tag}
                            active={activeTag === tag}
                            onClick={() => toggleTag(tag)}
                        />
                    ))}
                </motion.div>

                {/* Results count */}
                <div className="text-xs text-zinc-400 mb-6 font-medium uppercase tracking-widest">
                    {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                    {(query || activeTag) && " matching filters"}
                </div>

                {/* Grouped sections */}
                {grouped.size === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 text-zinc-400">
                        <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No projects match your search.</p>
                        <button
                            onClick={() => { setQuery(""); setActiveTag(null); }}
                            className="mt-3 text-sm text-indigo-500 hover:underline">
                            Clear filters
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-12">
                        {Array.from(grouped.entries()).map(([category, projects]) => (
                            <section key={category}>
                                {/* Category heading */}
                                <div className="flex items-center gap-2 mb-5">
                                    <span
                                        className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[category] ?? "bg-zinc-400"}`}
                                    />
                                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
                                        {category}
                                    </h2>
                                    <span className="text-xs text-zinc-300">
                                        · {projects.length}
                                    </span>
                                </div>

                                {/* Grid */}
                                <AnimatePresence mode="popLayout">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {projects.map((p, i) => (
                                            <ProjectCard key={p.id} project={p} index={i} />
                                        ))}
                                    </div>
                                </AnimatePresence>
                            </section>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
