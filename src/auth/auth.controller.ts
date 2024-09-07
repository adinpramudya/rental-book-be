import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiMaster } from 'src/constant';

@Controller(ApiMaster)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: { refreshToken: string }) {
    return this.authService.refresh(refreshDto.refreshToken);
  }
}
