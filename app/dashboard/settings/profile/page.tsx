import { getUser } from '@/lib/dal';
import ProfilePageClient from './profile-client';
import { UserProfilePageProps } from '@/types';
import { Metadata } from 'next';
import { LoadingProfile } from '@/components/loadings/loading-profile';
import { Suspense } from 'react';
import { getCsrfToken } from '@/lib/csrf';

export const generateMetadata = async (): Promise<Metadata> => {
    return { title: 'Profile of User' };
}

export default async function ProfilePage() {
    const user = await getUser() as UserProfilePageProps;
    const mustVerifyEmail: boolean = !Boolean(user.email_verified);
    const csrfToken = await getCsrfToken();
    return (
        <Suspense fallback={<LoadingProfile />}>
            <ProfilePageClient
                name={user.name}
                email={user.email}
                avatar={user.avatar}
                mustVerifyEmail={mustVerifyEmail}
                csrfToken={csrfToken}
            />
        </Suspense>
    );
}