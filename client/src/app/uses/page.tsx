import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { USES, OWNER } from "../config";

export const metadata: Metadata = {
    title: `Uses — ${OWNER.name}`,
    description: "The tools, hardware, fonts, and services I use every day.",
    openGraph: {
        title: `Uses — ${OWNER.name}`,
        description:
            "The tools, hardware, fonts, and services I use every day.",
        type: "website",
    },
};

export default function UsesPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#f6f6f7" }}>
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-zinc-200 px-6 py-4 flex items-center gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
                <div className="h-4 w-px bg-zinc-300" />
                <span className="text-zinc-400 text-sm">Uses</span>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-zinc-900 mb-3">
                        /uses
                    </h1>
                    <p className="text-zinc-500 text-lg leading-relaxed">
                        The tools, hardware, and services I use daily. Inspired
                        by{" "}
                        <a
                            href="https://uses.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 transition-colors">
                            uses.tech
                        </a>
                        .
                    </p>
                </div>

                {/* Categories */}
                <div className="space-y-12">
                    {USES.map((section) => (
                        <section key={section.category}>
                            <div className="flex items-center gap-2 mb-5">
                                <span className="text-xl">{section.icon}</span>
                                <h2 className="text-lg font-bold text-zinc-900">
                                    {section.category}
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {section.items.map((item) => (
                                    <div
                                        key={item.name}
                                        className="bg-white rounded-xl border border-zinc-100 shadow-sm px-5 py-4 flex flex-col gap-1">
                                        <span className="font-semibold text-zinc-900 text-sm">
                                            {item.name}
                                        </span>
                                        <span className="text-zinc-500 text-sm leading-relaxed">
                                            {item.description}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-zinc-200">
                    <p className="text-sm text-zinc-400">
                        Last updated February 2026.{" "}
                        <a
                            href={OWNER.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-700 transition-colors">
                            Open to suggestions.
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}
