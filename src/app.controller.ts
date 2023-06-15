import { Body, Controller, Get, Post,BadRequestException,Res, Req,UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import  {Response,Request} from 'express';
import { hasUncaughtExceptionCaptureCallback } from 'process';
 
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService
    
    )
  
  
  {

  }
  @Post('register')
  async register(
    @Body('name')name:string,
    @Body('email')email:string,
    @Body('password')password:string

  ) {
    const hashedPassword = await bcrypt.hash(password,12);

    return this.appService.create({
      name ,
      email,
      password:hashedPassword
    });
 }
 @Post('login')
 async login(
  @Body('name')name:string,
  @Body('email')email:string,
  @Body('password')password:string,
  @Res({passthrough:true})response:Response

 ){
  const user=await this.appService.findOne({email});

  if (!user){
    throw new BadRequestException('invalid credentials');
  }
  if (!await bcrypt.compare(password,user.password)){
       throw new BadRequestException('invalid credentials');

}

const jwt =await this.jwtService.signAsync({id: user.id})
response.cookie('jwt', jwt, {httpOnly:true})
return {
  message: 'success'
};


 }
 @Get('user')
async user (@Req()request:Request ){
  try{
    const cookie =request.cookies['jwt'];
    const data = await this.jwtService.verify(cookie);


    if (!data){
      throw new UnauthorizedException();
    }

    const user =await this.appService.findOne({id:data['id']})
    return data ;

  } catch (e) {
    throw new UnauthorizedException();


  }
  
}
 


  
}
