import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, ParseIntPipe } from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GymResponseDto } from './dto/gym-response.dto';

@Controller('api/v1/gyms')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('Gyms')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: GymResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createGymDto: CreateGymDto): Promise<GymResponseDto> {
    return this.gymService.create(createGymDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'The records have been successfully retrieved.', type: [GymResponseDto] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<GymResponseDto[]> {
    return this.gymService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The records have been successfully retrieved.', type: GymResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GymResponseDto> {
    return this.gymService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: GymResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGymDto: UpdateGymDto
  ): Promise<GymResponseDto> {
    return this.gymService.update(id, updateGymDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.gymService.remove(id);
  }
}
