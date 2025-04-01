import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { RelacionPlantaProductosService } from './relacion-planta-productos.service';
import { ActualizarProductosPlantaDto, AsignarMultiplesProductosPlantaDto, AsignarProductoPlantaDto, OperacionExitosaDto, PlantaProductoResponseDto } from './dto/create-relacion-planta-producto.dto';

@Controller('relacion-planta-productos')
export class RelacionPlantaProductosController {
  constructor(private readonly relacionPlantaProductosService: RelacionPlantaProductosService) {}

  @Post()
  async asignarProducto(
    @Body() dto: AsignarProductoPlantaDto
  ): Promise<PlantaProductoResponseDto> {
    return this.relacionPlantaProductosService.asignarProductoAPlanta(dto.plantaId, dto.productoId);
  }

  @Post('multiple')
  async asignarMultiplesProductos(
    @Body() dto: AsignarMultiplesProductosPlantaDto
  ): Promise<OperacionExitosaDto> {
    await this.relacionPlantaProductosService.asignarProductosAPlanta(dto.plantaId, dto.productoIds);
    return { success: true, message: 'Productos asignados correctamente' };
  }

  @Get('planta/:plantaId')
  async getProductosByPlanta(@Param('plantaId') plantaId: number) {
    return this.relacionPlantaProductosService.getProductosByPlantaId(plantaId);
  }

  @Get('producto/:productoId')
  async getPlantasByProducto(@Param('productoId') productoId: number) {
    return this.relacionPlantaProductosService.getPlantasByProductoId(productoId);
  }

  @Put('planta/:plantaId')
  async actualizarProductosPlanta(
    @Param('plantaId') plantaId: number,
    @Body() dto: ActualizarProductosPlantaDto
  ): Promise<OperacionExitosaDto> {
    await this.relacionPlantaProductosService.actualizarProductosDePlanta(plantaId, dto.productoIds);
    return { success: true, message: 'Productos de la planta actualizados correctamente' };
  }

  @Delete('planta/:plantaId/producto/:productoId')
  async eliminarProductoDePlanta(
    @Param('plantaId') plantaId: number,
    @Param('productoId') productoId: number
  ): Promise<OperacionExitosaDto> {
    await this.relacionPlantaProductosService.eliminarProductoDePlanta(plantaId, productoId);
    return { success: true, message: 'Producto eliminado de la planta correctamente' };
  }
}

