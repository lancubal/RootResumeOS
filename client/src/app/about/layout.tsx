import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About — Luna Lancuba",
    description:
        "Deep-dive into the architecture behind this portfolio: Docker isolation, SSE streaming, Next.js, and more.",
    openGraph: {
        title: "About — Luna Lancuba",
        description:
            "Deep-dive into the architecture behind this portfolio: Docker isolation, SSE streaming, Next.js, and more.",
        type: "website",
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
