import HttpException from './httpException';

class InvalidIdOfferException extends HttpException {
    constructor() {
        super(404, `Please enter a valid offer id.`);
    }
}

export default InvalidIdOfferException;
