import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const bcryptMock: DeepMockProxy<typeof bcrypt> = mockDeep<typeof bcrypt>();
export const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});
