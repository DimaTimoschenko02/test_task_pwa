import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import { UAParser } from 'ua-parser-js';
import * as geoip from 'geoip-lite';

export interface TrafficDecision {
  passed: boolean;
  reason: string;
  os?: string;
  country?: string;
}

@Injectable()
export class TrafficService {
  constructor(private readonly appConfigService: AppConfigService) {}

  public async evaluate(ip: string, userAgent: string): Promise<TrafficDecision> {
    const config = await this.appConfigService.getActive();
    const ua = new UAParser(userAgent || '');
    const osNameRaw = ua.getOS().name || '';
    const os = osNameRaw.toLowerCase().replace(/\s+/g, '');

    let country: string | undefined;
    if (ip) {
      try {
        const geo = geoip.lookup(ip);
        if (geo && geo.country) country = geo.country.toUpperCase();
      } catch {}
    }

    if (!os || !config.os_allow.includes(os)) {
      return { passed: false, reason: 'os_not_allowed', os, country };
    }

    if (config.country_allow.length > 0) {
      if (!country || !config.country_allow.includes(country)) {
        return { passed: false, reason: 'country_not_allowed', os, country };
      }
    }
    return { passed: true, reason: 'ok', os, country };
  }
}
