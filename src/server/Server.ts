import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as compression from 'compression';

import indexRoute from './routes/indexRoute';

class Server {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.app.set('views', './dist');
        this.app.set('view engine', 'ejs');

        this.setupMiddleware();
        this.setupRoutes();
        this.start();
    }

    private setupMiddleware(): void {
        this.app.use(logger('dev'));
        this.app.use(express.static('./dist'));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use(compression());
    }

    private setupRoutes(): void {
        this.app.use('/', indexRoute);
    }

    private start(): void {
        this.app.listen(process.env.PORT || 8080, () => {
            console.log(`Server running on port ${process.env.PORT || 8080}`);
        });
    }

}

export default new Server().app;
