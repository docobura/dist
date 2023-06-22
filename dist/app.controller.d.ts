import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { LoginDto, RegisterDto } from './user.entity';
export declare class AppController {
    private readonly appService;
    private jwtService;
    constructor(appService: AppService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<import("./user.entity").User>;
    login(loginDto: LoginDto, response: Response): Promise<{
        message: string;
    }>;
    user(request: Request): Promise<import("./user.entity").User>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
