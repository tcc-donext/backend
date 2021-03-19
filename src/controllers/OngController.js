import connection from '../connection';
import bcrypt from 'bcrypt';

export default {
  //select ongs
  async index(request, response) {
    try {
      const ongs = await connection('ong')
        .join('ong_contato', 'ong.id_ong', 'ong_contato.id_ong')
        .select('*');

      await Promise.all(
        ongs.map(async (ong) => {
          let profile_pic_id = ong.seq_foto_perfil;
          let profile_pic_cloud_id = await connection('foto')
            .where({
              id_ong: ong.id_ong,
              seq_foto: profile_pic_id,
            })
            .select('des_link');

          let profile_pic_link =
            'https://res.cloudinary.com/iagodonext/image/upload/' +
            profile_pic_cloud_id[0].des_link;

          ong.foto_perfil = profile_pic_link;
        })
      );

      return response.json(ongs);
    } catch (error) {
      console.log(error.message);
      return response
        .status(400)
        .json({ error: 'Não foi possível listar ONGs' });
    }
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
      //hash de senha com bcrypt
      const hashedPassword = await bcrypt.hash(des_senha, 10);

      //inserir na tabela usuário
      await connection('usuario').insert({
        idt_tipo_usu: 'O',
        des_senha: hashedPassword,
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
      return response
        .status(400)
        .json({ error: 'Não foi possível cadastrar a ONG' });
    }

    return response.json(id_ong);
  },

  //delete ong
  async delete(request, response) {
    const id = request.user.id;

    try {
      await connection('usuario').where({ id: id }).delete();

      await connection('ong').where({ id_ong: id }).delete();

      await connection('ong_contato').where({ id_ong: id }).delete();

      return response.sendStatus(200);
    } catch (err) {
      return response
        .status(400)
        .json({ error: 'Não foi possível deletar a ONG' });
    }
  },

  //update ong
  async update(request, response) {
    const id_ong = request.user.id;

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
    } = request.body;

    try {
      await connection('ong').where({ id_ong }).update({
        id_ong,
        cod_CNPJ,
        nom_ONG,
        des_endereco,
        nro_cep,
      });

      await connection('ong_contato').where({ id_ong }).update({
        seq_contato,
        nom_pessoa,
        des_email,
        nro_ddd,
        nro_telefone,
      });

      return response.sendStatus(200);
    } catch (err) {
      return response
        .status(400)
        .json({ error: 'Não foi possível atualizar os dados da ONG' });
    }
  },

  //show a specific ong
  async show(request, response) {
    const { id } = request.params;

    try {
      const ong = await connection('ong').where('id_ong', id).select('*');
      const ongContato = await connection('ong_contato')
        .where('id_ong', id)
        .select('des_email', 'nro_ddd', 'nro_telefone');
      ong[0].contato = ongContato[0];

      const profile_pic_id = ong[0].seq_foto_perfil;
      const profile_pic_link = await connection('foto')
        .where('id_ong', id)
        .andWhere('seq_foto', profile_pic_id)
        .select('des_link');

      const pic_complete_link =
        'https://res.cloudinary.com/iagodonext/image/upload/' +
        profile_pic_link[0].des_link;

      ong[0].profile_pic = pic_complete_link;

      return response.json(ong);
    } catch (err) {
      console.log(err.message);
      return response
        .status(400)
        .json({ error: 'Não foi possível buscar a ONG' });
    }
  },
};
