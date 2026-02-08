import { Module } from '@nestjs/common';
import { AreasModule } from './modules/areas/areas.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProcessesModule } from './modules/processes/processes.module';
import { PeopleModule } from './modules/people/people.module';
import { TeamModule } from './modules/teams/team.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AreasModule,
    ProcessesModule,
    PeopleModule,
    TeamModule,
    PrismaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
