import connection from '../connection';

export default {
  //index (select) doacao para campanha
  async index(request, response) {
    const doacaoCampanha = await connection('campanha_doacao').select('*');

    return response.json(doacaoCampanha);
  },

  //create doacao direta para campanha
  async create(request, response) {
    let {
      id_ong,
      seq_campanha,
      Dat_doacao,
      vlr_doacao,
      id_doador,
    } = request.body;

    let seq_doacao;

    //conversão de data
    Dat_doacao = new Date(Dat_doacao);

    try {
      // como pegar o seq_doacao como sendo o anterior + 1
      let seq;
      seq = await connection('campanha_doacao')
        .where({ id_ong, seq_campanha })
        .max('seq_doacao');

      seq_doacao = seq[0].max + 1;

      await connection('campanha_doacao').insert({
        id_ong,
        seq_campanha,
        seq_doacao,
        Dat_doacao,
        vlr_doacao,
        id_doador,
      });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({
      id_ong,
      seq_campanha,
      id_doador,
      vlr_doacao,
    });
  },

  //delete doacao direta para campanha
  async delete(request, response) {
    const { seq } = request.params;
    const id_ong = request.headers.authorization;
    const { seq_campanha } = request.body;
    //authorization: aba headers no insomnia: identificação de qual
    //ONG está tentando fazer a operação

    try {
      await connection('campanha_doacao')
        .where({ id_ong: id_ong, seq_doacao: seq, seq_campanha: seq_campanha })
        .delete();
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({ doacao_deleted: true });
  },

  //update doacao direta para campanha
  async update(request, response) {
    const { seq } = request.params;
    const id_ong = request.headers.authorization;
    //authorization: aba headers no insomnia: identificação de qual
    //ONG está tentando fazer a operação

    let { seq_campanha, Dat_doacao, vlr_doacao } = request.body;

    //conversão de data
    Dat_doacao = new Date(Dat_doacao);

    try {
      await connection('campanha_doacao')
        .where({ id_ong: id_ong, seq_doacao: seq, seq_campanha: seq_campanha })
        .update({
          Dat_doacao,
          vlr_doacao,
        });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({
      id_ong,
      seq_campanha,
      seq,
    });
  },

  //show doacao direta para campanha
  async show(request, response) {
    const { seq } = request.params;
    const id_ong = request.headers.authorization;
    const { seq_campanha } = request.body;
    //authorization: aba headers no insomnia: identificação de qual
    //ONG está tentando fazer a operação

    try {
      const doacao_campanha = await connection('campanha_doacao')
        .where({ id_ong: id_ong, seq_doacao: seq, seq_campanha: seq_campanha })
        .select('*');

      return response.json({ doacao_campanha });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
};
