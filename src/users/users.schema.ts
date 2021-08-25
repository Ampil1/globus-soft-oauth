import { Schema } from 'mongoose';


export enum Provider {
	FACEBOOK = 'FACEBOOK',
	GOOGLE = 'GOOGLE',
}
export const UserSchema = new Schema({
    fullNmae: { type: String },
    email: { type: String, trim: true, lowercase: true, sparse: true },
    password: { type: String },
    salt: { type: String },
    role: { type: String },
    provider: { type: Provider },
	facebookEmail: { type: String },
	googleEmail: { type: String },
    facebookId: { type: String },
	googleId: { type: String },
}, {
    timestamps: true
});
