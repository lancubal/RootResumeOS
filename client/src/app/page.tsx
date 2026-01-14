'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Refs for auto-scrolling and focus
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on click anywhere in terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch('http://localhost:3001/start', { method: 'POST' });
        const data = await res.json();
        
        if (data.sessionId) {
          setSessionId(data.sessionId);
          setHistory([
            "Welcome to the Interactive Cloud Shell Portfolio.",
            "Copyright (c) 2026 Agustin Lancuba.",
            "",
            "🚨 CTF CHALLENGE ACTIVE 🚨",
            "There is a secret 'flag.txt' hidden somewhere in the /var/lib directory.",
            "Find it, read it, and decode the Base64 content to get my contact info.",
            "",
            "Available Commands:",
            "  about      - View portfolio architecture",
            "  help       - Show this help message",
            "  clear      - Clear terminal history",
            "  [linux]    - Run any standard Linux command (ls, cat, python...)",
            "------------------------------------------------------------------",
            ""
          ]);
        } else {
          setHistory(["Error: Failed to initialize session."]);
        }
      } catch (err) {
        setHistory([`Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`]);
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    if (!sessionId) {
        setHistory(prev => [...prev, "Error: No active session. Please refresh."]);
        return;
    }

    const command = input.trim();
    setInput(''); // Clear input immediately
    setIsLoading(true);

    // Optimistically add command to history
    setHistory(prev => [...prev, `guest@portfolio:~$ ${command}`]);

    // --- Client-Side Commands ---
    if (command === 'about') {
        const aboutText = [
            "",
            "🏛️  PORTFOLIO ARCHITECTURE",
            "---------------------------",
            "1. Frontend: Next.js 14 + Tailwind CSS",
            "   - Renders this terminal interface.",
            "",
            "2. Backend: Node.js + Express",
            "   - Manages session lifecycle and security.",
            "",
            "3. Execution Engine: Docker (Alpine Linux)",
            "   - You are running inside a real, isolated container.",
            "   - Filesystem changes persist for your session.",
            "",
            "4. Security & Cleanup:",
            "   - Containers are strictly resource-limited.",
            "   - Automatic Garbage Collector kills sessions after 10m inactivity.",
            ""
        ].join('\n');
        
        setHistory(prev => [...prev, aboutText]);
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 10);
        return;
    }

    if (command === 'help') {
        const helpText = [
            "",
            "Available Commands:",
            "  about      - View portfolio architecture",
            "  help       - Show this help message",
            "  clear      - Clear terminal history",
            "  [linux]    - Execute standard commands (ls, mkdir, python, etc.)",
            ""
        ].join('\n');

        setHistory(prev => [...prev, helpText]);
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 10);
        return;
    }

    if (command === 'clear') {
        setHistory([]);
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 10);
        return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, code: command }),
      });

      const data = await response.json();
      
      let outputText = '';
      if (data.error) {
        outputText = data.error;
        if (data.output) outputText += `\n${data.output}`;
      } else {
        outputText = data.output;
      }
      
      // Remove trailing newline for cleaner UI if present
      if (outputText.endsWith('\n')) {
        outputText = outputText.slice(0, -1);
      }

      setHistory(prev => [...prev, outputText]);

    } catch (error) {
      setHistory(prev => [...prev, `Network Error: ${error instanceof Error ? error.message : 'Unknown'}`]);
    } finally {
      setIsLoading(false);
      // Keep focus on input after execution
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-mono text-sm md:p-10">
      
      {/* Terminal Window */}
      <div 
        className="relative flex h-[80vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-zinc-800 bg-black shadow-2xl"
        onClick={handleTerminalClick}
      >
        
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="text-zinc-400">guest@portfolio: ~</div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          
          {isInitializing && (
            <div className="animate-pulse text-green-500">Initializing secure environment...</div>
          )}

          {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap break-words leading-relaxed mb-1">
              {line}
            </div>
          ))}

          {/* Active Input Line */}
          {!isInitializing && (
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="mr-2 text-green-500 shrink-0">guest@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                autoFocus
                className="w-full flex-1 border-none bg-transparent p-0 text-zinc-100 outline-none focus:ring-0 placeholder-zinc-600"
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          )}

          {/* Spacer to allow scrolling past the bottom */}
          <div ref={terminalEndRef} className="h-4" />
        </div>
      </div>
    </main>
  );
}