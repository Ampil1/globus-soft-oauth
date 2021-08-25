import { Body, Controller, Get, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/utils/auth.service';
import { GetUser } from 'src/utils/jwt.strategy';
import { LoginDTO, ResponseBadRequestMessage, ResponseErrorMessage, ResponseLogin, ResponseSuccessMessage, SocialDTO, UpdateProfile, UserCreateDTO } from './users.dto';
import { Provider, } from './users.schema';
import { UsersService } from './users.service';
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

@Controller('users')
export class UsersController {
	constructor(
		private userService: UsersService,
		private authService: AuthService,
	) { }
	@Get('/me/profile')
	@ApiOperation({ title: 'Get profile' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async meProfile(@GetUser() user: UserCreateDTO): Promise<any> {
		try {
			const response = await this.userService.getUserById(user._id,);
			if (response) return { response_code: HttpStatus.OK, response_data: response };
			else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
		} catch (e) {
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}

	@Put('/update/profile')
	@ApiOperation({ title: 'Get profile' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async updateProfile(@GetUser() user: UserCreateDTO, @Body() data: UpdateProfile): Promise<any> {
		try {
			const response = await this.userService.updateProfile(user._id, data);
			if (response) return { response_code: HttpStatus.OK, response_data: "profile update successfully" };
			else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
		} catch (e) {
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}


	@Post('/facebook-login')
	@ApiOperation({ title: 'Facebook login' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	public async facebookLogin(@Body() facebookData: SocialDTO): Promise<any> {
		try {
			const { data } = await axios({
				url: 'https://graph.facebook.com/me',
				method: 'get',
				params: {
					fields: ['id', 'email', 'first_name', 'last_name'].join(','),
					access_token: facebookData.token,
				},
			});
			console.log("=======data=========", data);
			let user;
			if (data.email) {
				console.log("2222222222222222222222222")
				user = await this.userService.getUserByEmailforFacebook(data.email);
				if (!user) {
					console.log('33333333333333333333333333')
					let userData: any = {};
					userData.firstName = data.first_name;
					userData.lastName = data.last_name;
					userData.email = data.email;
					userData.mobileNumber = data.mobileNumber || data.id;
					userData.isMobileNumberAdded = false;
					userData.facebookEmail = data.email;
					userData.role = "USER";
					userData.facebookId = data.id;
					userData.provider = Provider.FACEBOOK;
					userData.isPassword = false;
					user = await this.userService.createUserWithSocial(userData);
				}
				const token = await this.authService.generateAccessToken(user._id, user.role);
				const resData ={ token: token, role: user.role, id: user._id, }
				return {response_code: HttpStatus.OK, response_data:resData};
			} else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
		} catch (e) {
			console.log("sssssssssssssss",e.message)
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}

	@Post('/google-login')
	@ApiOperation({ title: 'Google login' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	public async googleLogin(@Body() googleData: SocialDTO): Promise<any> {
		try {
			let data: any;
			async function verify() {
				const payload = await client.verifyIdToken({
					idToken: googleData.token,
					audience: [process.env.CLIENT_ID_1, process.env.CLIENT_ID_2]  // Specify the CLIENT_ID of the app that accesses the backend
					// Or, if multiple clients access the backend:
					//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
				});
				data = payload.getPayload();
			}
			await verify()
			let user;
			if (data.email) {
				user = await this.userService.getUserByEmailforGoogle(data.email);
				if (!user) {
					let userData: any = {};
					userData.firstName = data.given_name;
					userData.lastName = data.family_name;
					userData.email = data.email;
					userData.googleEmail = data.email;
					userData.mobileNumber = data.mobileNumber || data.sub;
					userData.isMobileNumberAdded = false;
					userData.role = "USER";
					userData.googleId = data.sub;
					userData.provider = Provider.GOOGLE;
					userData.isPassword = false;
					user = await this.userService.createUserWithSocial(userData);
				}
				const token = await this.authService.generateAccessToken(user._id, user.role);
				const resData ={ token: token, role: user.role, id: user._id, }
				return {response_code: HttpStatus.OK, response_data:resData};
			} else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
		} catch (e) {
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}
}
