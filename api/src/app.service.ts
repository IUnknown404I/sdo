import { Get, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Injectable()
export class AppService {
	@ApiTags('Onyx')
	@Get()
	getHello(): string {
		return 'You have sent a service request to API of Educational platform of the Engineering scientific and Educational Center. Gazprom Mezhregiongaz Engineering.';
	}
}
