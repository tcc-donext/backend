import connection from '../connection';

export default {
  //index (select) ong
  async index(request, response) {
    const ongs = await connection('ong').select('*');

    return response.json(ongs);
  },

  //create ong
  async create(request, response) {
    const {
      cod_CNPJ,
      nom_ONG,
      des_endereco,
      nro_cep,
      des_email,
      seq_contato,
      nom_pessoa,
      nro_ddd,
      nro_telefone,
      des_senha,
    } = request.body;

    //obs: hash da senha

    let id_ong;

    let seq_foto_perfil = 1; //definir seq_foto_perfil

    try {
      //inserir na tabela usuário
      await connection('usuario').insert({
        idt_tipo_usu: 'O',
        des_senha,
      });

      let id = await connection('usuario').max('id');

      id_ong = id[0].max;

      //inserir na tabela ong
      await connection('ong').insert({
        id_ong,
        cod_CNPJ,
        nom_ONG,
        des_endereco,
        nro_cep,
        seq_foto_perfil,
      });

      //inserir na tabela ong_contato: obs.: des_cargo ainda está constante e seq_contato também
      const des_cargo = 'Gerente';
      await connection('ong_contato').insert({
        des_cargo,
        id_ong,
        seq_contato,
        nom_pessoa,
        des_email,
        nro_ddd,
        nro_telefone,
      });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json(id_ong);
  },

  //delete ong
  async delete(request, response) {
    const { id } = request.params;

    try {
      await connection('usuario')
        .where({id: id})
        .delete();

      await connection('ong')
        .where({id_ong: id})
        .delete();

      await connection('ong_contato')
        .where({id_ong: id})
        .delete();
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({ ong_deleted: true });
  },

  //update ong
  async update(request, response) {
    const { id_ong } = request.params;

    const {
      cod_CNPJ,
      nom_ONG,
      des_endereco,
      nro_cep,
      des_email,
      seq_contato,
      nom_pessoa,
      nro_ddd,
      nro_telefone,
      des_senha,
    } = request.body;

    try{
      await connection('usuario')
        .where({id: id_ong})
        .update({
          des_senha,
        });

      await connection('ong')
        .where({id_ong})
        .update({
          id_ong,
          cod_CNPJ,
          nom_ONG,
          des_endereco,
          nro_cep,
        });
  
      await connection('ong_contato')
        .where({id_ong})
        .update({
          seq_contato,
          nom_pessoa,
          des_email,
          nro_ddd,
          nro_telefone,
        });
    } catch( err ) {
      return response.status(400).json({ error : err.message });
    }

    return response.json({ ong_updated: true });
  },

  //show a specific ong
  async show(request, response) {
    const { id } = request.params;

    try {
      const ong = await connection('ong').where('id_ong', id).select('*');
      return response.json(ong);

    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
};
