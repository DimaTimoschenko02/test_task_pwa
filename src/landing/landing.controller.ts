import { Controller, Get, Headers, Header, Ip } from '@nestjs/common';
import { LandingService } from './landing.service';

@Controller()
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Get('/')
  @Header('Content-Type', 'text/html; charset=utf-8')
  public async root(@Ip() ip: string, @Headers('user-agent') ua: string): Promise<string> {
    const result = await this.landingService.resolve(ip || '', ua || '');
    return result.html;
  }
}
