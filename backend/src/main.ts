import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'offers');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS with credentials support
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
    credentials: true,
  });

  // Session configuration with PostgreSQL store
  const PgSession = connectPgSimple(session);
  const databaseUrl = configService.get('DATABASE_URL');

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  app.use(
    session({
      // NOTE: Using in-memory sessions for development
      // PGStore session persistence disabled to avoid localhost:5432 connection errors
      // The DATABASE_URL is correctly used by TypeORM, but connect-pg-simple 
      // requires additional pool configuration for SSL that we'll set up for production
      // store: new PgSession({
      //   conString: databaseUrl,
      //   tableName: 'session',
      //   createTableIfMissing: true,
      //   ssl: {
      //     rejectUnauthorized: false,
      //   },
      // }),
      secret:
        configService.get<string>('SESSION_SECRET') ||
        'fallback-secret-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: configService.get<string>('NODE_ENV') === 'production',
        sameSite: configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      },
    }),
  );

  // Passport initialization (MUST come after session middleware)
  app.use(passport.initialize());
  app.use(passport.session());

  // Global API prefix
  app.setGlobalPrefix('api');

  const port = configService.get('PORT') ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
