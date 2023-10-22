import { HttpException, HttpStatus } from '@nestjs/common';

export class AccessError extends HttpException {
	constructor(readonly message: string = "You don't have enough access rights for this operation!") {
		super(message, HttpStatus.UNAUTHORIZED);
	}
}
