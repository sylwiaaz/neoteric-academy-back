import HttpException from './httpException';

class AuthTokenMissingException extends HttpException {
  constructor() {
    super(401, 'You are not authenticated. Please, login to see premium job offer.');
  }
}

export default AuthTokenMissingException;
