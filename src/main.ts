import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  
		let options = new DocumentBuilder().setTitle('App').setBasePath("/").setVersion('v1').addBearerAuth().setSchemes('https', 'http').build();
		const document = SwaggerModule.createDocument(app, options, {
			include: [ UsersModule]
		});
		SwaggerModule.setup('/explorer', app, document);
	
  await app.listen(3000);
}
bootstrap();
