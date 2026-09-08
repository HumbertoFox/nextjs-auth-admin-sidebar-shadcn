import { DashboardSidebarHeader } from '@/components/dashboard-sidebar-header';
import { Metadata } from 'next';
import RegisterUser from '@/components/form-register-user';
import { Suspense } from 'react';
import { LoadingRegister } from '@/components/loadings/loading-register';
import { getCsrfToken } from '@/lib/csrf';
import { getUser } from '@/lib/dal';
import { redirect } from 'next/navigation';

export const generateMetadata = async (): Promise<Metadata> => {
    return { title: 'Register User' };
}

const breadcrumbItems = [
    { text: 'Dashboard', href: '/dashboard' },
    { text: 'User', href: '/dashboard/user' },
    { text: 'Register' }
];

export default async function RegisterUsersPage() {
    const [user, csrfToken] = await Promise.all([
        getUser(),
        getCsrfToken()
    ]);
    if (!user) redirect('/logout');
    if (!['ADMIN', 'USER'].includes(user.role)) redirect('/dashboard');
    return (
        <>
            <DashboardSidebarHeader items={breadcrumbItems} />
            <Suspense fallback={<LoadingRegister />}>
                <RegisterUser
                    titleForm={`Register ${user.role === 'ADMIN' ? 'User' : 'Client'} Acount`}
                    valueButton="Register"
                    role={user.role}
                    csrfToken={csrfToken}
                />
            </Suspense>
        </>
    );
}