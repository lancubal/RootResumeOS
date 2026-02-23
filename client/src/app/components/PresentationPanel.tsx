"use client";

import { Github, Linkedin, Mail, FileDown } from "lucide-react";
import { motion } from "motion/react";
import { OWNER } from "../config";

export function PresentationPanel() {
    const socialLinks = [
        { icon: Github, href: OWNER.social.github, label: "GitHub" },
        { icon: Linkedin, href: OWNER.social.linkedin, label: "LinkedIn" },
        { icon: Mail, href: `mailto:${OWNER.social.email}`, label: "Email" },
    ];

    return (
        <div className="h-full flex flex-col justify-center px-8 lg:px-12 py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}>
                <div className="text-zinc-500 mb-2 text-sm">
                    {OWNER.greeting}
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                    {OWNER.name}
                </h1>
                <h2 className="text-lg lg:text-xl text-zinc-600 mb-8">
                    {OWNER.title}
                </h2>
            </motion.div>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-zinc-600 mb-10 max-w-xl leading-relaxed text-sm lg:text-base">
                {OWNER.description}
            </motion.p>

            {/* Social Links + CV */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center gap-3">
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
            </motion.div>
        </div>
    );
}
