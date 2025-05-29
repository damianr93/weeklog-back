import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post()
  create(@Body() createClientDto: CreateClientDto, @Request() req: any) {
    const roleUser = req.user?.role;
    console.log('Role of user:', roleUser);
    if (roleUser !== 'ADMIN' && roleUser !== 'OPERATOR') {
      throw new ForbiddenException('Only ADMIN can delete clients');
    }

    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll(@Request() req: any) {
    const roleUser = req.user?.role;
    console.log('Role of user:', roleUser);
    if (roleUser !== 'ADMIN' && roleUser !== 'OPERATOR') {
      throw new ForbiddenException('Only ADMIN and OPERATOR can see clients');
    }

    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const roleUser = req.user?.role;
    if (roleUser !== 'ADMIN' && roleUser !== 'OPERATOR') {
      throw new ForbiddenException('Only ADMIN can see client');
    }

    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto, @Request() req: any) {
    const roleUser = req.user?.role;
    if (roleUser !== 'ADMIN' && roleUser !== 'OPERATOR') {
      throw new ForbiddenException('Only ADMIN can update client');
    }

    return this.clientsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const roleUser = req.user?.role;
    if (roleUser !== 'ADMIN' && roleUser !== 'OPERATOR') {
      throw new ForbiddenException('Only ADMIN can delete clients');
    }

    return this.clientsService.remove(+id);
  }
}
