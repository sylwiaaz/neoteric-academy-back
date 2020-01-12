import mongoose from 'mongoose';
import request from 'supertest';
import App from '../app';
import AuthenticationController from '../authentication/authentication.controller';
import WrongCredentialsException from '../exceptions/wrongCredentialsException';

describe('Auth controller', () => {
  const authController = new AuthenticationController();
  const app = new App([
    authController,
  ]);
  (mongoose as any).connect = jest.fn();
  process.env.JWT_SECRET = 'some_secret_code';
  const userData = {
    email: 'example@example.com',
    password: 'examplepassword',
  };

  describe('POST /auth/logout', () => {
    it('response should have set-cookie header with "Authorization=" ', async () => {
      const res = await request(app.getServer())
        .post(`${authController.path}/logout`);
      expect(res.header['set-cookie'][0]).toMatch(/^Authorization=/);
      expect(res.body.message).toEqual('user is logged out');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /auth/register', () => {
    it('if the email is not taken, should create a user account', async () => {
      authController.authenticationService.user.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
      authController.authenticationService.user.create = jest.fn().mockReturnValue({
        ...userData,
        _id: 0,
      });
      const res = await request(app.getServer())
        .post(`${authController.path}/register`)
        .send(userData);
      expect(res.body.email).toEqual(userData.email);
      expect(res.status).toBe(200);
    });
  });
  describe('POST /auth/login', () => {
    describe('when passwords match', () => {
      it('response should have set-cookie header with Authorization', async () => {
        authController.authenticationService.user.findOne = jest.fn().mockReturnValue({
          email: 'example@example.com',
          password: '$2b$10$fBFt5HNbY2lnik8T1/vk0OE4ZJXExrV2VvBztWey7JFH7eSptDosS',
          _id: 0,
        });
        const res = await request(app.getServer())
          .post(`${authController.path}/login`)
          .send(userData);
        expect(res.header['set-cookie'][0]).toMatch(/^Authorization=/);
        expect(res.body.user.email).toEqual(userData.email);
        expect(res.status).toBe(200);
      });
    });
    describe('when password does not match', () => {
      it('should throw an error', async () => {
        const res = await request(app.getServer())
          .post(`${authController.path}/login`)
          .send(userData);
        expect(res.status).toBe(401);
        expect(res.body.message).toEqual(new WrongCredentialsException().message);
      });
    });
  });
});
