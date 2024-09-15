import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmOptions } from './config/typeorm.config';
import {  ProfModule } from './prof/prof.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseExceptionFilter } from './common/filters/response-exception.filter';
import * as winston from 'winston';

import { WinstonModule } from 'nest-winston';
import { LoggerMiddleware } from './common/middlewares/LoggerMiddleware';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AccountModule } from './account/account.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AuthService } from './auth/auth.service';
import { Helper } from './common/helpers';
import { ClassModule } from './class/class.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(typeOrmOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        ...typeOrmOptions,
        // synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ProfModule,

    // i18n translator module
    I18nModule.forRoot({
      fallbackLanguage: 'ar',
      loaderOptions: {
        path: path.join(__dirname, '..', '/src/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),

    // winston logger
    WinstonModule.forRoot({
      format: winston.format.combine(winston.format.simple()),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: path.join(__dirname, './../logs/'),
          filename: 'nest-formation.log',
        }),
      ],
    }),

    MorganModule,
    AuthModule,
    AccountModule,
    ClassModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    {
      provide: APP_FILTER,
      // useClass: HttpExceptionFilter,
      useClass: ResponseExceptionFilter,
    },
    LoggerMiddleware,
  ],
})
export class AppModule {
  constructor(
    private dataSource: DataSource,
    private authService: AuthService,
  ) {
    Helper.dataSource = this.dataSource;
    // You might need to handle this better depending on your framework
  }
}
