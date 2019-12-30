import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import OffersController from './offers/offers.controller';

const app = new App(
    [
        new OffersController(),
        new AuthenticationController(),
    ]);

app.listen();
