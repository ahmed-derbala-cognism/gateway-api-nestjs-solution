import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';
import { PersonModule } from './person/person.module';

@Module({
  controllers: [GraphController],
  providers: [GraphService],
  imports: [PersonModule],
})
export class GraphModule {}
