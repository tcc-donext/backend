import connection from '../connection';

export default {
  //index (select) doacao direta
  async index(request, response) {
    const doacaoDireta = await connection('doacao_direta').select('*');

    return response.json(doacaoDireta);
  },

  //create doacao direta
  async create(request, response) {
    let { id_ong, dat_doacao, vlr_doacao } = request.body;
    const id_doador = request.user.id;

    let seq_doacao;

    //conversão de data
    dat_doacao = new Date(dat_doacao);

    try {
      // como pegar o seq_doacao como sendo o anterior + 1
      let seq;
      seq = await connection('doacao_direta')
        .where('id_ong', id_ong)
        .max('seq_doacao');

      seq_doacao = seq[0].max + 1;

      await connection('doacao_direta').insert({
        id_ong,
        seq_doacao,
        dat_doacao,
        vlr_doacao,
        id_doador,
      });
    } catch (err) {
      return response
        .status(400)
        .json({ err: 'Não foi possível concluir a doação' });
    }

    return response.json({
      id_ong,
      id_doador,
      vlr_doacao,
    });
  },

  //show doacao direta - mostra doações para uma ong específica
  async show(request, response) {
    const { id_ong } = request.params;

    try {
      const doacao_direta = await connection('doacao_direta')
        .join('doador', 'doacao_direta.id_doador', '=', 'doador.id_doador')
        .where({ id_ong })
        .select('doacao_direta.*', 'doador.nom_doador');

      return response.json({ doacao_direta });
    } catch (err) {
      return response
        .status(400)
        .json({ err: 'Não foi possível buscar a doação' });
    }
  },
};
