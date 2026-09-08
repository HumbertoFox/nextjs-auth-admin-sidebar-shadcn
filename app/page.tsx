import HomeMainComponent from '@/components/home-main';
import { buttonVariants } from '@/components/ui/button';
import { adminRepository } from '@/lib/adminrepository';
import { getSession } from '@/lib/session';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function HomePage() {
  const [session, isAdmin] = await Promise.all([
    getSession(),
    adminRepository.getIsAdmin()
  ]);
  return (
    <div className="flex flex-col min-h-screen items-center bg-zinc-50 font-sans dark:bg-black">
      <header className="flex justify-end gap-2 w-full max-w-3xl px-1 py-2.5 bg-white dark:bg-black">
        {session ? (
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Dashboard
          </Link>
        ) : (
          <>
            {isAdmin && (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Log in
              </Link>
            )}
            {!isAdmin && (
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Sign up
              </Link>
            )}
          </>
        )}
      </header>
      <HomeMainComponent />
    </div>
  );
}
