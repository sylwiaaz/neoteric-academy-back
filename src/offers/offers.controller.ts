import express from 'express';
import RequestWithUser from 'interfaces/requestWithUser.interface';
import InvalidIdOfferException from '../exceptions/invalidIdOfferException';
import NotFoundOfferException from '../exceptions/notFoundOfferException';
import OffersNotFoundException from '../exceptions/offersNotFoundException';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
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
    this.router.get(`${this.path}/offer/:id`, this.getOfferById);
    this.router.get(`${this.path}/offer/:id/premium`, authMiddleware, this.getPremiumOffer);
    this.router.get(`${this.path}/:place`, this.getOffersByFilters);
    this.router.get(`${this.path}/:place/:tech`, this.getOffersByFilters);
    this.router.get(`${this.path}/:place/:tech/:exp`, this.getOffersByFilters);
    this.router.get(`${this.path}/:place/:tech/:exp/:minSal`, this.getOffersByFilters);
    this.router.get(`${this.path}/:place/:tech/:exp/:minSal/:maxSal`, this.getOffersByFilters);
    this.router.post(this.path, authMiddleware, this.createOffer);
  }

  private getAllOffers = async (request: express.Request, response: express.Response) => {
    const offers = await offerModel.find();
    response.send(offers);
  }

  private getOfferById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const offer = await offerModel.findById(id);
      if (offer) {
        response.send(offer);
      } else {
        next(new NotFoundOfferException(id));
      }
    } else {
      next(new InvalidIdOfferException());
    }
  }

  private getPremiumOffer = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const offer = await offerModel.findOne({ _id: id, premium: true });
    if (offer) {
      response.send(offer);
    } else {
      next(new NotFoundOfferException(id));
    }
  }

  private getOffersByFilters = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    let { place, tech, exp, minSal, maxSal }: any = request.params;
    let remote: any = /(.*?)/;
    if (place === 'all' || place === undefined) {
      place = /(.*?)/;
    } else if (place === 'remote') {
      place = /(.*?)/;
      remote = 'true';
    } else {
      place = this.capitalize(place);
    }

    tech = (tech === 'all' || tech === undefined) ? /(.*?)/ : tech.toLowerCase();
    exp = (exp === 'all' || exp === undefined) ? /(.*?)/ : exp.toLowerCase();
    minSal = minSal === undefined ? 0 : this.changeSalStringtoNumber(minSal);
    maxSal = maxSal === undefined ? 51000 : this.changeSalStringtoNumber(maxSal);

    const offers = await offerModel.find({
      companyPlace: place,
      tech,
      experienceLevel: exp,
      remote,
      minSal: { $lte: maxSal },
      maxSal: { $gte: minSal },
    });

    if (offers.length > 0) {
      response.send(offers);
    } else {
      next(new OffersNotFoundException());
    }
  }

  private createOffer = async (requestWithUser: express.Request, response: express.Response) => {
    const req = requestWithUser as RequestWithUser;
    const offerData = req.body;
    const createdOffer = new offerModel({
      ...offerData,
      authorId: req.user._id,
    });
    const savedOffer = await createdOffer.save();
    response.send(savedOffer);
  }

  private capitalize(s: string): any {
    return s[0].toUpperCase() + s.slice(1);
  }

  private changeSalStringtoNumber(s): number {
    return s = +[s.slice(0, s.length - 1)] * 1000;
  }
}

export default OffersController;
