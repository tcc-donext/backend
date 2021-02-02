import express from 'express';

import CampaignController from './controllers/CampaignController';
import OngController from './controllers/OngController';
import UserController from './controllers/UserController';

const routes = express.Router();

routes.get('/', function (req, res) {
  return res.json({ serverRunning: true });
});

//ONGs
routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);

export default routes;
