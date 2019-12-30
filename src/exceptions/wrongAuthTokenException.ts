import HttpException from './httpException';

class WrongAuthTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong authentication token');
  }
}

export default WrongAuthTokenException;
