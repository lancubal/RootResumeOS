"use client";

import { useState, useEffect } from "react";
import {
    Github,
    Linkedin,
    Mail,
    FileDown,
    BookOpen,
    FolderGit2,
    Newspaper,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { OWNER } from "../config";

export function PresentationPanel() {
    const [visitors, setVisitors] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/visitors")
            .then((r) => r.json())
            .then((d) => setVisitors(d.count))
            .catch(() => {});
    }, []);

    const socialLinks = [
        { icon: Github, href: OWNER.social.github, label: "GitHub" },
        { icon: Linkedin, href: OWNER.social.linkedin, label: "LinkedIn" },
        { icon: Mail, href: `mailto:${OWNER.social.email}`, label: "Email" },
    ];

    return (
        <div className="h-full flex flex-col px-6 lg:px-12 py-4 lg:py-12">
            {/* Mobile-only header strip */}
            <div className="lg:hidden flex items-center justify-between mb-5 pb-5 border-b border-zinc-100">
                <Link
                    href="/uses"
                    className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors font-medium">
                    /uses
                </Link>
                <motion.a
                    href={OWNER.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium shadow hover:shadow-lg transition-all overflow-hidden flex items-center gap-2">
                    <FileDown className="w-4 h-4" />
                    <span>Download CV</span>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                </motion.a>
            </div>

            {/* Main content — centered in available space */}
            <div className="flex-1 flex flex-col justify-center">
                {/* Avatar + Header row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4 lg:gap-6 mb-6">
                    {/* Circular avatar */}
                    <motion.div
                        className="relative shrink-0 w-28 h-28 lg:w-32 lg:h-32 cursor-pointer"
                        whileHover={{ scale: 1.12, rotate: -6 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 14,
                        }}>
                        <motion.div
                            className="w-full h-full rounded-full overflow-hidden shadow-lg"
                            whileHover={{
                                boxShadow:
                                    "0 0 0 3px #6366f1, 0 0 28px rgba(99,102,241,0.5), 0 12px 32px rgba(0,0,0,0.25)",
                            }}
                            transition={{ duration: 0.22 }}>
                            <Image
                                src="/avatar.jpg"
                                alt={OWNER.name}
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                                priority
                            />
                        </motion.div>
                        {/* Online indicator */}
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow" />
                    </motion.div>

                    {/* Name + title */}
                    <div>
                        <div className="hidden lg:block text-zinc-500 mb-1 text-sm">
                            {OWNER.greeting}
                        </div>
                        <motion.h1
                            className="text-3xl lg:text-5xl font-bold mb-1 cursor-default select-none"
                            whileHover="hover">
                            <span className="inline-flex">
                                {OWNER.name.split("").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        variants={{
                                            hover: {
                                                y: char === " " ? 0 : -7,
                                                color:
                                                    char === " "
                                                        ? "#18181b"
                                                        : "#6366f1",
                                                transition: {
                                                    y: {
                                                        type: "spring",
                                                        stiffness: 420,
                                                        damping: 14,
                                                        delay: i * 0.03,
                                                    },
                                                    color: {
                                                        type: "tween",
                                                        duration: 0.18,
                                                        delay: i * 0.03,
                                                    },
                                                },
                                            },
                                        }}
                                        style={{ color: "#18181b" }}
                                        className="inline-block">
                                        {char === " " ? "\u00a0" : char}
                                    </motion.span>
                                ))}
                            </span>
                        </motion.h1>
                        <h2 className="text-sm lg:text-lg text-zinc-600 leading-snug">
                            {OWNER.title.split("\n").map((line, i) => (
                                <span
                                    key={i}
                                    className={`block ${i === 1 ? "text-sm lg:text-base text-zinc-400" : ""}`}>
                                    {line}
                                </span>
                            ))}
                        </h2>
                    </div>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-zinc-600 mb-5 max-w-xl leading-relaxed text-sm lg:text-base">
                    <span className="lg:hidden">
                        I build scalable architectures and transform legacy systems.
                        Tap the terminal button below to explore my work.
                    </span>
                    <span className="hidden lg:inline">{OWNER.description}</span>
                </motion.p>

                {/* Row — Explore (right below description) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/projects"
                            className="group relative px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium shadow hover:shadow-lg transition-all overflow-hidden flex items-center justify-center gap-1.5 w-full lg:w-auto">
                            <FolderGit2 className="w-3.5 h-3.5" />
                            <span>Projects</span>
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/blog"
                            className="group relative px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium shadow hover:shadow-lg transition-all overflow-hidden flex items-center justify-center gap-1.5 w-full lg:w-auto">
                            <Newspaper className="w-3.5 h-3.5" />
                            <span>Blog</span>
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </Link>
                    </motion.div>

                    <motion.div
                        className="col-span-2 lg:col-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/about"
                            className="group relative px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium shadow hover:shadow-lg transition-all overflow-hidden flex items-center justify-center gap-1.5 w-full lg:w-auto">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>About this portfolio</span>
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
            {/* end centered main content */}

            {/* Footer — Connect (desktop only; mobile uses fixed bottom bar in page.tsx) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="hidden lg:block mt-10 pt-6 border-t border-zinc-100">
                {/* Social icons — always visible */}
                <div className="flex flex-wrap items-center gap-3">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
                            <social.icon className="w-5 h-5 text-zinc-600" />
                        </a>
                    ))}

                    <div className="w-px h-6 bg-zinc-200" />

                    <motion.a
                        href={OWNER.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium shadow hover:shadow-lg transition-all overflow-hidden flex items-center gap-2">
                        <FileDown className="w-4 h-4" />
                        <span>Download CV</span>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    </motion.a>

                    <Link
                        href="/uses"
                        className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors ml-auto">
                        /uses
                    </Link>

                    {visitors !== null && (
                        <span className="text-xs text-zinc-400">
                            {visitors.toLocaleString()} visit
                            {visitors === 1 ? "" : "s"}
                        </span>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
