import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
    private readonly uploadDir: string;
    private readonly backendUrl: string;

    constructor(private configService: ConfigService) {
        this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || 'uploads';
        const port = this.configService.get<string>('PORT') || '5000';
        this.backendUrl = `http://localhost:${port}`;
    }

    /**
     * Get the file URL for a given filename
     */
    getFileUrl(filename: string, folder: string = 'offers'): string {
        return `${this.backendUrl}/${this.uploadDir}/${folder}/${filename}`;
    }

    /**
     * Delete a single file from the filesystem
     */
    async deleteFile(filename: string, folder: string = 'offers'): Promise<void> {
        // Construct absolute path from project root
        const filePath = path.join(process.cwd(), this.uploadDir, folder, filename);

        console.log(`Attempting to delete file: ${filePath}`);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Successfully deleted file: ${filename}`);
            } else {
                console.warn(`File not found: ${filePath}`);
            }
        } catch (error) {
            console.error(`Error deleting file ${filename}:`, error);
            throw error;
        }
    }

    /**
     * Delete multiple files from the filesystem
     */
    async deleteMultipleFiles(
        filenames: string[],
        folder: string = 'offers',
    ): Promise<void> {
        const deletePromises = filenames.map((filename) =>
            this.deleteFile(filename, folder),
        );
        await Promise.all(deletePromises);
    }

    /**
     * Extract filename from a file URL
     * Example: /uploads/offers/123456-uuid.jpg -> 123456-uuid.jpg
     */
    extractFilename(url: string): string {
        const parts = url.split('/');
        return parts[parts.length - 1];
    }

    /**
     * Ensure upload directory exists
     */
    ensureUploadDirExists(folder: string = 'offers'): void {
        const dir = path.join(process.cwd(), this.uploadDir, folder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
}
