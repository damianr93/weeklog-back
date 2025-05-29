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
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) { }

  @Post()
  create(@Body() dto: CreateDriverDto, @Request() req: any) {
    const roleUser = req.user?.role;
    if (roleUser !== "ADMIN" && roleUser !== "OPERATOR") {
      throw new ForbiddenException('Only ADMIN or OPERATOR can create drivers');
    }

    return this.driversService.create(dto);
  }

  @Get()
  findAll(@Request() req: any) {
    const roleUser = req.user?.role;
    if (roleUser !== "ADMIN" && roleUser !== "OPERATOR") {
      throw new ForbiddenException('Only ADMIN or OPERATOR can view drivers');
    }

    return this.driversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const roleUser = req.user?.role;
    if (roleUser !== "ADMIN" && roleUser !== "OPERATOR") {
      throw new ForbiddenException('Only ADMIN or OPERATOR can view drivers');
    }

    return this.driversService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDriverDto, @Request() req: any) {
    const roleUser = req.user?.role;
    if (roleUser !== "ADMIN" && roleUser !== "OPERATOR") {
      throw new ForbiddenException('Only ADMIN or OPERATOR can update drivers');
    }

    return this.driversService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const roleUser = req.user?.role;
    if (roleUser !== "ADMIN" && roleUser !== "OPERATOR") {
      throw new ForbiddenException('Only ADMIN can delete drivers');
    }

    return this.driversService.remove(+id);
  }
}
