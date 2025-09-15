import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AppConfigService } from './app-config.service';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';
import { AppConfigEntity } from './entities/app-config.entity';

@ApiTags('App-config')
@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  @ApiOperation({ summary: 'List configs' })
  @ApiOkResponse({ type: [AppConfigEntity] })
  public findAll() {
    return this.appConfigService.findAll();
  }

  @Get('/manifest.json')
  @Header('Content-Type', 'application/manifest+json')
  public async manifest() {
    return this.appConfigService.manifest();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active config' })
  @ApiOkResponse({ type: AppConfigEntity })
  public getActive() {
    return this.appConfigService.getActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: AppConfigEntity })
  public findOne(@Param('id') id: string) {
    return this.appConfigService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create config' })
  @ApiCreatedResponse({ type: AppConfigEntity })
  @ApiBadRequestResponse()
  public create(@Body() dto: CreateAppConfigDto) {
    return this.appConfigService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: 'Update config' })
  @ApiOkResponse({ type: AppConfigEntity })
  public update(@Body() dto: UpdateAppConfigDto) {
    return this.appConfigService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete config' })
  @ApiOkResponse({ description: 'Deleted' })
  public async remove(@Param('id') id: string) {
    await this.appConfigService.remove(id);
    return { ok: true };
  }

  @Patch('activate/:id')
  @ApiOperation({ summary: 'Activate config' })
  public async activate(@Param('id') id: string) {
    return this.appConfigService.activate(id);
  }
}
