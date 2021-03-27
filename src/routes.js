import express from 'express';

import CampaignController from './controllers/CampaignController';
import OngController from './controllers/OngController';
import UserController from './controllers/UserController';
import ProfileController from './controllers/ProfileController';
import DoadorController from './controllers/DoadorController';
import DoacaoDiretaController from './controllers/DoacaoDiretaController';
import DoacaoCampanhaController from './controllers/DoacaoCampanhaController';
import CategoriaController from './controllers/CategoriaController';
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
routes.delete('/ongs/:id', AuthMiddleware, OngController.delete);
routes.get('/ongs/:id', OngController.show);
routes.put('/ongs', AuthMiddleware, OngController.update);

//Campanhas
routes.get('/campanhas', CampaignController.index);
routes.post('/campanhas', AuthMiddleware, CampaignController.create);
routes.delete('/campanhas/:seq', AuthMiddleware, CampaignController.delete);
routes.get('/campanhas/:seq/:id_ong', CampaignController.show);
routes.put('/campanhas/:seq', AuthMiddleware, CampaignController.update);

//Campanhas por ONG específica
routes.get('/profile/:id_ong', ProfileController.index);
routes.put('/profile/:id_ong', ProfileController.updatePerfilOng);

//Doador
routes.get('/doador', DoadorController.index);
routes.post('/doador', DoadorController.create);
routes.delete('/doador/:id', AuthMiddleware, DoadorController.delete);
routes.get('/doador/:id', DoadorController.show);
routes.put('/doador/:id', AuthMiddleware, DoadorController.update);

//Contribuição do doador
routes.get('/contribuicao/:id', DoadorController.getDonatedAmount);

//Doação direta
routes.get('/doacaoDireta', DoacaoDiretaController.index);
routes.post('/doacaoDireta', AuthMiddleware, DoacaoDiretaController.create);
routes.get('/doacaoDireta/:id_ong', DoacaoDiretaController.show);

//Doação para campanha
routes.get('/doacaoCampanha', DoacaoCampanhaController.index);
routes.post('/doacaoCampanha', AuthMiddleware, DoacaoCampanhaController.create);
routes.get('/doacaoCampanha/:id_ong', DoacaoCampanhaController.show);

//Categorias
routes.get('/categorias', CategoriaController.index);

export default routes;
