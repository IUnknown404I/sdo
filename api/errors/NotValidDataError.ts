import { HttpException, HttpStatus } from '@nestjs/common';

export class NotValidDataError extends HttpException {
	constructor(readonly message: string = 'Incorrect data transmitted!') {
		super(message, HttpStatus.BAD_REQUEST);
	}
}
