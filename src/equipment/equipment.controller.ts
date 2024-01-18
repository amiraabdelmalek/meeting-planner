import { Controller, Get } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { Equipment } from './entities/equipment.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  findAll(): Promise<Equipment[]> {
    return this.equipmentService.findAll();
  }
}
