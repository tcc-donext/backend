import connection from '../connection';
import bcrypt from 'bcrypt';
import { upload } from '../utils/imageUtils';

export default {
  //select ongs
  async index(request, response) {
    try {
      const ongs = await connection('ong')
        .join('ong_contato', 'ong.id_ong', 'ong_contato.id_ong')
        .select('*');

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

    let link_foto_perfil = null;

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
        link_foto_perfil,
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

      await connection('foto').where({ id_ong: id }).delete();

      await connection('campanha').where({ id_ong: id }).delete();

      await connection('campanha_doacao').where({ id_ong: id }).delete();

      await connection('campanha_pagto').where({ id_ong: id }).delete();

      await connection('doacao_direta').where({ id_ong: id }).delete();

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
      nom_ONG,
      des_endereco,
      nro_cep,
      des_email,
      nro_telefone,
      img_ong,
    } = request.body;
    //img_ong é base64

    try {
      const public_id = await upload(img_ong);
      let link_foto_perfil;

      if (public_id != null) {
        link_foto_perfil =
          'https://res.cloudinary.com/iagodonext/image/upload/' + public_id;
      } else {
        link_foto_perfil = '';
      }

      await connection('ong').where({ id_ong }).update({
        nom_ONG,
        des_endereco,
        nro_cep,
        link_foto_perfil,
      });

      await connection('ong_contato').where({ id_ong }).update({
        des_email,
        nro_telefone,
      });

      return response.status(200).json({
        id_ong,
        nom_ONG,
        des_endereco,
        nro_cep,
        des_email,
        nro_telefone,
        link_foto_perfil,
      });
    } catch (err) {
      console.log(err.message);
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

      return response.json(ong);
    } catch (err) {
      console.log(err.message);
      return response
        .status(400)
        .json({ error: 'Não foi possível buscar a ONG' });
    }
  },
};
