import { ConfigService } from '@nestjs/config';
import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private configService: ConfigService
  ) {}

@Get()//=>api (restfullAPI)
@Render('home')
handleHomePage() {
    console.log('check port 1:',this.configService.get('PORT'));
    
    const message = this.appService.getHello();
    return { mess: message};
}}
