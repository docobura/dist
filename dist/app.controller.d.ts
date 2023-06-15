import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
export declare class AppController {
    private readonly appService;
    private jwtService;
    constructor(appService: AppService, jwtService: JwtService);
    register(name: string, email: string, password: string): Promise<import("./user.entity").User>;
    login(name: string, email: string, password: string, response: Response): Promise<{
        message: string;
    }>;
    user(request: Request): Promise<any>;
}
