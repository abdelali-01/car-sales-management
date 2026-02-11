import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Accounts Page',
    description: 'View and manage your accounts',
};

export default function AccountsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}