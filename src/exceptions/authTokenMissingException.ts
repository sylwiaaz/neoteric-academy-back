import HttpException from './httpException';

class AuthTokenMissingException extends HttpException {
  constructor() {
    super(401, 'You are not authenticated to search remote job offers. Please, login or remove filters.');
  }
}

export default AuthTokenMissingException;
