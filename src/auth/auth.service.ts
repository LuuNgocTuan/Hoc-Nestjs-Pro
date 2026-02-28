import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from './utils/password.util';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    // Hàm validateUser sẽ được gọi khi người dùng đăng nhập, nó sẽ kiểm tra xem username và password có hợp lệ không
    async validateUser(username: string, pass: string): Promise<any> {
        // 1️⃣ tìm user theo username
        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        // 2️⃣ so sánh password
        const isMatch = await comparePassword(pass, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid password');
        }
        // 3️⃣ loại bỏ password trước khi trả về thông tin user

        const { password, ...result } = user.toObject
            ? user.toObject()
            : user;
        return result;

    }

}
