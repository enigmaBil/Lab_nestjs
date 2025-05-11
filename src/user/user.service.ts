import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserRole } from 'src/common/user-role.enum';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from './dto/user-response.dto';
import { use } from 'passport';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  onModuleInit() {
    this.createAdminUser();
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    let { email, password, ...userData } = createUserDto;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOneBy({ email: email });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }
    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(12);
    const originalPassword = password;
    password = await bcrypt.hash(originalPassword, salt);

    // Transformer le DTO en entité
    const user = this.userRepository.create({email, password, ...userData, role: userData.role as UserRole});

    // Envoi des parametres de connexion
    await this.mailService.sendWelcomeEmail(user.email, user.name, originalPassword);
    await this.userRepository.save(user);
    
    
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({relations: ['subscriptions', 'gyms']});
    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }

  async findUserByEmail(email: string): Promise<User|null> {
    if (!email) {
      throw new NotFoundException('Email non fourni.');
    }

    const user = await this.userRepository.findOne({ where: {email}, relations: ['subscriptions', 'gyms'] });
    if (!user) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'email ${email}.`);
    }
    return user;
  }

  async findOne(id: number): Promise<UserResponseDto> {
    if (!id) {
      throw new NotFoundException('ID non fourni.');
    }
    const user = await this.userRepository.findOne({ where: { id }, relations: ['subscriptions', 'gyms'] });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas.`);
    }
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    let { email, password, ...userData } = updateUserDto;
    const existingUser = await this.userRepository.preload({ id, ...userData, role: userData.role as UserRole });
    if (!existingUser) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas.`);
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    await this.userRepository.save(existingUser);
    return plainToInstance(UserResponseDto, existingUser, { excludeExtraneousValues: true });
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas.`);
    }
    await this.userRepository.remove(user);
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException('Token invalide ou expiré', HttpStatus.BAD_REQUEST);
    }
  }

  private async createAdminUser() {
    console.log('creating admin user ...');
    const adminEmail = 'admin@gym.tn';
    const existingAdmin = await this.userRepository.findOneBy({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('password', 12);

      const adminUser = this.userRepository.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.userRepository.save(adminUser);
      console.log('✅ Admin account created successfully!');
    } else {
      console.log('⚠️ Admin already exists. Skipping seeding.');
    }
  }
}
