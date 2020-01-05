import HttpException from './httpException';

class OffersNotFoundException extends HttpException {
  constructor() {
    super(404, `Sorry, there are no job offers for selected filters.`);
  }
}

export default OffersNotFoundException;
