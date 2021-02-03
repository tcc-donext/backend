import connection from '../connection';

export default {
  //index (select) campaign
  async index(request, response) {
    const campanhas = await connection('campanha').select('*');

    return response.json(campanhas);
  },

  //create campaign
  async create(request, response) {
    //falta link para imagem: campanha_foto
    let {
      id_ong,
      des_titulo,
      des_geral,
      cod_categoria,
      dat_inicio,
      dat_fim,
      vlr_objetivo,
      vlr_arrecadado,
      vlr_pago,
    } = request.body;

    let seq_campanha;

    //conversão de datas
    dat_inicio = new Date(dat_inicio);
    dat_fim = new Date(dat_fim);

    try {
      // como pegar o seq_campanha como sendo o anterior + 1
      let seq;
      seq = await connection('campanha')
        .where('id_ong', id_ong)
        .max('seq_campanha');

      seq_campanha = seq[0].max + 1;

      await connection('campanha').insert({
        id_ong,
        seq_campanha,
        des_titulo,
        des_geral,
        cod_categoria,
        dat_inicio,
        dat_fim,
        vlr_objetivo,
        vlr_arrecadado,
        vlr_pago,
      });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({
      id_ong,
      seq_campanha,
      des_titulo,
    });
  },

  //delete campaign
  async delete(request, response) {
    const { seq } = request.params;
    const id_ong = request.headers.authorization;
    //authorization: aba headers no insomnia: identificação de qual
    // ONG está tentando fazer a operação

    try {
      const campanha = await connection('campanha')
        .where({ id_ong: id_ong, seq_campanha: seq })
        .delete();
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({ campaign_deleted: true });
  },

  //update campaign
  async update(request, response) {
    const { seq } = request.params;
    const id_ong = request.headers.authorization;

    const {
      des_titulo,
      des_geral,
      cod_categoria,
      dat_inicio,
      dat_fim,
      vlr_objetivo,
      vlr_arrecadado,
      vlr_pago,
    } = request.body;

    try {
      await connection('campanha')
        .where({ id_ong: id_ong, seq_campanha: seq })
        .update({
          des_titulo,
          des_geral,
          cod_categoria,
          dat_inicio,
          dat_fim,
          vlr_objetivo,
          vlr_arrecadado,
          vlr_pago,
        });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({ campaign_updated: true });
  },

  //show a specific campaign
  async show(request, response) {
    const { seq } = request.params;
    const id_ong = request.headers.authorization;

    let campanha;
    try {
      campanha = await connection('campanha')
        .where({ id_ong: id_ong, seq_campanha: seq })
        .select('*');
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json(campanha);
  },
};
