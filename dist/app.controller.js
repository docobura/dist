"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./user.entity");
let AppController = exports.AppController = class AppController {
    constructor(appService, jwtService) {
        this.appService = appService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { name, email, password } = registerDto;
        const hashedPassword = await bcrypt.hash(password, 12);
        return this.appService.create({
            name,
            email,
            password: hashedPassword,
        });
    }
    async login(loginDto, response) {
        const { email, password } = loginDto;
        const user = await this.appService.findOne({ email });
        if (!user) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const jwt = await this.jwtService.signAsync({ id: user.id });
        response.cookie('jwt', jwt, { httpOnly: true });
        return {
            message: 'Success',
        };
    }
    async user(request) {
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verify(cookie);
            if (!data) {
                throw new common_1.UnauthorizedException();
            }
            const user = await this.appService.findOne({ id: data['id'] });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
    async logout(response) {
        response.clearCookie('jwt');
        return {
            message: 'success'
        };
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'User Registration' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'User successfully registered' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, swagger_1.ApiBody)({
        type: user_entity_1.RegisterDto,
        description: 'User registration data',
    }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'User Login' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Login successful' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, swagger_1.ApiBody)({
        type: user_entity_1.LoginDto,
        description: 'User login data',
    }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get User Details' }),
    (0, swagger_1.ApiCookieAuth)('jwt'),
    (0, swagger_1.ApiOkResponse)({ description: 'User details returned' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "user", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout and clear JWT cookie' }),
    (0, swagger_1.ApiCookieAuth)(),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "logout", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        jwt_1.JwtService])
], AppController);
//# sourceMappingURL=app.controller.js.map