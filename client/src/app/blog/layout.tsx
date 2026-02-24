import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog — Luna Lancuba",
    description:
        "Thoughts on architecture, containers, developer tooling, and building things that last.",
    openGraph: {
        title: "Blog — Luna Lancuba",
        description:
            "Thoughts on architecture, containers, developer tooling, and building things that last.",
        type: "website",
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
