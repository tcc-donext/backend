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

    const id_ong = Math.floor(100000 + Math.random() * 900000); //cria id aleatório para ong com 6 digitos: não otimizado

    let seq_foto_perfil = 1; //definir seq_foto_perfil

    try {
      //inserir na tabela usuário
      await connection('usuario').insert({
        id: id_ong,
        idt_tipo_usu: 'O',
        des_senha,
      });

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
  async delete(request, response) {},

  //update ong
  async update(requset, response) {},

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
