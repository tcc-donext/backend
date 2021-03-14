import connection from '../connection';
import { upload, getImageLinkById, getImages } from '../utils/imageUtils';

export default {
  //index (select) campaign
  async index(request, response) {
    try {
      const campanhas = await connection('campanha').select('*');

      const newCamps = await Promise.all(
        campanhas.map(async (camp) => {
          const fotos = await connection('campanha_foto').where({
            id_ong: camp.id_ong,
            seq_campanha: camp.seq_campanha,
          });

          let arr_fotos = [];

          fotos.map((foto) => {
            arr_fotos.push(
              'https://res.cloudinary.com/iagodonext/image/upload/v1612480781/' +
                foto.id_img
            );
          });

          camp.fotos = arr_fotos;

          return camp;
        })
      );

      return response.json(newCamps);
    } catch (err) {
      return response.sendStatus(500);
    }
  },

  //create campaign
  async create(request, response) {
    //falta link para imagem: campanha_foto
    const id_ong = request.user.id;

    let {
      des_titulo,
      des_geral,
      cod_categoria,
      dat_inicio,
      dat_fim,
      vlr_objetivo,
      img_campanha,
    } = request.body;
    //img_campanha é uma base 64 representando a imagem selecionada

    //conversão de datas
    dat_inicio = new Date(dat_inicio);
    dat_fim = new Date(dat_fim);

    //valor arrecadado e pago: default 0
    const vlr_arrecadado = 0.0;
    const vlr_pago = 0.0;

    try {
      // como pegar o seq_campanha como sendo o anterior + 1
      let seq;
      seq = await connection('campanha')
        .where('id_ong', id_ong)
        .max('seq_campanha');

      let seq_campanha = seq[0].max + 1;

      await connection('campanha').insert({
        id_ong,
        seq_campanha,
        des_titulo,
        des_geral,
        cod_categoria,
        dat_inicio,
        dat_fim,
        vlr_objetivo,
        vlr_arrecadado,
        vlr_pago,
      });

      //upload de imagem
      const public_id = await upload(img_campanha);
      if (public_id != null) {
        //pega o seq_foto anterior e soma 1
        seq = await connection('campanha_foto')
          .where({
            id_ong: id_ong,
            seq_campanha: seq_campanha,
          })
          .max('seq_foto');

        let seq_foto = seq[0].max + 1;

        await connection('campanha_foto').insert({
          id_ong,
          seq_campanha,
          seq_foto,
          id_img: public_id,
        });
      } else
        return response
          .status(400)
          .json({ error: 'Não foi possível criar a campanha' });

      return response.json({
        id_ong,
        seq_campanha,
        des_titulo,
      });
    } catch (err) {
      console.log(err.message);
      return response
        .status(400)
        .json({ error: 'Não foi possível criar a campanha' });
    }
  },

  //delete campaign
  async delete(request, response) {
    const { seq } = request.params;
    const id_ong = request.user.id;
    //authorization: aba headers no insomnia: identificação de qual
    // ONG está tentando fazer a operação

    try {
      const campanha = await connection('campanha')
        .where({ id_ong: id_ong, seq_campanha: seq })
        .delete();

      if (campanha === 0) {
        return response.sendStatus(404);
      }

      return response.sendStatus(200);
    } catch (err) {
      return response
        .status(400)
        .json({ error: 'Não foi possível deletar a campanha' });
    }
  },

  //update campaign
  async update(request, response) {
    const { seq } = request.params;
    const id_ong = request.user.id;

    const {
      des_titulo,
      des_geral,
      cod_categoria,
      dat_inicio,
      dat_fim,
      vlr_objetivo,
      vlr_arrecadado,
      vlr_pago,
    } = request.body;

    try {
      const x = await connection('campanha')
        .where({ id_ong: id_ong, seq_campanha: seq })
        .update({
          des_titulo,
          des_geral,
          cod_categoria,
          dat_inicio,
          dat_fim,
          vlr_objetivo,
          vlr_arrecadado,
          vlr_pago,
        });

      if (x === 0) {
        return response.sendStatus(404);
      }

      return response.sendStatus(200);
    } catch (err) {
      return response
        .status(400)
        .json({ error: 'Não foi possível atualizar a campanha' });
    }
  },

  //show a specific campaign
  async show(request, response) {
    const { seq, id_ong } = request.params;

    try {
      let campanha;
      campanha = await connection('campanha')
        .where({ 'campanha.id_ong': id_ong, 'campanha.seq_campanha': seq })
        .select('*');

      const fotos = await connection('campanha_foto').where({
        id_ong: id_ong,
        seq_campanha: seq,
      });

      let arr_fotos = [];

      fotos.map((foto) => {
        arr_fotos.push(
          'https://res.cloudinary.com/iagodonext/image/upload/v1612480781/' +
            foto.id_img
        );
      });

      campanha[0].fotos = arr_fotos;

      return response.json(campanha[0]);
    } catch (err) {
      return response.status(400).json({
        error:
          'Não foi possível recuperar a campanha ' + seq + ' da ONG ' + id_ong,
      });
    }
  },
};
