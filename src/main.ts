import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const port = process.env.PORT ?? 3001;

  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));

  app.enableCors({
    origin: (origin, callback) => {
      console.log("origin", origin);
      // Allow requests with no origin (Postman, mobile apps, server-to-server).
      if (!origin) return callback(null, true);
      // In dev, allow any localhost origin regardless of port.
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');

  console.log(`Mock server running on port ${port}`);
}
bootstrap();
