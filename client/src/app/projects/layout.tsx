import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects — Luna Lancuba",
    description:
        "Open-source projects and experiments: microservice tooling, API design, cloud infrastructure, and more.",
    openGraph: {
        title: "Projects — Luna Lancuba",
        description:
            "Open-source projects and experiments: microservice tooling, API design, cloud infrastructure, and more.",
        type: "website",
    },
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
