import { Injectable } from '@nestjs/common';

/**
 * @deprecated
 */
@Injectable()
export class FilesService {
	constructor() {}
	async saveFile(file: Express.Multer.File, dest: string) {
		// console.log('provider: ', file)
	}
}
