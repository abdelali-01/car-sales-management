import ResetPassword from '@/components/auth/ResetPassword'
import React from 'react'

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Reset Password | Bensaoud Auto",
    description: "Reset your password for Bensaoud Auto Dashboard",
};

export default function RestPage() {
    return (
        <ResetPassword />
    )
}
