import connection from '../connection';

export default {
  async index(req, res) {
    const data = await connection
      .select('*')
      .from('ong')
      .join('uf', 'ong.cod_uf', 'uf.cod_uf')
      .join('municipio', 'ong.cod_municipio', 'municipio.cod_municipio')
      .join('ong_contato', 'ong.id', 'ong_contato.id')
      .join('foto', 'ong.id', 'foto.id')
      .where('ong.id', req.query.id);

    return res.json(data);
  },
};
