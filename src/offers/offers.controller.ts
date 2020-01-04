import express from 'express';
import Controller from 'interfaces/controller.interface';
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
    this.router.get(`${this.path}/:place`, this.getOffersByPlace);
    this.router.get(`${this.path}/:place/:tech`, this.getOffersByPlaceAndTech);
    this.router.get(`${this.path}/:place/:tech/:exp`, this.getOffersByExp);
    this.router.get(`${this.path}/:place/:tech/:exp/:minSal`, this.getOffersByMinSal);
    this.router.get(`${this.path}/:place/:tech/:exp/:minSal/:maxSal`, this.getOffersByAllFilters);
  }

  private getAllOffers = ( request: express.Request, response: express.Response ) => {
    offerModel.find().then((offers) => {
      response.send(offers);
    });
  }

  private getOfferById = ( request: express.Request, response: express.Response ) => {
    const id = request.params.id;
    offerModel.findById(id).then((offers) => {
      response.send(offers);
    });
  }

  private getOffersByPlace = async ( request: express.Request, response: express.Response,
    next: express.NextFunction ) => {
    const place = this.capitalize(request.params.place);
    let offers;
    if (place === 'All') {
      offers = await offerModel.find();
    } else {
      offers = await offerModel.find({ companyPlace: place });
    }
    response.send(offers);
  }

  private getOffersByPlaceAndTech = async ( request: express.Request, response: express.Response,
    next: express.NextFunction ) => {
    const place = this.capitalize(request.params.place);
    const tech = request.params.tech.toLowerCase();
    let offers;
    if (place === 'All') {
      offers = await offerModel.find({ tech });
    } else {
      offers = await offerModel.find({ companyPlace: place, tech });
    }
    response.send(offers);
  }

  private getOffersByExp = async ( request: express.Request, response: express.Response ) => {
    let { place, tech, exp }: any = request.params;
    place = place === 'all' ? /(.*?)/ : this.capitalize(place);
    tech = tech === 'all' ? /(.*?)/ : tech.toLowerCase();
    exp = exp === 'all' ? /(.*?)/ : exp.toLowerCase();
    const offers = await offerModel.find({
        companyPlace: place,
        tech,
        experienceLevel: exp,
      });
    response.send(offers);
  }

  private getOffersByMinSal = async ( request: express.Request,
                                      response: express.Response,
                                      next: express.NextFunction ) => {
  let { place, tech, exp, minSal }: any = request.params;
  minSal = this.changeSalStringtoNumber(minSal);
  place = place === 'all' ? /(.*?)/ : this.capitalize(place);
  tech = tech === 'all' ? /(.*?)/ : tech.toLowerCase();
  exp = exp === 'all' ? /(.*?)/ : exp.toLowerCase();

  const offers = await offerModel.find({
    companyPlace: place,
    tech,
    experienceLevel: exp,
    maxSal: {$gte: minSal},
  });
  response.send(offers);
}

private getOffersByAllFilters = async ( request: express.Request, response: express.Response,
  next: express.NextFunction ) => {

  let { place, tech, exp, minSal, maxSal}: any = request.params;
  minSal = this.changeSalStringtoNumber(minSal);
  maxSal = this.changeSalStringtoNumber(maxSal);
  place = place === 'all' ? /(.*?)/ : this.capitalize(place);
  tech = tech === 'all' ? /(.*?)/ : tech.toLowerCase();
  exp = exp === 'all' ? /(.*?)/ : exp.toLowerCase();

  const offers = await offerModel.find({
      companyPlace: place,
      tech,
      experienceLevel: exp,
      minSal: {$lte: maxSal},
      maxSal: {$gte: minSal},
  });
  response.send(offers);
}

  private capitalize(s: string): any {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  private changeSalStringtoNumber(s): number {
      return s = +[s.slice(0, s.length - 1)] * 1000;
  }
}

export default OffersController;
