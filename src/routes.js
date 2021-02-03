import express from 'express';

import CampaignController from './controllers/CampaignController';
import OngController from './controllers/OngController';
import UserController from './controllers/UserController';
import ProfileController from './controllers/ProfileController';

const routes = express.Router();

routes.get('/', function (req, res) {
  return res.json({ serverRunning: true });
});

//ONGs
routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);
routes.get('/ongs/:id', OngController.show);

//Campaign
routes.get('/campanhas', CampaignController.index);
routes.post('/campanhas', CampaignController.create);
routes.delete('/campanhas/:seq', CampaignController.delete);
routes.get('/campanhas/:seq', CampaignController.show);
routes.put('/campanhas/:seq', CampaignController.update);

//Specific ONG campaign
routes.get('/profile', ProfileController.index);

export default routes;
