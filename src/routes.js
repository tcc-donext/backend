import express from 'express';

import CampaignController from './controllers/CampaignController';
import OngController from './controllers/OngController';
import UserController from './controllers/UserController';
import ProfileController from './controllers/ProfileController';
import ImageController from './controllers/ImageController';

const routes = express.Router();

routes.get('/', function (req, res) {
  return res.json({ serverRunning: true });
});

//ONGs
routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);
routes.delete('/ongs/:id', OngController.delete);
routes.get('/ongs/:id', OngController.show);
routes.put('/ongs/:id_ong', OngController.update);

//Campaign
routes.get('/campanhas', CampaignController.index);
routes.post('/campanhas', CampaignController.create);
routes.delete('/campanhas/:seq', CampaignController.delete);
routes.get('/campanhas/:seq', CampaignController.show);
routes.put('/campanhas/:seq', CampaignController.update);

//Specific ONG campaign
routes.get('/profile', ProfileController.index);

//Image upload
routes.post('/api/upload', ImageController.upload);
routes.get('/api/images', ImageController.getImages);

export default routes;
