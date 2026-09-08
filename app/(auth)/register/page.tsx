import { adminRepository } from '@/lib/adminrepository';
import RegisterAdminClient from './form-register-admin-client';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingRegister } from '@/components/loadings/loading-register';
import { getCsrfToken } from '@/lib/csrf';
import { redirect } from 'next/navigation';

export const generateMetadata = async (): Promise<Metadata> => {
  return { title: 'Register Administrator' };
}

export default async function RegisterPage() {
  const [isAdmin, csrfToken] = await Promise.all([
    adminRepository.getIsAdmin(),
    getCsrfToken()
  ]);
  if (isAdmin) redirect('/login');
  const Title = 'Register Administrator';
  return (
    <Suspense fallback={<LoadingRegister />}>
      <RegisterAdminClient
        TitleIntl={Title}
        csrfToken={csrfToken}
      />
    </Suspense>
  );
}