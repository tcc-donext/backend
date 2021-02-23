import connection from '../connection';
import {
  generateAcessToken,
  generateRefreshToken,
} from '../utils/authentication';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// TEMPORARIO: eventualmente persistir os refresh tokens em algum lugar
const refreshTokens = [];

export default {
  async login(req, res) {
    const { des_email, des_senha } = req.body;

    if (!des_email || !des_senha) return res.sendStatus(400);

    const doador = (
      await connection('doador')
        .select('id_doador', 'nom_doador', 'link_img_perfil')
        .where('des_email', '=', des_email)
    )[0];

    const ong = (
      await connection('ong_contato')
        .select('ong_contato.id_ong', 'ong.nom_ONG', 'ong.seq_foto_perfil')
        .join('ong', 'ong_contato.id_ong', '=', 'ong.id_ong')
        .where('des_email', '=', des_email)
    )[0];

    if (!doador && !ong) return res.sendStatus(401);

    const user = doador || ong;
    const idName = doador ? 'id_doador' : 'id_ong';

    const userPassword = await connection('usuario')
      .select('des_senha')
      .where('id', '=', user[idName]);

    const match = await bcrypt.compare(
      des_senha,
      userPassword[0].des_senha.trim()
    );

    if (!match) return res.sendStatus(403);

    // jwt
    let id, name, image;
    if (idName == 'id_doador') {
      id = user.id_doador;
      name = user.nom_doador;
      image = user.link_img_perfil;
    } else {
      id = user.id_ong;
      name = user.nom_ONG;
      image = (
        await connection('foto')
          .select('des_link')
          .where('id_ong', '=', id)
          .andWhere('seq_foto', '=', user.seq_foto_perfil)
      )[0].des_link;
    }

    const accessToken = generateAcessToken({ id, name, image });
    const refreshToken = generateRefreshToken({ id, name, image });
    refreshTokens.push(refreshToken);

    res.cookie('authRefreshToken', refreshToken, {
      maxAge: 43200000,
      httpOnly: true,
    });

    return res.json({
      accessToken,
      expiresIn: '15m',
      user: {
        id,
        name,
        image,
      },
    });
  },
  async refreshSession(req, res) {
    const token = req.cookies.authRefreshToken;

    if (!token) return res.sendStatus(401);
    if (!refreshTokens.includes(token)) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      const accessToken = generateAcessToken({
        id: user.id,
        name: user.name,
        image: user.image,
      });
      res.json({ accessToken });
    });
  },
};
