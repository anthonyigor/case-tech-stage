import { Module } from '@nestjs/common';
import { AreasModule } from './modules/areas/areas.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProcessesModule } from './modules/processes/processes.module';
import { PeopleModule } from './modules/people/people.module';
import { TeamModule } from './modules/teams/team.module';
import { UserModule } from './modules/users/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AreasModule,
    ProcessesModule,
    PeopleModule,
    TeamModule,
    UserModule,
    AuthModule,
    PrismaModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard }
  ],
})
export class AppModule {}
