import { Global, Module } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Poder usarlo donde queramos un porcion de un servicio o algo
// Entonces esto te permite no tener q declararlo en todos lados.
@Global()
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
