import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ClassSerializerInterceptor, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanResponseDto } from 'src/plan/dto/plan-response.dto';
import { Souscription } from './entities/subscription.entity';
import { SouscriptionResponseDto } from './dto/subscription-response.dto';

@Controller('api/v1/subscriptions')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('Subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Subscription created successfully.', type: SouscriptionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<SouscriptionResponseDto> {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of subscriptions retrieved successfully.', type: [SouscriptionResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll(): Promise<SouscriptionResponseDto[]> {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Subscription retrieved successfully.', type: SouscriptionResponseDto })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })  
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SouscriptionResponseDto> {
    return this.subscriptionService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Subscription updated successfully.', type: SouscriptionResponseDto })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSubscriptionDto: UpdateSubscriptionDto): Promise<SouscriptionResponseDto> {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Subscription deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.subscriptionService.remove(id);
  }
}
