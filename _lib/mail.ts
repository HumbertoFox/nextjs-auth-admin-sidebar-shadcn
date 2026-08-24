import nodemailer from 'nodemailer';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// secure=true (TLS implícito) somente na porta 465 (SMTPS).
// Nas demais portas (ex. 587) o TLS é negociado via STARTTLS.
export const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    }
});

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
    try {
        const result = await transporter.sendMail({
            from: `${APP_NAME} <${SMTP_USER}>`,
            to,
            subject: "Password reset",
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to create a new password:</p>
                <a href='${resetLink}'>${resetLink}</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        });
        return { ok: true, result };

    } catch (error) {
        return { ok: false, error };
    }
}

export const sendEmailVerification = async (to: string, link: string, linkSession?: string) => {
    try {
        const result = await transporter.sendMail({
            from: `${APP_NAME} <${SMTP_USER}>`,
            to,
            subject: "Check your email.",
            html: `
                <h2>Email confirmation</h2>
                <p>Click the link below to confirm your email:</p>
                <a href='${link}'>${link}</a>
                <p>Click the link below to confirm your email (System Open):</p>
                <a href='${linkSession}'>${linkSession}</a>
                <p>If you did not request this, you can ignore this email.</p>
            `,
        });
        return { ok: true, result };
    } catch (error) {
        return { ok: false, error };
    }
}

export const sendCreatedEmailAccountVerification = async (to: string, link: string, linkSession?: string, defaultPassword?: string) => {
    try {
        const result = await transporter.sendMail({
            from: `${APP_NAME} <${SMTP_USER}>`,
            to,
            subject: "Check your email.",
            html: `
                <p>Hello, ${to}!</p>
                <p>Welcome to ${APP_NAME}!</p>
                <h2>Your account has been created successfully!</h2>
                <p>Attention! If the email is not confirmed within 30 days, you will not be able to access your account.</p>
                ${defaultPassword ? `
                <p>Your default password is: <strong>${defaultPassword}</strong></p>
                <p>Please change your password after the first login.</p>
                ` : ''}
                <p>Please change your password after the first login.</p>
                <p>Click the link below to confirm your email (The system will open in another browser or the user is not logged in):</p>
                <a href='${link}'>${link}</a>
                <p>Click the link below to confirm your email (The system will open in the same browser with the user logged in):</p>
                <a href='${linkSession}'>${linkSession}</a>
                <p>If you did not request this, you can ignore this email.</p>
            `,
        });
        return { ok: true, result };
    } catch (error) {
        return { ok: false, error };
    }
}