import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from 'dotenv';

env.config();

const app = express();

// Middlewares de segurança (se tiver problema de CORS, comente a segunda linha abaixo)
app.use(helmet());
app.use(cors());

// Todas respostas em JSON
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({ index: 'test' });
});

app.listen(process.env.PORT);
