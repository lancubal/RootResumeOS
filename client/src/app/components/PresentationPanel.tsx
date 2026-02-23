"use client";

import { Github, Linkedin, Mail, FileDown } from "lucide-react";
import { motion } from "motion/react";
import { OWNER, QUICK_COMMANDS } from "../config";

interface PresentationPanelProps {
    onCommandClick: (command: string) => void;
}

export function PresentationPanel({ onCommandClick }: PresentationPanelProps) {
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

            {/* Quick Command Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-10">
                <div className="text-xs text-zinc-500 mb-3 uppercase tracking-widest">
                    Quick Actions
                </div>
                <div className="flex flex-wrap gap-3">
                    {QUICK_COMMANDS.map((cmd, index) => (
                        <motion.button
                            key={index}
                            onClick={() => onCommandClick(cmd.command)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`group relative px-5 py-2.5 rounded-full bg-gradient-to-r ${cmd.color} text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all overflow-hidden`}>
                            <div className="relative flex items-center gap-2 z-10">
                                <span>{cmd.emoji}</span>
                                <span>{cmd.label}</span>
                            </div>
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </motion.button>
                    ))}

                    {/* CV — direct link, does not run a terminal command */}
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
                </div>
                <div className="text-xs text-zinc-400 mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Colored buttons run real commands in the terminal →
                </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-3 mb-10">
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

            {/* Tip for technical users */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                        <div className="text-sm font-medium text-zinc-700 mb-1">
                            For technical users
                        </div>
                        <div className="text-xs text-zinc-500 leading-relaxed">
                            The terminal is fully functional — runs in a real
                            Docker container. Try{" "}
                            <code className="px-1.5 py-0.5 bg-zinc-200 rounded text-zinc-700">
                                help
                            </code>
                            ,{" "}
                            <code className="px-1.5 py-0.5 bg-zinc-200 rounded text-zinc-700">
                                visualize bubble
                            </code>{" "}
                            o{" "}
                            <code className="px-1.5 py-0.5 bg-zinc-200 rounded text-zinc-700">
                                challenge
                            </code>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
