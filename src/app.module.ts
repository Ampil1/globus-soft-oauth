import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';


import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/jwt.strategy';

import * as dotenv from 'dotenv';


dotenv.config();

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_DB_URL_STAGING,
        useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.SECRET, signOptions: { expiresIn: '1d' } }),
    UsersModule,

  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,

  ],
  exports: [
    UsersModule,
    MongooseModule,
    PassportModule,
    JwtModule,
    JwtStrategy
  ]
})

export class AppModule {

}
