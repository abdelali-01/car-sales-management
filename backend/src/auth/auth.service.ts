import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(private adminsService: AdminsService) {}

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
}
