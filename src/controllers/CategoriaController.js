import connection from '../connection';

export default {

  async index(request, response) {
    try {
      const categorias = await connection('categoria').select('*');
      return response.json(categorias);
    }catch(err){
      return response
        .status(400)
        .json({ error: 'Não foi possível listar as categorias' });
    }
  },
};
