import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ClassSerializerInterceptor, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { SportService } from './sport.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SportResponseDto } from './dto/sport-response.dto';

@Controller('api/v1/sports')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('Sports')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Plan created successfully.', type: SportResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createSportDto: CreateSportDto): Promise<SportResponseDto> {
    return this.sportService.create(createSportDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of sports retrieved successfully.', type: [SportResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(): Promise<SportResponseDto[]> {
    return this.sportService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Sport retrieved successfully.', type: SportResponseDto })
  @ApiResponse({ status: 404, description: 'Sport not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SportResponseDto> {
    return this.sportService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Sport updated successfully.', type: SportResponseDto })
  @ApiResponse({ status: 404, description: 'Sport not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSportDto: UpdateSportDto): Promise<SportResponseDto> {
    return this.sportService.update(id, updateSportDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Sport deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Sport not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.sportService.remove(id);
  }
}
