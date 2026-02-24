"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Terminal as TerminalIcon,
    X,
    Github,
    Linkedin,
    Mail,
} from "lucide-react";
import { QUICK_COMMANDS, OWNER } from "./config";
import { motion, AnimatePresence } from "motion/react";
import { PresentationPanel } from "./components/PresentationPanel";
import RootResumeTerminal from "./RootResumeTerminal";

const KONAMI = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

export default function Home() {
    const [currentCommand, setCurrentCommand] = useState("");
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [konamiBuffer, setKonamiBuffer] = useState<string[]>([]);

    const handleCommandClick = (command: string) => {
        setCurrentCommand(command);
        if (window.innerWidth < 1024) setIsTerminalOpen(true);
    };

    const handleKonamiKey = useCallback((e: KeyboardEvent) => {
        setKonamiBuffer((prev) => {
            const next = [...prev, e.key].slice(-KONAMI.length);
            if (next.join(",") === KONAMI.join(",")) {
                setCurrentCommand("konami");
                if (window.innerWidth < 1024) setIsTerminalOpen(true);
                return [];
            }
            return next;
        });
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", handleKonamiKey);
        return () => window.removeEventListener("keydown", handleKonamiKey);
    }, [handleKonamiKey]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = konamiBuffer; // consumed via closure

    return (
        <div
            className="h-screen w-screen overflow-hidden"
            style={{ backgroundColor: "#f6f6f7" }}>
            {/* ── Desktop: split screen ── */}
            <div className="hidden lg:grid lg:grid-cols-[1.2fr_2px_1fr] h-full">
                {/* Left — GUI */}
                <div className="overflow-y-auto">
                    <PresentationPanel />
                </div>

                {/* Separator */}
                <div className="bg-zinc-300 self-stretch my-8 rounded-full" />

                {/* Right — Terminal + Quick Actions */}
                <div
                    className="flex flex-col p-4 gap-3 min-h-0 overflow-hidden"
                    style={{ backgroundColor: "#f6f6f7" }}>
                    {/* Terminal — fills remaining height */}
                    <div className="flex-1 min-h-0">
                        <RootResumeTerminal
                            command={currentCommand}
                            onCommandExecuted={() => setCurrentCommand("")}
                        />
                    </div>
                    {/* Quick Actions */}
                    <div className="flex-shrink-0">
                        <div className="text-xs text-zinc-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Quick Actions
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_COMMANDS.map((cmd, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() =>
                                        handleCommandClick(cmd.command)
                                    }
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`group relative px-4 py-2 rounded-full bg-gradient-to-r ${cmd.color} text-white text-sm font-medium shadow hover:shadow-lg transition-all overflow-hidden`}>
                                    <div className="relative flex items-center gap-1.5 z-10">
                                        <span>{cmd.emoji}</span>
                                        <span>{cmd.label}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile: panel + floating button ── */}
            <div className="lg:hidden h-full flex flex-col">
                <div className="flex-1 overflow-y-auto pb-20">
                    <PresentationPanel />
                </div>

                {/* Fixed bottom bar: social icons (left) + terminal button (right) */}
                <div
                    className="fixed bottom-0 inset-x-0 h-20 flex items-center justify-between px-6 z-40 lg:hidden"
                    style={{ backgroundColor: "#f6f6f7" }}>
                    <div className="flex items-center gap-5">
                        <a
                            href={OWNER.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="w-11 h-11 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
                            <Github className="w-5 h-5 text-zinc-600" />
                        </a>
                        <a
                            href={OWNER.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="w-11 h-11 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
                            <Linkedin className="w-5 h-5 text-zinc-600" />
                        </a>
                        <a
                            href={`mailto:${OWNER.social.email}`}
                            aria-label="Email"
                            className="w-11 h-11 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
                            <Mail className="w-5 h-5 text-zinc-600" />
                        </a>
                    </div>
                    <motion.button
                        onClick={() => setIsTerminalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-full shadow-lg text-sm font-medium">
                        <TerminalIcon className="w-5 h-5" />
                        <span>Terminal</span>
                    </motion.button>
                </div>

                {/* Slide-up drawer */}
                <AnimatePresence>
                    {isTerminalOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsTerminalOpen(false)}
                                className="fixed inset-0 bg-black/50 z-40"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300,
                                }}
                                className="fixed inset-x-0 bottom-0 h-[75vh] z-50">
                                <div className="h-full flex flex-col gap-2 p-3 bg-zinc-950">
                                    <button
                                        onClick={() => setIsTerminalOpen(false)}
                                        className="absolute top-5 right-5 w-9 h-9 bg-zinc-700 text-white rounded-full flex items-center justify-center z-10 shadow-lg">
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="flex-1 min-h-0">
                                        <RootResumeTerminal
                                            command={currentCommand}
                                            onCommandExecuted={() =>
                                                setCurrentCommand("")
                                            }
                                        />
                                    </div>
                                    {/* Quick Actions in mobile drawer */}
                                    <div className="flex-shrink-0 flex flex-wrap gap-2">
                                        {QUICK_COMMANDS.map((cmd, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() =>
                                                    handleCommandClick(
                                                        cmd.command,
                                                    )
                                                }
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`group relative px-3 py-1.5 rounded-full bg-gradient-to-r ${cmd.color} text-white text-xs font-medium shadow overflow-hidden`}>
                                                <div className="relative flex items-center gap-1 z-10">
                                                    <span>{cmd.emoji}</span>
                                                    <span>{cmd.label}</span>
                                                </div>
                                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
