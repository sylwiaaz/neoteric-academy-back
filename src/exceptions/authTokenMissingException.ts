import HttpException from './httpException';

class AuthTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Authentication token missing');
  }
}

export default AuthTokenMissingException;
