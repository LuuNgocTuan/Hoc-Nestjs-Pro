import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from './utils/password.util';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    // Hàm validateUser sẽ được gọi khi người dùng đăng nhập, nó sẽ kiểm tra xem username và password có hợp lệ không
    async validateUser(username: string, pass: string): Promise<any> {
        // 1️⃣ tìm user theo username
        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            return null;
            // throw new UnauthorizedException();
        }
        // 2️⃣ so sánh password
        const isMatch = await comparePassword(pass, user.password);
        if (!isMatch) {
            return null;
            throw new UnauthorizedException();
        }
        // 3️⃣ loại bỏ password trước khi trả về thông tin user

        const { password, ...result } = user.toObject
            ? user.toObject()
            : user;
        return result;
    }

    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        const refresh_token = this.createRefreshToken(payload)

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token,
            user: {
                _id,
                name,
                email,
                role
            }

        };
    }

    async register(registerUserDto: RegisterUserDto) {
        const user = await this.usersService.register(registerUserDto);
        return {
            _id: user._id,
            createdAt: user.createdAt,
        }
    }

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload,
            {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') as string,
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue,
            }
        )
        return refreshToken
    }
}
