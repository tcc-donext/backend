import connection from '../connection';
import bcrypt from 'bcrypt';

export default {
  //index (select) doador
  async index(request, response) {
    const doador = await connection('doador').select('*');

    return response.json(doador);
  },

  //create doador
  async create(request, response) {
    const {
      des_email,
      nom_doador,
      nro_ddd,
      nro_telefone,
      link_img_perfil,
      des_senha,
    } = request.body;

    //obs: hash da senha

    let id_doador;

    try {
      //hash senha com bcrypt
      const hashedPassword = await bcrypt.hash(des_senha, 10);
      console.log(hashedPassword);

      await connection('usuario').insert({
        idt_tipo_usu: 'D',
        des_senha: hashedPassword,
      });

      let id = await connection('usuario').max('id');

      id_doador = id[0].max;

      await connection('doador').insert({
        id_doador,
        des_email,
        nom_doador,
        nro_ddd,
        nro_telefone,
        link_img_perfil,
      });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({ id_doador });
  },

  //delete doador
  async delete(request, response) {
    const { id } = request.params;

    try {
      await connection('usuario').where({ id }).delete();

      await connection('doador').where({ id_doador: id }).delete();
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({ doador_deleted: true });
  },

  //update doador
  async update(request, response) {
    const { id } = request.params;

    const {
      des_email,
      nom_doador,
      nro_ddd,
      nro_telefone,
      link_img_perfil,
    } = request.body;

    try {
      await connection('doador').where({ id_doador: id }).update({
        des_email,
        nom_doador,
        nro_ddd,
        nro_telefone,
        link_img_perfil,
      });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({ doador_updated: true });
  },

  //show doador
  async show(request, response) {
    const { id } = request.params;

    try {
      const doador = await connection('doador')
        .where({ id_doador: id })
        .select('*');

      return response.json(doador);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
};
