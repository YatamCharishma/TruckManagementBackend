import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import express, { Express, NextFunction, Request, Response } from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const server = app.getHttpAdapter().getInstance() as any;
  const expressApp = server as Express;
  const PORT = 3000;
  const sessionOptions = {
    secret: 'dancing-pickles-in-moonlight',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 3600 * 1000 * 2,
    },
  };
  app.use(cors());
  app.setGlobalPrefix('api');
  app.use(session(sessionOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
