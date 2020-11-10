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

  async indexProfile(req, res) {
    const data = await connection
      .select(
        'ong.id',
        'ong.nom_ong',
        'ong.des_endereco',
        'ong_contato.des_email',
        'ong_contato.nro_ddd',
        'ong_contato.nro_telefone',
        'foto.des_link',
        'campanha.seq_campanha',
        'campanha.des_titulo',
        'campanha.des_geral',
        'campanha.vlr_arrecadado',
        'campanha.vlr_objetivo',
        (subquery) =>
          subquery
            .count('* as doacoes')
            .from('campanha_doacao')
            .join(
              'campanha',
              'campanha_doacao.seq_campanha',
              '=',
              'campanha.seq_campanha'
            )
      )
      .from('ong')
      .join('campanha', 'ong.id', '=', 'campanha.id')
      .join('foto', 'ong.id', '=', 'foto.id')
      .join('ong_contato', 'ong_contato.id', '=', 'ong.id')
      .where('ong.id', req.query.id);

    // const sql =
    //   'select a.id, a.nom_ong, a.des_endereco, c.des_link, b.seq_campanha, b.des_titulo, b.des_geral, b.vlr_arrecadado, b.vlr_objetivo, (select count(*) from campanha_doacao as D where d.seq_campanha = b.seq_campanha) as doacoes from ong as A join campanha as B on A.id = B.id join foto as C on B.id = C.id';

    return res.json(data);
  },
};
