import cloudinary from '../utils/cloudinary';

export default {
  //image upload function
  async upload(request, response) {
    try {
      const fileStr = request.body.data;
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'donext_dev',
      });
      //uploadedResponse: contém todas as informações da imagem q foi carregada, como a public_id
      response.json(uploadedResponse);
    } catch (err) {
      console.error(err);
      response.status(400).json({ err: 'Não foi possível realizar o upload' });
    }
  },

  async getImages(request, response) {
    try {
      const { resources } = await cloudinary.search
        .expression('folder:donext') //pasta donext
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

      const publicIds = resources.map((file) => file.public_id);
      response.send(publicIds);
    } catch (error) {
      response.status(400).json({ err: 'Não foi possível buscar a imagem' });
    }
  },

  async getImage(request, response) {
    try {
      const { public_id } = request.body;
      const { resources } = await cloudinary.search
        .expression('folder:donext AND public_id = donext / ' + public_id)
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

      const publicIds = resources.map((file) => file.public_id);
      response.send(publicIds);
    } catch (error) {
      console.error(error);
      response.status(400).json({ err: 'Não foi possível buscar a imagem' });
    }
  },
};
