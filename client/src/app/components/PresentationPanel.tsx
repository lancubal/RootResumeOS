"use client";

import { Github, Linkedin, Mail, FileDown, BookOpen, FolderGit2, Newspaper } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { OWNER } from "../config";

export function PresentationPanel() {
    const socialLinks = [
        { icon: Github, href: OWNER.social.github, label: "GitHub" },
        { icon: Linkedin, href: OWNER.social.linkedin, label: "LinkedIn" },
        { icon: Mail, href: `mailto:${OWNER.social.email}`, label: "Email" },
    ];

    return (
        <div className="h-full flex flex-col justify-center px-8 lg:px-12 py-12">
            {/* Avatar + Header row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-6 mb-6">
                {/* Circular avatar — place your photo at /public/avatar.jpg */}
                <div className="relative shrink-0 w-24 h-24 lg:w-28 lg:h-28">
                    <div className="w-full h-full rounded-full ring-4 ring-zinc-200 overflow-hidden shadow-lg">
                        <Image
                            src="/avatar.jpg"
                            alt={OWNER.name}
                            width={112}
                            height={112}
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                    {/* Online indicator */}
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow" />
                </div>

                {/* Name + title */}
                <div>
                    <div className="text-zinc-500 mb-1 text-sm">
                        {OWNER.greeting}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-1 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                        {OWNER.name}
                    </h1>
                    <h2 className="text-base lg:text-lg text-zinc-600">
                        {OWNER.title}
                    </h2>
                </div>
            </motion.div>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-zinc-600 mb-10 max-w-xl leading-relaxed text-sm lg:text-base">
                {OWNER.description}
            </motion.p>

            {/* Row 1 — Social icons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-3 mb-3">
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
            </motion.div>

            {/* Row 2 — Navigation buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="flex flex-wrap items-center gap-3">
                <motion.a
                    href={OWNER.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all overflow-hidden flex items-center gap-2">
                    <FileDown className="w-4 h-4" />
                    <span>Download CV</span>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                </motion.a>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href="/projects"
                        className="group relative px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all overflow-hidden flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4" />
                        <span>Projects</span>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href="/blog"
                        className="group relative px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all overflow-hidden flex items-center gap-2">
                        <Newspaper className="w-4 h-4" />
                        <span>Blog</span>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href="/about"
                        className="group relative px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all overflow-hidden flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>About this portfolio</span>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
