import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@core/auth/roles/roles.decorator';
import { Role } from '@core/auth/roles/role.enum';
import { RolesGuard } from '@core/auth/roles/roles.guard';
import { PermissionsGuard } from '@core/auth/permissions/permissions.guard';
import { PermissionsEnum } from '@core/auth/permissions/permissions.enum';
import { Permissions } from '@core/auth/permissions/permissions.decorator';

@Controller('/api/graph/person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @UseGuards(PermissionsGuard)
  @Permissions(PermissionsEnum.ViewPerson)
  @UseGuards(AuthGuard('jwt'))
  search(@Headers() headers: Record<string, string>, @Body() body: any) {
    return this.personService.searchPersons({ headers, body });
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
