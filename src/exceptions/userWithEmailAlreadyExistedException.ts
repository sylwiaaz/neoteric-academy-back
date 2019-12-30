import HttpException from './httpException';

class UserWithEmailAlreadyExistedException extends HttpException {
  constructor(email: string) {
    super(400, `User with email ${email} already exists`);
  }
}

export default UserWithEmailAlreadyExistedException;
