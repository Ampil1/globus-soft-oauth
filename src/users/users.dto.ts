import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length, Max } from 'class-validator';



export class ImageDTO {

	@ApiModelProperty()
	imageUrl: string;

	@ApiModelProperty()
	imageId: string
}
export class UserCreateDTO {
	_id: string
	@ApiModelProperty()
	@IsString()
	fullName: string;

	@ApiModelProperty()
	@IsString()
	@IsNotEmpty()
	email: string;

	@ApiModelProperty()
	@IsString()
	@IsNotEmpty()
	@Length(6, 15)
	password: string

	@ApiModelProperty()
	@IsString()
	@IsNotEmpty()
	images: ImageDTO;

	@ApiModelProperty()
	@IsNotEmpty()
	skills: [];
	role?: string
	salt?: string;
}
export class UpdateProfile {
	_id: string
	@ApiModelProperty()
	fullName: string;

	@ApiModelProperty()
	password: string

	@ApiModelProperty()
	images: ImageDTO;

	@ApiModelProperty()
	skills: [];
	salt?: string
}

export class LoginDTO {
	@ApiModelProperty()
	@IsNumber()
	email: string;

	@ApiModelProperty()
	@IsString()
	password: string;
}

export class LoginResponseDTO {
	@ApiModelProperty()
	@IsString()
	token: string;

	@ApiModelProperty()
	@IsString()
	role: string;

	@ApiModelProperty()
	@IsString()
	id: string;
}

export class ResponseLogin {
	@ApiModelProperty()
	@IsString()
	response_code: string;

	@ApiModelProperty()
	response_data: LoginResponseDTO;
}
export class ResponseSuccessMessage {
	@ApiModelProperty()
	@IsString()
	response_code: string;


	@ApiModelProperty()
	@IsString()
	response_data: string;
}

export class ResponseBadRequestMessage {

	@ApiModelProperty()
	@IsNumber()
	status: number;

	@ApiModelProperty()
	errors: Array<string>;

}
export class ResponseErrorMessage {

	@ApiModelProperty()
	@IsNumber()
	status: number;

	@ApiModelProperty()
	@IsString()
	message: string;
}

export class SocialDTO {
	@IsString()
	@IsNotEmpty()
	@ApiModelProperty()
	token: string;
}