import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users.schema';
import { AuthService } from '../utils/auth.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
	],
	controllers: [UsersController],
	providers: [UsersService, AuthService],
	exports: [UsersService, MongooseModule]
})
export class UsersModule { }
