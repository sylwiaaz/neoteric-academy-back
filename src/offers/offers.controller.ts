import express from 'express';
import Controller from 'interfaces/controller.interface';
import Offer from './offer.interface';
import offerModel from './offer.model';

class OffersController implements Controller {
    public path = '/offers';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllOffers);
    }

    private getAllOffers = (request: express.Request, response: express.Response) => {
        offerModel.find()
            .then((offers) => {
                response.send(offers);
            });

    }
}

export default OffersController;
