import connection from '../connection';

export default {
  //index (select) doacao para campanha
  async index(request, response) {
    const doacaoCampanha = await connection('campanha_doacao').select('*');

    return response.json(doacaoCampanha);
  },

  //create doacao direta para campanha
  async create(request, response) {
    let { id_ong, seq_campanha, Dat_doacao, vlr_doacao } = request.body;

    const id_doador = request.user.id;

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

      let campanha;
      campanha = await connection('campanha')
        .where({ id_ong, seq_campanha })
        .select('*');

      let dinheiroArrecadado = campanha[0].vlr_arrecadado.split(' ')[1];
      dinheiroArrecadado = dinheiroArrecadado.replace(/[.]/g, '');
      dinheiroArrecadado = dinheiroArrecadado.replace(/[,]/g, '.');
      dinheiroArrecadado = parseFloat(dinheiroArrecadado);

      vlr_doacao = vlr_doacao.replace(/[,]/g, '.');
      vlr_doacao = parseFloat(vlr_doacao);

      let dinheiro = dinheiroArrecadado + vlr_doacao;
      dinheiro = String(dinheiro);
      dinheiro = dinheiro.replace(/[.]/g, ',');

      await connection('campanha').where({ id_ong, seq_campanha }).update({
        vlr_arrecadado: dinheiro,
      });

      response.status(200);
    } catch (err) {
      return response
        .status(400)
        .json({ err: 'Não foi possível concluir a doação' });
    }

    return response.json({
      id_ong,
      seq_campanha,
      id_doador,
      vlr_doacao,
    });
  },

  //show doacao direta para campanha
  async show(request, response) {
    const { id_ong } = request.params;

    try {
      const doacao_campanha = await connection('campanha_doacao')
        .where({ id_ong: id_ong })
        .select('*');

      return response.json({ doacao_campanha });
    } catch (err) {
      return response
        .status(400)
        .json({ err: 'Não foi possível buscar a doação' });
    }
  },
};
