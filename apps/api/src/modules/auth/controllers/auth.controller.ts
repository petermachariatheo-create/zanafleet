import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { ZodError } from 'zod';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { LoginCommand } from '../commands/login.command';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { LoginResult } from '../handlers/login.handler';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ auth: { limit: 10, ttl: 60000 } }) // 10 requests per minute for login
  async login(@Body() body: LoginDto, @Res() res: Response): Promise<LoginResponseDto> {
    try {
      const input = LoginCommand.validate(body);
      const command = new LoginCommand(input);

      const result = await this.commandBus.execute<LoginCommand, LoginResult>(command);

      // Add deprecation headers to the response
      res.set('Deprecation', 'true');
      res.set('Sunset', 'Sat, 01 Jan 2027 00:00:00 GMT');
      res.set('Link', '<https://docs.zanafleet.com/auth-migration>; rel="deprecation"');

      const response: LoginResponseDto = {
        actorId: result.actorId,
        workspaceId: result.workspaceId,
        type: result.type,
        token: result.token,
        expiresAt: result.expiresAt,
      };

      return response;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw this.createValidationException(error);
      }
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ auth: { limit: 20, ttl: 60000 } }) // 20 requests per minute for refresh
  async refresh(@Body() body: { token: string }) {
    const { token } = body;

    if (!token || typeof token !== 'string') {
      throw new BadRequestException('Token is required');
    }

    const secret =
      this.configService.get<string>('auth.jwt.secret') ||
      'INSECURE_DEV_SECRET_CHANGE_IN_PRODUCTION';

    const payload = await this.jwtService.verifyAsync<{
      sub: string;
      email: string;
      workspaceId: string;
      roles: string[];
    }>(token, { secret });

    const newToken = this.jwtService.sign(payload);

    const expiresIn = this.configService.get<string>('auth.jwt.expiresIn') || '1h';
    const expiresAt = new Date(Date.now() + this.parseExpirationTime(expiresIn));

    return {
      token: newToken,
      expiresAt,
    };
  }

  private parseExpirationTime(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600 * 1000;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 3600 * 1000,
      d: 86400 * 1000,
    };
    return value * (multipliers[unit] || 3600 * 1000);
  }

  private createValidationException(error: ZodError): BadRequestException {
    return new BadRequestException({
      message: 'Validation failed',
      issues: error.issues.map(({ path, message, code }) => ({
        path,
        message,
        code,
      })),
    });
  }
}
