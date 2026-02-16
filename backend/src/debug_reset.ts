import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

const token = '5c95d553753fc40fa43d89ecea7607ed458351002443fa'; // Replace if changed

async function debugReset() {
    console.log('🌱 Starting debug reset...');
    const app = await NestFactory.create(AppModule);
    const authService = app.get(AuthService);

    try {
        console.log(`Testing token: ${token}`);
        const result = await authService.verifyResetToken(token);
        console.log('✅ Token verification successful:', result);
    } catch (error) {
        console.error('❌ Token verification failed:', error);
    } finally {
        await app.close();
    }
}

debugReset();
