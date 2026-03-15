// import { AuthService } from './auth.service.js';
// import { UserService } from '../user/user.service.js';
// import { prismaMock } from '../../__mock__/prisma.mock.js';
// import { jest } from '@jest/globals';
// import { jwtMock, bcryptMock } from '../../__mock__/utils.js';

// describe('AuthService', () => {
//   const mockUser = {
//     id: 'uuid-123',
//     email: 'test@test.com',
//     name: 'okibe onmeje',
//     password: 'superStrongPwd',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };
//   type Mockuser = typeof mockUser;
//   prismaMock.user.findUnique.mockResolvedValue(mockUser);
//   const userService = new UserService(prismaMock);
//   const authService = new AuthService(jwtMock, bcryptMock, userService);
//   beforeEach(() => {
//     jest.clearAllMocks();
//     process.env.JWT_SECRET = 'test_secret';
//   });

//   describe('login', () => {
//     it('should return a token when credentials are valid', async () => {
//       const result = await authService.login('test@test.com', 'password123');

//       expect(result).toEqual({ token: 'mock_token' });
//       expect(userService.findByEmail).toHaveBeenCalledWith('test@test.com');
//       expect(bcryptMock.compare).toHaveBeenCalledWith(
//         'password123',
//         'hashed_password'
//       );
//     });

//     it('should throw an error if user is not found', async () => {
      
//     });

//     it('should throw an error if password does not match', async () => {
     
//     });
//   });

//   // describe('signup', () => {
//   //   it('should hash password, create user, and return a token', async () => {
//   //     const signUpDto = {
//   //       email: 'new@test.com',
//   //       password: 'raw_password',
//   //       name: 'New User',
//   //     };

//   //     (bcrypt.hashSync as jest.Mock).mockReturnValue('hashed_password');
//   //     (userService.createUser as jest.Mock).mockResolvedValue({
//   //       ...signUpDto,
//   //       id: '2',
//   //       password: 'hashed_password',
//   //     });
//   //     (jwt.sign as jest.Mock).mockReturnValue('new_user_token');

//   //     const result = await authService.signup(signUpDto);

//   //     expect(bcrypt.hashSync).toHaveBeenCalledWith('raw_password', 10);
//   //     expect(userService.createUser).toHaveBeenCalledWith({
//   //       ...signUpDto,
//   //       password: 'hashed_password',
//   //     });
//   //     expect(result).toEqual({
//   //       token: 'new_user_token',
//   //       createdUser: expect.objectContaining({ email: 'new@test.com' }),
//   //     });
//   //   });
//   // });
// });
