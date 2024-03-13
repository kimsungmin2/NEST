import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PointService } from './point.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}
}
