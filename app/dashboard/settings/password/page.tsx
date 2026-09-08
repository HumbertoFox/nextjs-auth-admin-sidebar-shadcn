import { Metadata } from 'next';
import PasswordPageClient from './password-client';
import { LoadingPassword } from '@/components/loadings/loading-password';
import { Suspense } from 'react';
import { getCsrfToken } from '@/lib/csrf';
import { getUser } from '@/lib/dal';

export const generateMetadata = async (): Promise<Metadata> => {
    return { title: 'Update Password User' };
}

export default async function PasswordPage() {
    const [csrfToken, session] = await Promise.all([
        getCsrfToken(),
        getUser()
    ]);
    const isFirstAccess = Boolean(session?.must_change_password);
    const title = isFirstAccess ? 'You must update your password upon first login.' : 'Update Password';
    return (
        <Suspense fallback={<LoadingPassword />}>
            <PasswordPageClient
                csrfToken={csrfToken}
                title={title}
            />
        </Suspense>
    );
}