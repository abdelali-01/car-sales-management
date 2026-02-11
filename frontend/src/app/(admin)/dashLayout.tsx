import { Metadata } from 'next';

export const metadata: Metadata = {
    title:
        "Ecommerce store dashboard",
    description: "Ecommerce store dashboard",
};

export default function DashLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}