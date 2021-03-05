import cloudinary from '../utils/cloudinary';

export default {
  //image upload function
  async upload(request, response) {
    try {
      const fileStr = request.body.data;
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'donext_dev',
      });
    } catch (err) {
      console.error(err);
      response.status(400).json({ err: 'Não foi possível realizar o upload' });
    }
  },

  async getImages(request, response) {
    //ainda pega todas as imagens de uma pasta: deve pegar por uma public_id específica
    try {
      const { resources } = await cloudinary.search
        .expression('folder:donext') //pasta donext
        //.expression('folder:donext AND public_id = donext / cefet_sl87w6') -> public_id específico
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

      const publicIds = resources.map((file) => file.public_id);
      response.send(publicIds);
    } catch (error) {
      response.status(400).json({ err: 'Não foi possível buscar a imagem' });
    }
  },
};
