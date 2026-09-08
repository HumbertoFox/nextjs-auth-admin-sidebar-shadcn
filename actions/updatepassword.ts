'use server';

import { getUser } from '@/lib/dal';
import { FormStatePasswordUpdate, passwordUpdateSchema } from '@/lib/definitions';
import { compare, hash } from 'bcrypt-ts';
import { redirect } from 'next/navigation';
import z from 'zod';
import { userRepository } from '@/lib/userrepositorys';
import { revalidatePath } from 'next/cache';
import { regenerateCsrfToken, validateCsrfToken } from '@/lib/csrf';
import { getTransactionClient } from '@/lib/db';

export async function updatePassword(_: FormStatePasswordUpdate, formData: FormData): Promise<FormStatePasswordUpdate> {
    const sessionUser = await getUser();
    if (!sessionUser || !sessionUser?.id) return redirect('/logout');

    const csrfToken = formData.get('csrfToken') as string;
    const isValidCsrf = await validateCsrfToken(csrfToken);
    if (!isValidCsrf) return { message: false };

    const validatedFields = passwordUpdateSchema.safeParse({
        current_password: formData.get('current_password') as string,
        password: formData.get('password') as string,
        password_confirmation: formData.get('password_confirmation') as string
    });

    if (!validatedFields.success) return { errors: z.flattenError(validatedFields.error).fieldErrors };

    const { current_password, password } = validatedFields.data;

    const client = await getTransactionClient();

    try {
        await client.query('BEGIN');

        const authUser = await userRepository.findActiveById(sessionUser.id, client);

        if (!authUser) {
            await client.query('ROLLBACK');
            return redirect('/login');
        }

        // password sempre definida neste fluxo (sem contas OAuth/SSO aqui).
        const isValid = await compare(current_password, authUser.password!);

        if (!isValid) {
            await client.query('ROLLBACK');
            return { errors: { current_password: ['The current password is incorrect.'] } };
        }

        if (current_password === password) {
            await client.query('ROLLBACK');
            return { errors: { password: ['The new password cannot be the same as the old one.'] } };
        }

        const hashedPassword = await hash(password, 12);

        await userRepository.updatePassword(sessionUser.id, hashedPassword, client);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        return { errors: { current_password: ['Something went wrong. Please try again later.'] } };
    } finally {
        client.release();
    }

    revalidatePath('/dashboard/settings/password');

    await regenerateCsrfToken();

    return { message: true, ts: Date.now() };
}