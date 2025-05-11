import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PlanResponseDto } from './dto/plan-response.dto';

@Controller('api/v1/plans')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Plan created successfully.', type: PlanResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.planService.create(createPlanDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of plans retrieved successfully.', type: [PlanResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(): Promise<PlanResponseDto[]> {
    return this.planService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Plan retrieved successfully.', type: PlanResponseDto })
  @ApiResponse({ status: 404, description: 'Plan not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PlanResponseDto> {
    return this.planService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Plan updated successfully.', type: PlanResponseDto })
  @ApiResponse({ status: 404, description: 'Plan not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    return this.planService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Plan deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Plan not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.planService.remove(id);
  }
}
