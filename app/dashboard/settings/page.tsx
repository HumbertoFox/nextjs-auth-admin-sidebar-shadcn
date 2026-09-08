import { getUser } from '@/lib/dal';
import SettingsPageClient from './settings-client';
import { UserDetailsProps } from '@/types';
import { Metadata } from 'next';
import { LoadingSettings } from '@/components/loadings/loading-settings';
import { Suspense } from 'react';

export const generateMetadata = async (): Promise<Metadata> => {
    return { title: 'Settings' };
}

export default async function SettingsPage() {
    const user = await getUser() as UserDetailsProps;
    return (
        <Suspense fallback={<LoadingSettings />}>
            <SettingsPageClient user={user} />
        </Suspense>
    );
}