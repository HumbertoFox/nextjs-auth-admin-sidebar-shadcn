'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { deleteUserById } from '@/actions/deleteadminuser';
import { reactivateAdminUserById } from '@/actions/reactivateadminuser';
import { UserLock, UserPen, UserX } from 'lucide-react';
import Link from 'next/link';
import { ClientActionButtonsProps } from '@/types';

export function ClientActionButtons({ client, csrfToken }: ClientActionButtonsProps) {
    if (!client.deleted_at) {
        return (
            <>
                <Link
                    href={`/dashboard/admins/${client.id}/update`}
                    title={`To update ${client.name}`}
                >
                    <UserPen
                        aria-label={`To update ${client.name}`}
                        className="size-5 text-yellow-600 hover:text-yellow-500 duration-300"
                    />
                </Link>

                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            title={`Delete ${client.name}`}
                            className="cursor-pointer"
                        >
                            <UserX
                                aria-label={`Delete ${client.name}`}
                                className="size-5 text-red-600 cursor-pointer hover:text-red-500 duration-300"
                            />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            After confirmation, user {client.name} will no longer be able to access the system!
                        </DialogDescription>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <form action={deleteUserById}>
                                <input
                                    type="hidden"
                                    name="csrfToken"
                                    value={csrfToken}
                                />

                                <input
                                    type="hidden"
                                    name="userId"
                                    value={client.id}
                                />

                                <Button
                                    type="submit"
                                    variant="destructive"
                                    className="cursor-pointer"
                                >
                                    Yes, delete!
                                </Button>
                            </form>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    title={`Activate ${client.name}`}
                    className="cursor-pointer"
                >
                    <UserLock
                        aria-label={`Activate ${client.name}`}
                        className="size-5 text-red-600 hover:text-green-500 duration-300"
                    />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                    After confirmation, you will activate the user account {client.name}!
                </DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="destructive"
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <form action={reactivateAdminUserById}>
                        <input
                            type="hidden"
                            name="csrfToken"
                            value={csrfToken}
                        />

                        <input
                            type="hidden"
                            name="userId"
                            value={client.id}
                        />
                        
                        <Button
                            type="submit"
                            variant="outline"
                            className="cursor-pointer"
                        >
                            Yes, activate!
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}