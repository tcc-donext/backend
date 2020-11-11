import connection from '../connection';

export default {
  async indexPerOng(req, res) {
    try {
      const data = await connection
        .select(
          'ong.id',
          'campanha.seq_campanha',
          'categoria.cod_categoria',
          'categoria.nom_categoria',
          'campanha.des_titulo',
          'campanha.des_geral',
          'campanha.vlr_arrecadado',
          'campanha.vlr_objetivo',
          'foto.des_link',
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
        .join('foto', 'campanha.id', '=', 'foto.id')
        .join('ong_contato', 'ong_contato.id', '=', 'ong.id')
        .join('campanha_foto', function () {
          this.on('campanha_foto.seq_foto', '=', 'foto.seq_foto').andOn(
            'campanha.seq_campanha',
            '=',
            'campanha_foto.seq_campanha'
          );
        })
        .join(
          'categoria',
          'campanha.cod_categoria',
          '=',
          'categoria.cod_categoria'
        )
        .where('ong.id', req.query.id);

      // const sql =
      //   'select a.id, a.nom_ong, a.des_endereco, c.des_link, b.seq_campanha, b.des_titulo, b.des_geral, b.vlr_arrecadado, b.vlr_objetivo, (select count(*) from campanha_doacao as D where d.seq_campanha = b.seq_campanha) as doacoes from ong as A join campanha as B on A.id = B.id join foto as C on B.id = C.id';

      return res.json(data);
    } catch (error) {
      return res.status(400).json({ Error: `${error}` });
    }
  },
};
