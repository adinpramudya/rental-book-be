import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ email: string; access_token: string; refresh_token: string }> {
    const user = await this.userService.findOneByUsernameOrEmail(username);

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    if (!user.isActive) {
      throw new NotFoundException();
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
    };
    return {
      email: user.email,
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
    };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const newAccessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      });
      const newRefreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '2d',
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
