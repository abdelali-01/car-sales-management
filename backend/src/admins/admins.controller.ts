import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '../common/enums/admin-role.enum';

@Controller('admins')
@UseGuards(SessionAuthGuard, RolesGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) { }

  @Post()
  @Roles(AdminRole.SUPER_ADMIN)
  async create(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.adminsService.create(createAdminDto);
    return AdminResponseDto.fromEntity(admin);
  }

  @Get()
  @Roles(AdminRole.SUPER_ADMIN)
  async findAll() {
    const admins = await this.adminsService.findAll();
    return AdminResponseDto.fromEntities(admins);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const admin = await this.adminsService.findOne(id);
    return AdminResponseDto.fromEntity(admin);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const admin = await this.adminsService.update(id, updateAdminDto);
    return AdminResponseDto.fromEntity(admin);
  }

  @Delete(':id')
  @Roles(AdminRole.SUPER_ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.adminsService.remove(id);
    return { message: 'Admin deleted successfully' };
  }
}
