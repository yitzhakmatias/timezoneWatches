import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (await this.usersService.findByEmail(dto.email)) {
      throw new ConflictException('Email already registered')
    }
    const user = await this.usersService.create(dto.email, dto.name, dto.password)
    const token = this.jwtService.sign({ sub: user.id, email: user.email })
    return { access_token: token, user: { id: user.id, email: user.email, name: user.name } }
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email })
    return { access_token: token, user: { id: user.id, email: user.email, name: user.name } }
  }
}
