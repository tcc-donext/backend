import express from 'express';

import CampaignController from './controllers/CampaignController';
import OngController from './controllers/OngController';
import UserController from './controllers/UserController';
import ProfileController from './controllers/ProfileController';
import ImageController from './controllers/ImageController';
import DoadorController from './controllers/DoadorController';
import DoacaoDiretaController from './controllers/DoacaoDiretaController';
import DoacaoCampanhaController from './controllers/DoacaoCampanhaController';

import AuthMiddleware from './middlewares/auth';

const routes = express.Router();

routes.get('/', function (req, res) {
  return res.json({ serverRunning: true });
});

// Login e autorização
routes.post('/login', UserController.login);
routes.post('/token', UserController.refreshSession);
routes.post('/logout', UserController.logout);

//ONGs
routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);
routes.delete('/ongs/:id', OngController.delete);
routes.get('/ongs/:id', OngController.show);
routes.put('/ongs/:id_ong', OngController.update);

//Campanhas
routes.get('/campanhas', CampaignController.index);
routes.post('/campanhas', CampaignController.create);
routes.delete('/campanhas/:seq', CampaignController.delete);
routes.get('/campanhas/:seq', CampaignController.show);
routes.put('/campanhas/:seq', CampaignController.update);

//Campanhas por ONG específica
routes.get('/profile', ProfileController.index);

//Doador
routes.get('/doador', DoadorController.index);
routes.post('/doador', DoadorController.create);
routes.delete('/doador/:id', DoadorController.delete);
routes.get('/doador/:id', DoadorController.show);
routes.put('/doador/:id', AuthMiddleware, DoadorController.update);

//Contribuição do doador
routes.get('/contribuicao/:id', DoadorController.getDonatedAmount);

//Doação direta
routes.get('/doacaoDireta', DoacaoDiretaController.index);
routes.post('/doacaoDireta', DoacaoDiretaController.create);
routes.delete('/doacaoDireta/:seq', DoacaoDiretaController.delete);
routes.get('/doacaoDireta/:seq', DoacaoDiretaController.show);
routes.put('/doacaoDireta/:seq', DoacaoDiretaController.update);

//Doação para campanha
routes.get('/doacaoCampanha', DoacaoCampanhaController.index);
routes.post('/doacaoCampanha', DoacaoCampanhaController.create);
routes.delete('/doacaoCampanha/:seq', DoacaoCampanhaController.delete);
routes.get('/doacaoCampanha/:seq', DoacaoCampanhaController.show);
routes.put('/doacaoCampanha/:seq', DoacaoCampanhaController.update);

//Upload de imagens
routes.post('/upload', ImageController.upload);
routes.get('/images', ImageController.getImages);

export default routes;
