import { Injectable } from '@nestjs/common';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { createParamDecorator } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET,
		});
		if (!process.env.SECRET) console.log("SECRET not set.");
	}

	async validate(payload) {
		const { _id } = payload;
		const userInfo = await this.usersService.getUserById(_id);
		return userInfo;
	}
}

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info, context) {
		return user;
	}

}

export const GetUser = createParamDecorator((data, req) => {
	const request = req.switchToHttp().getRequest();
    return request.user;

});