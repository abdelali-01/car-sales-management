import { Admin } from '../entities/admin.entity';

export class AdminResponseDto {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: Date;

    static fromEntity(admin: Admin): AdminResponseDto {
        const dto = new AdminResponseDto();
        dto.id = admin.id;
        dto.name = admin.name;
        dto.email = admin.email;
        dto.role = admin.role;
        dto.createdAt = admin.createdAt;
        return dto;
    }

    static fromEntities(admins: Admin[]): AdminResponseDto[] {
        return admins.map(admin => AdminResponseDto.fromEntity(admin));
    }
}
