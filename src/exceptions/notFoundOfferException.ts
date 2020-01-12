import HttpException from './httpException';

class NotFoundOfferException extends HttpException {
    constructor(id: string) {
        super(404, `Offer with id ${id} not found.`);
    }
}

export default NotFoundOfferException;
