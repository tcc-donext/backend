import connection from '../connection';
import bcrypt from 'bcrypt';

export default {
  async login(req, res) {
    const { des_email, des_senha } = req.body;

    if (!des_email || !des_senha) return res.sendStatus(400);

    const doador = await connection('doador')
      .select('id_doador')
      .where('des_email', '=', des_email);
    const ong = await connection('ong_contato')
      .select('id_ong')
      .where('des_email', '=', des_email);

    if (doador.length == 0 && ong.length == 0) return res.sendStatus(401);

    const user = (doador || ong)[0];
    const idName = doador.length != 0 ? 'id_doador' : 'id_ong';

    const userPassword = await connection('usuario')
      .select('des_senha')
      .where('id', '=', user[idName]);

    const match = await bcrypt.compare(
      des_senha,
      userPassword[0].des_senha.trim()
    );

    if (!match) return res.sendStatus(403);

    // jwt

    return res.sendStatus(200);
  },
};
