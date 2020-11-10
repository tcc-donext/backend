import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from 'dotenv';

import routes from './routes';

env.config();

const app = express();

// Middlewares de segurança (se tiver problema de CORS, comente a segunda linha abaixo)
app.use(helmet());
app.use(cors());

// Todas respostas em JSON
app.use(express.json());

app.use(routes);

app.listen(process.env.PORT || 3333);
