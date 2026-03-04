import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userService from '../user/user.service.js';
import { CreateUserDto } from '../user/dto/user.dto.js';

export const authService = {
  async login(email: string, pass: string) {
    const user = await userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      return { token };
    }
    throw new Error('Invalid credentials');
  },

  async signup(user: CreateUserDto) {
    const newUser = { ...user, password: bcrypt.hashSync(user.password, 10) };
    const createdUser = await userService.createUser(newUser);
    if (createdUser) {
      const token = jwt.sign(
        { id: createdUser.id, email: createdUser.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      return { token, createdUser };
    }
  },
};
