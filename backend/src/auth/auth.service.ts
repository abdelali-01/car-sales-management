import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';
import { MailService } from '../common/services/mail.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private mailService: MailService,
  ) { }

  async validateUser(email: string, password: string): Promise<Admin | null> {
    const admin = await this.adminsService.findByEmail(email);

    if (!admin) {
      return null;
    }

    const isPasswordValid = await admin.validatePassword(password);

    if (!isPasswordValid) {
      return null;
    }

    return admin;
  }

  async login(admin: Admin) {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  }

  async forgotPassword(email: string) {
    const admin = await this.adminsService.findByEmail(email);
    if (!admin) {
      // Don't reveal if user exists
      return { message: 'If this email exists, a password reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.adminsService.update(admin.id, admin);
    await this.mailService.sendPasswordResetEmail(email, token);

    return { message: 'If this email exists, a password reset link has been sent.' };
  }

  async verifyResetToken(token: string) {
    console.log('Verifying token:', token);
    const admin = await this.adminsService.findOneByResetToken(token);
    console.log('Admin found:', admin ? admin.email : 'null');
    console.log('Expires:', admin?.resetPasswordExpires);
    console.log('Now:', new Date());

    if (!admin || !admin.resetPasswordExpires || admin.resetPasswordExpires < new Date()) {
      console.log('Validation failed');
      throw new BadRequestException('Invalid or expired password reset token');
    }

    return { email: admin.email };
  }

  async resetPassword(token: string, newPassword: string) {
    const admin = await this.adminsService.findOneByResetToken(token);

    if (!admin || !admin.resetPasswordExpires || admin.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetPasswordToken = null;
    admin.resetPasswordExpires = null;

    await this.adminsService.update(admin.id, admin);

    return { message: 'Password reset successfully' };
  }
}
