import express from 'express';

import CampaignController from './controllers/CampaignController';
import OngController from './controllers/OngController';
import UserController from './controllers/UserController';

const routes = express.Router();

routes.get('/', function (req, res) {
  return res.json({ serverRunning: true });
});

routes.get('/ong', OngController.index);
routes.get('/campanha', CampaignController.index);
routes.get('/campanha/ong', CampaignController.indexPerOng);

export default routes;
