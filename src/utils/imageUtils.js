import cloudinary from './cloudinary';


export async function upload(str) {
  try {
    const fileStr = str;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'donext_dev',
    });

    return uploadedResponse.public_id;
  } catch (err) {
    console.log(err)
    console.log('Não foi possível fazer o upload da imagem');
    return null;
  }
}

export async function getImages() {
  try {
    const { resources } = await cloudinary.search
      .expression('folder:donext')
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    const publicIds = resources.map((file) => file.public_id);

    return publicIds;
  } catch (error) {
    return { err: 'Não foi possível buscar a imagem' };
  }
}

export async function getImageLinkById(id) {
  try {
    const public_id = id;
    const { resources } = await cloudinary.search
      .expression('folder:donext AND public_id = donext / ' + public_id)
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    const url = resources[0].url;
    return url;
  } catch (error) {
    console.log(error.message);
    return { err: 'Não foi possível buscar a imagem' };
  }
}
