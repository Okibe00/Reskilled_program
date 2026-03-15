import { prismaMock } from '../../__mock__/prisma.mock.js';
import { UserService } from './user.service.js';

describe('UserService', () => {
  const userService = new UserService(prismaMock);
  const mockUser = {
    id: 'uuid-123',
    email: 'test@test.com',
    name: 'okibe onmeje',
    password: 'superStrongPwd',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  type Mockuser = typeof mockUser;
  it('should return a list of users', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockUser] as Mockuser[]);

    const result = await userService.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('test@test.com');
  });
  it('should create a user', async () => {
    prismaMock.user.create.mockResolvedValue(mockUser as Mockuser);
    const result = await userService.createUser({
      name: 'okibe omeje',
      password: 'superStrongPwd',
      email: 'test@test.com',
    });
    expect(prismaMock.user.create).toHaveBeenCalled();
    expect(result.email).toBe('test@test.com');
  });

  it('should update a user with the provided data', async () => {
    const updateDto = { name: 'okibe ogomola onmeje' };
    const updatedUser = { ...mockUser, ...updateDto };

    prismaMock.user.update.mockResolvedValue(updatedUser as any);

    const result = await userService.updateUser('uuid-123', updateDto);

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'uuid-123' },
      data: updateDto,
    });
    expect(result.name).toBe('okibe ogomola onmeje');
  });

  it('should return a user when a valid ID is provided', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser as Mockuser);

    const result = await userService.findById('uuid-123');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'uuid-123' },
    });
    expect(result).toEqual(mockUser);
  });
  it('should return Null when a in-valid ID is provided', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const result = await userService.findById('uuid-13');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'uuid-13' },
    });
    expect(result).toBeNull();
  });
  it('should return a user when a valid email is provided', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser as Mockuser);

    const result = await userService.findByEmail('test@test.com');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });
    expect(result?.email).toBe('test@test.com');
  });
  it('should delete a user and return the deleted record', async () => {
      prismaMock.user.delete.mockResolvedValue(mockUser as Mockuser);

      const result = await userService.deleteUser('uuid-123');

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
      });
      expect(result.id).toBe('uuid-123');
    });
});
