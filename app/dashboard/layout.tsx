import DashboardSidebar from '@/components/dashboard-sidebar';
import { SidebarInset, SidebarProvider, } from '@/components/ui/sidebar';
import { getUser } from '@/lib/dal';
import { ProfileForm, UserDetailsProps, UserRole } from '@/types';

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const user = await getUser() as UserDetailsProps;
    const role = user.role as UserRole;
    return (
        <SidebarProvider>
            <DashboardSidebar
                user={user as ProfileForm}
                userType={role}
            />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}