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
};
