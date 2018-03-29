import * as express from 'express';

class IndexRoute {

    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.router.get('*', this.getIndex);
    }

    private getIndex(req: express.Request, res: express.Response): void {
        if (req.url.startsWith('/static/')) {
            res.status(404).send('Error 404: Resource not found!');
            return;
        }
        res.render('index');
    }

}

export default new IndexRoute().router;
