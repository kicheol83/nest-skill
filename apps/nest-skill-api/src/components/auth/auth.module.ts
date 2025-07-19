import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_TIMER } from '../../libs/config';

@Module({
	imports: [
		HttpModule,
		JwtModule.register({
			secret: `${process.env.SECRET_TOKEN}`,
			signOptions: { expiresIn: `${AUTH_TIMER}d` },
		}),
	],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
