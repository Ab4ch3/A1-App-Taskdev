import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserToProjectDTO } from './dto/userToProject.dto';
import { UsersService } from './services/users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() newUser: CreateUserDto) {
    return this.usersService.create(newUser);
  }
  @Post('add-to-project')
  addToProject(@Body() user: UserToProjectDTO) {
    return this.usersService.joinToProject(user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @PublicAccess()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.usersService.update(id, updateUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
