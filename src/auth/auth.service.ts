import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

type SignInData = { id: number; email: string };
type AuthResponse = { accessToken: string; refreshToken: string; user: SignInData };

@Injectable()
export class AuthService {
  constructor(
  private readonly usersService: UserService,
  private readonly jwtService: JwtService,
) {}

async authenticate(loginDTO: LoginDTO): Promise<AuthResponse> {
  const user = await this.usersService.findUserByEmail(loginDTO.email);

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);
  if (!passwordMatched) {
    throw new UnauthorizedException('Password does not match');
  }

  const payload = { email: user.email, sub: user.id, role: user.role };
  const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
  const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
}

logout(): { message: string } {
  // Rien à faire côté serveur sans cookies, le client doit simplement supprimer son token
  return { message: 'Déconnexion réussie.' };
}

async refreshTokens(authorizationHeader: string): Promise<AuthResponse> {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Token manquant');
  }

  const refreshToken = authorizationHeader.split(' ')[1];

  try {
    const payload = await this.jwtService.verifyAsync(refreshToken);

    const user = await this.usersService.findUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé.');
    }

    const newAccessToken = this.jwtService.sign(
      { email: user.email, sub: user.id, role: user.role },
      { expiresIn: '15m' },
    );
    const newRefreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id, role: user.role },
      { expiresIn: '7d' },
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, email: user.email },
    };
  } catch (error) {
    throw new UnauthorizedException('Token de rafraîchissement invalide.');
  }
}

}
