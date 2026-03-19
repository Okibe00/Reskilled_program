import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
export function wrapperSign(
  payload: any,
  secret: string,
  options: any
): string {
  return jwt.sign(payload, secret, options);
}

export const jwtMock = {
  sign: jest.fn(
    (payload: any, secret: string, options: object) => 'mock_token'
  ),
  verify: jest.fn(),
};

export const bcryptMock = {
  compare: jest.fn((pass: string, hashpwd: string) => true),
  hashPassword: jest.fn((pass: string, salt: number) => 'hashPassword'),
  hashSync: jest.fn((pass: string, salt: number) => 'hashPassword'),
};

export const eventManagerMock = {
  emit: jest.fn(),
};
