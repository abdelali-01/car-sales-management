import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
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
    origin: true, // Configure this to specific origins in production
    credentials: true,
  });

  // Session configuration with PostgreSQL store
  const PgSession = connectPgSimple(session);
  app.use(
    session({
      // store: new PgSession({
      //   conString: configService.get('DATABASE_URL'),
      //   tableName: 'session',
      //   createTableIfMissing: true,
      //   conObject: {
      //     ssl: { rejectUnauthorized: false },
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
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
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
