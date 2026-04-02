import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

export interface User {
  id: number
  email: string
  name: string
  passwordHash: string
  createdAt: Date
}

@Injectable()
export class UsersService {
  private users: User[] = []
  private nextId = 1

  async create(email: string, name: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10)
    const user: User = { id: this.nextId++, email, name, passwordHash, createdAt: new Date() }
    this.users.push(user)
    return user
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email)
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id)
  }
}
