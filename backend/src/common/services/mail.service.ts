import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.createTransporter();
    }

    private async createTransporter() {
        const host = this.configService.get<string>('MAIL_HOST');
        const port = this.configService.get<number>('MAIL_PORT');
        const user = this.configService.get<string>('MAIL_USER');
        const pass = this.configService.get<string>('MAIL_PASS');

        if (host && port && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465, // true for 465, false for other ports
                auth: {
                    user,
                    pass,
                },
            });
        } else {
            console.log('Mail credentials not provided. Using Ethereal for testing.');
            const testAccount = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log('Ethereal Mail Creds:', testAccount.user, testAccount.pass);
        }
    }

    async sendPasswordResetEmail(email: string, token: string) {
        // Determine the frontend URL based on environment or config
        // Assuming frontend is running on localhost:3001 for dev or configure via env
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password/${token}`;

        const mailOptions = {
            from: "Bensaoud Auto",
            to: email,
            subject: 'Password Reset Request',
            html: `
        <h3>Password Reset Request</h3>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
        };

        if (!this.transporter) {
            await this.createTransporter();
        }

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
