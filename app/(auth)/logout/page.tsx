'use client';

import { LoadingLogin } from '@/components/loadings/loading-login';
import { useRouter } from 'next/navigation';
import { deleteSession } from '@/actions/logoutuser';
import { useEffect } from 'react';

export default function Logout() {
    const router = useRouter();
    useEffect(() => {
        const logout = async () => {
            const success = await deleteSession();
            if (success) {
                router.push('/login');
            } else {
                router.push('/');
            };
        };
        const timer = setTimeout(logout, 1000);
        return () => clearTimeout(timer);
    }, [router]);
    return <LoadingLogin />;
}