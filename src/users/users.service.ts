import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../utils/auth.service';
import { UpdateProfile, UserCreateDTO } from './users.dto';

@Injectable()
export class UsersService {
	constructor(@InjectModel('Users') private usersModel: Model<any>,
		private authService: AuthService,) { }

	public async getUserById(userId: String): Promise<UserCreateDTO> {
		const user = await this.usersModel.findById(userId);
		return user;
	}

	public async getUserByEmail(email: string): Promise<UserCreateDTO> {
		const user = await this.usersModel.findOne({ email: email });
		return user;
	}

	public async updateProfile(Id: string, data: UpdateProfile): Promise<UserCreateDTO> {
		if (data.password) {
			const { salt, hashedPassword } = await this.authService.hashPassword(data.password);
			data.salt = salt;
			data.password = hashedPassword;
		}
		const user = await this.usersModel.findByIdAndUpdate(Id, data);
		return user
	}
    
	public async getUserByEmailforFacebook(email: String): Promise<UserCreateDTO> {
		const user = await this.usersModel.findOne({ $or: [{ email: email }, { facebookEmail: email }] });
		return user;
	}

	public async getUserByEmailforGoogle(email: String): Promise<UserCreateDTO> {
		const user = await this.usersModel.findOne({ $or: [{ email: email }, { googleEmail: email }] });
		return user;
	}

	public async createUserWithSocial(userData: UserCreateDTO): Promise<UserCreateDTO> {
		if (userData.email) userData.email = userData.email.toLowerCase();
		const user = await this.usersModel.create(userData);
		return user;
	}
}
