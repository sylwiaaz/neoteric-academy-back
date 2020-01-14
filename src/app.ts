import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
    public app: express.Application;
    public port = process.env.PORT || 5000;
    private path = 'https://sylwiaaz.github.io' || 'http://localhost:4200';

    constructor(controllers: Controller[]) {
        this.app = express();

        this.setHeaders();
        this.connectToTheDatabase();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    public getServer() {
        return this.app;
    }

    private connectToTheDatabase() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH,
        } = process.env;

        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
            { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
            .then(() => {
                console.log('connected to db.');
            }).catch(() => {
                console.log('connection failed.');
            });

    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private setHeaders() {
        this.app.use((request, response, next) => {
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Access-Control-Allow-Origin', this.path);
            response.setHeader('Access-Control-Allow-Credentials', 'true');
            response.setHeader('Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin');
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            next();
        });
    }

    private initializeMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller: Controller) => {
            this.app.use('/', controller.router);
        });
    }
}

export default App;
