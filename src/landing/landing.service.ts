import { Injectable } from '@nestjs/common';
import { TrafficService } from '../traffic/traffic.service';
import { LoggingService } from '../logging/logging.service';
import { promises as fs } from 'fs';
import { join } from 'path';

interface PageResult {
  html: string;
  passed: boolean;
  reason: string;
  os?: string;
  country?: string;
}

@Injectable()
export class LandingService {
  private cache: { white?: string; black?: string } = {};

  constructor(
    private readonly trafficService: TrafficService,
    private readonly loggingService: LoggingService,
  ) {}

  private async loadTemplate(name: 'white' | 'black'): Promise<string> {
    if (this.cache[name]) return this.cache[name]!;

    const file = join(process.cwd(), 'src', 'landing', 'templates', `${name}.html`);
    try {
      const html = await fs.readFile(file, 'utf8');
      this.cache[name] = html;

      return html;
    } catch {
      const fallback = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>${name}</title></head><body><h1>${name}</h1></body></html>`;
      this.cache[name] = fallback;

      return fallback;
    }
  }

  public async resolve(ip: string, ua: string): Promise<PageResult> {
    const decision = await this.trafficService.evaluate(ip, ua);
    const template = decision.passed
      ? await this.loadTemplate('black')
      : await this.loadTemplate('white');

    await this.loggingService.log({
      ip,
      country: decision.country,
      os: decision.os,
      userAgent: ua,
      passed: decision.passed,
      reason: decision.reason,
      createdAt: new Date(),
    });

    return {
      html: template,
      passed: decision.passed,
      reason: decision.reason,
      os: decision.os,
      country: decision.country,
    };
  }
}
