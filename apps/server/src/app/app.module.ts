import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { PeopleService } from './people.service';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory',
      ttl: 0, // lifetime of application
    }),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class AppModule {}
