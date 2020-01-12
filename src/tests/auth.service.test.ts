import AuthenticationService from '../authentication/authentication.service';
import UserWithEmailAlreadyExistedException from '../exceptions/userWithEmailAlreadyExistedException';

describe('test auth service', () => {
    const authService = new AuthenticationService();
    process.env.JWT_SECRET = 'some_secret_code';
    describe('when create a cookie', () => {
        it('should return a string', () => {
            const tokenData = {
                token: '',
                expiresIn: 1,
            };
            expect(typeof authService.createCookie(tokenData)).toBe('string');
        });
    });
    describe('when create a token', () => {
        it('should return an object', () => {
            const user = {
                _id: '0',
                email: 'example@example.com',
                password: 'examplepassword',
            };
            const creatingToken = authService.createToken(user);
            expect(typeof creatingToken).toBe('object');
            expect(creatingToken).toHaveProperty('token');
            expect(creatingToken).toHaveProperty('expiresIn');
        });
    });
    describe('when register user', () => {
        const userData = {
            email: 'example@example.com',
            password: 'examplepassword',
        };
        describe('when user with given email does not exist', () => {
            it('should not throw an error', async () => {
                authService.user.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
                authService.user.create = jest.fn().mockReturnValue({
                    ...userData,
                    _id: '0',
                });
                const registeringUser = await authService.register(userData);
                expect(registeringUser).toBeDefined();
            });
        });
        describe('if user with given email exists', () => {
            it('should return an error', async () => {
                authService.user.findOne = jest.fn().mockReturnValue(Promise.resolve(userData));
                await expect(authService.register(userData))
                .rejects.toMatchObject(new UserWithEmailAlreadyExistedException(userData.email));
            });
        });
    });
});
