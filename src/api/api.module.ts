import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { GraphModule } from './graph/graph.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [GraphModule],
})
export class ApiModule {}
