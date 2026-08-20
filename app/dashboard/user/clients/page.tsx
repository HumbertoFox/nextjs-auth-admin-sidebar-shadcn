import { DashboardSidebarHeader } from '@/_components/dashboard-sidebar-header';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/_components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/_components/ui/table';
import { getCsrfToken } from '@/_lib/csrf';
import getVisiblePagination from '@/_lib/getvisiblepagination';
import { userRepository } from '@/_lib/userrepositorys';
import { Metadata } from 'next';
import { UserActionButtons } from '@/_components/user-action-buttons';
import Image from 'next/image';
import { getInitials } from '@/_lib/get-initials';
import { ClockAlert, ClockCheck } from 'lucide-react';
import { getUser } from '@/_lib/dal';
import { redirect } from 'next/navigation';

export const generateMetadata = async (): Promise<Metadata> => {
    return { title: 'Clients' };
}

const breadcrumbItems = [
    { text: 'Dashboard', href: '/dashboard' },
    { text: 'User', href: '/dashboard/user' },
    { text: 'Clients' }
];

const pageSize = 10;

export default async function ClientsPage(props: { searchParams?: Promise<{ page?: number; }>; }) {
    const params = await props.searchParams;
    const rawPage = parseInt(String(params?.page ?? '1'), 10);
    const currentPage = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage);
    const [[clients, total], csrfToken, user] = await Promise.all([
        userRepository.findClientsPaginated(currentPage, pageSize),
        getCsrfToken(),
        getUser()
    ]);
    const totalPages = Math.ceil(total / pageSize);
    if (!user) redirect('/logout');
    if (!['ADMIN', 'USER'].includes(user.role)) redirect('/dashboard');
    const isAdmin = user.role === 'ADMIN';
    return (
        <>
            <DashboardSidebarHeader items={breadcrumbItems} />
            <div className="flex flex-1 flex-col gap-4 p-2">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-screen flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Table className="w-full text-center text-xs">
                        <TableHeader>
                            <TableRow className="cursor-default">
                                <TableHead className="text-center">No.</TableHead>
                                <TableHead className="text-center max-lg:hidden">Code.</TableHead>
                                <TableHead className="text-center max-lg:hidden">Name</TableHead>
                                <TableHead className="text-center">E-mail</TableHead>
                                {isAdmin && <TableHead className="text-center">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.length === 0 && (
                                <TableRow className="text-red-600 cursor-default">
                                    <TableCell colSpan={isAdmin ? 5 : 4}>There are no registered clients.</TableCell>
                                </TableRow>
                            )}
                            {clients.map((client, index) => (
                                <TableRow key={client.id} className="cursor-default">
                                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                                    <TableCell className="max-lg:hidden">{client.id}</TableCell>
                                    <TableCell className="max-lg:hidden">
                                        <div className="flex items-center justify-center gap-1">
                                            {client.avatar ? (
                                                <Image
                                                    src={client.avatar}
                                                    width={28}
                                                    height={28}
                                                    alt={`Avatar of ${client.name}`}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <span className="font-medium text-black dark:text-white">
                                                    {getInitials(client.name)}
                                                </span>
                                            )}
                                            <span>-</span>
                                            {client.name}
                                        </div>
                                    </TableCell>
                                    <TableCell title={client.email_verified ? 'Email verified' : 'Email not verified'}>
                                        <div className='flex items-center justify-center gap-1'>
                                            {client.email}
                                            {client.email_verified ? <ClockCheck className="size-5 text-green-500" /> : <ClockAlert className=" size-5 text-orange-500" />}
                                        </div>
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell className="flex justify-evenly items-center my-1">
                                            <UserActionButtons
                                                user={client}
                                                csrfToken={csrfToken}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {totalPages > 1 && (
                    <Pagination className="pb-2.5">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={currentPage > 1 ? `?page=${currentPage - 1}` : '#'}
                                    aria-disabled={currentPage <= 1}
                                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            {getVisiblePagination(currentPage, totalPages).map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === '...' ? (
                                        <PaginationLink
                                            href="#"
                                            aria-disabled
                                            className="pointer-events-none opacity-50"
                                        >
                                            ...
                                        </PaginationLink>
                                    ) : (
                                        <PaginationLink
                                            href={`?page=${page}`}
                                            isActive={currentPage === page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href={currentPage < totalPages ? `?page=${currentPage + 1}` : '#'}
                                    aria-disabled={currentPage >= totalPages}
                                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </>
    );
}