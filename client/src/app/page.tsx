'use client';

import RootResumeTerminal from './RootResumeTerminal';

// Data can be fetched from a CMS, a database, or be hardcoded here.
const PROJECTS_DATA = [
  {
    id: "1",
    name: "RootResume",
    description: "This very own Remote Code Execution Portfolio",
    stack: ["Next.js", "Node.js", "Docker", "AWS"],
    status: "Production-Ready",
    github: "https://github.com/lancubal/RootResumeOS"
  },
  {
    id: "2",
    name: "legacy-migrator",
    description: "Automated tool to migrate legacy apps",
    stack: ["Python", "Bash", "Ansible"],
    status: "Concept",
    github: "https://github.com/lancubal/legacy-migrator"
  }
];

const ABOUT_ME_DATA = [
  "I am a Software Engineer specializing in Full Stack Development and Cloud Architecture.",
  "I believe in building systems that are secure by design and delightful to use.",
  "This portfolio is a testament to that: a fully functional RCE environment.",
  "",
  "Contact: agustinlancuba.sistemas@gmail.com"
].join('\n');

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-mono text-sm md:p-10">
      <RootResumeTerminal 
        apiUrl={apiUrl}
        projectsData={PROJECTS_DATA}
        aboutMeData={ABOUT_ME_DATA}
      />
    </main>
  );
}