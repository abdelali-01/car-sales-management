import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AdminsService } from '../../admins/admins.service';
import { Admin } from '../../admins/entities/admin.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private adminsService: AdminsService) {
    super();
  }

  serializeUser(
    admin: Admin,
    done: (err: Error | null, id?: number) => void,
  ): void {
    done(null, admin.id);
  }

  async deserializeUser(
    id: number,
    done: (err: Error | null, admin?: Admin) => void,
  ): Promise<void> {
    try {
      const admin = await this.adminsService.findOne(id);
      done(null, admin);
    } catch (error) {
      done(error);
    }
  }
}
