import connection from '../connection';

export default {
  //index (select) campaign
  async index(request, response) {
    const ongs = await connection('campanha').select('*');

    return response.json(ongs);
  },

  //create campaign
  async create(request, response) {},

  //delete campaign
  async delete(request, response) {},

  //update campaign
  async update(requset, response) {},

  //show a specific campaign
  async show(request, response) {},
};
