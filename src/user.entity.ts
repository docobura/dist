import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'example@example.com', description: 'User email' })
  email: string;

  @Column()
  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'example@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'example@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password', type: 'string' })
  password: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'example@example.com', description: 'User email' })
  email: string;
}
