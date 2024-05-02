import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { signupDto } from './dto/signup.dto';
import { signinDto } from './dto/signin.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@roles/role.enum';
import { UserEntity, usersSchemaName } from '@users/users.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(usersSchemaName)
    private UsersModel: Model<UserEntity>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: signupDto) {
    let userToCreate: any = signupDto;
    //check if user already exists
    const userExists = await this.UsersModel.findOne({ email: signupDto.email })
      .select('_id')
      .lean();

    if (userExists)
      throw new HttpException(
        `Email ${signupDto.email} already used.`,
        HttpStatus.CONFLICT,
      );

    const salt = bcrypt.genSaltSync(this.configService.get('auth.saltRounds'));
    userToCreate.password = bcrypt.hashSync(signupDto.password, salt);
    //default role
    userToCreate.roles = [Role.User];
    const createdUser = await this.UsersModel.create(userToCreate);
    let createdUserJSON = createdUser.toJSON();
    delete createdUserJSON.password;
    return createdUserJSON;
  }

  async signin(signinDto: signinDto) {
    const user = await this.UsersModel.findOne({ email: signinDto.email })
      .lean()
      .select('+password email roles');

    if (!user)
      throw new HttpException(
        `User ${signinDto.email} not found`,
        HttpStatus.NOT_FOUND,
      );

    //user found, check password
    const passwordCompare = bcrypt.compareSync(
      signinDto.password,
      user.password,
    );
    delete user.password; //we dont need password anymore

    if (passwordCompare == false) {
      throw UnauthorizedException;
    }

    //console.log(user,'user signin token');
    return { accessToken: this.jwtService.sign(user), user };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
