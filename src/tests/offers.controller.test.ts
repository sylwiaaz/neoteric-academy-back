import request from 'supertest';
import App from '../app';
import InvalidIdOfferException from '../exceptions/invalidIdOfferException';
import OffersNotFoundException from '../exceptions/offersNotFoundException';
import OffersController from '../offers/offers.controller';

describe('test offerController', () => {
    const offerController = new OffersController();
    const app = new App([
        offerController,
    ]);
    describe('GET /offers', () => {
        it('should return array of all offers', async () => {
            const res = await request(app.getServer())
                .get(offerController.path);
            expect(res.status).toEqual(200);
            expect(res.body.length).toEqual(17);
        });
    });
    describe('GET /offers/offer/:id', () => {
        it('should return one offer with specific id', async () => {
            const id = '5e0d229c723f8c67cfc454bc';
            const res = await request(app.getServer())
                .get(`${offerController.path}/offer/${id}`);
            expect(res.status).toEqual(200);
        });
        it('should throw error message if id is incorrect', async () => {
            const id = 5;
            const res = await request(app.getServer())
                .get(`${offerController.path}/offer/${id}`);
            expect(res.body.message).toBe(new InvalidIdOfferException().message);
            expect(res.status).toEqual(404);
        });
    });
    describe('GET /offers/place/:tech//:minSal/:maxSal', () => {
        it('should return array of filtred offers', async () => {
            const res = await request(app.getServer())
                .get(`${offerController.path}/all/all/junior/0/21k`);
            expect(res.body).toBeDefined();
            expect(res.body.length).toBeGreaterThan(1);
            expect(res.status).toEqual(200);
        });
        it('should throw an error message when there are not offers with selected filters', async () => {
            const res = await request(app.getServer())
                .get(`${offerController.path}/gliwice/all/junior/0/52k`);
            expect(res.status).toEqual(404);
            expect(res.body.message).toBe(new OffersNotFoundException().message);
        });
    });
});
