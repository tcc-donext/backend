import connection from '../connection';

export default {
  async index(request, response) {
    const { id_ong } = request.params;

    try {
      const camp_ong = await connection('campanha')
        .where('id_ong', id_ong)
        .select('*');
      return response.json(camp_ong);
    } catch (err) {
      console.log(err);
      return response.sendStatus(500);
    }
  },

  async updatePerfilOng(request, response) {
    const { id_ong } = request.params;

    const {
      nom_ONG,
      des_endereco,
      nro_cep,
      des_email,
      nro_telefone,
    } = request.body;

    try {
      await connection('ong').where({ id_ong }).update({
        nom_ONG,
        des_endereco,
        nro_cep,
      });

      await connection('ong_contato').where({ id_ong }).update({
        des_email,
        nro_telefone,
      });

      return response.sendStatus(200);
    } catch (err) {
      return response
        .status(400)
        .json({ error: 'Não foi possível atualizar os dados da ONG' });
    }
  },
};
