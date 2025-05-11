import { Controller, Get, Post, Body, Request, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { PassportJwtGuard } from 'src/common/guards/passport-jwt/passport-jwt.guard';


@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDTO: LoginDTO) {
      return this.authService.authenticate(loginDTO);
    }

    @HttpCode(HttpStatus.OK)
    @Get('me')
    @UseGuards(PassportJwtGuard)
    userInfo(@Request() request) {
      return request.user;
    }

    @Post('logout')
    logout() {
      return this.authService.logout();
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    refreshTokens(@Request() request) {
      const authHeader = request.headers['authorization'];
      return this.authService.refreshTokens(authHeader);
    }


}
