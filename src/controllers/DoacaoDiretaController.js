import connection from '../connection'

export default{
    //index (select) doacao direta
    async index(request,response){
        const doacaoDireta = await connection('doacao_direta').select('*');

        return response.json(doacaoDireta);
    },

    //create doacao direta
    async create(request,response){
        let {
           id_ong,
           dat_doacao,
           vlr_doacao,
           id_doador 
        } = request.body;

        let seq_doacao;

        //conversão de data
        dat_doacao = new Date(dat_doacao);

        try{
            // como pegar o seq_doacao como sendo o anterior + 1
            let seq;
            seq = await connection('doacao_direta')
                .where('id_ong', id_ong)
                .max('seq_doacao');

            seq_doacao = seq[0].max + 1;

            await connection('doacao_direta').insert({
                id_ong,
                seq_doacao,
                dat_doacao,
                vlr_doacao,
                id_doador  
            })
        }catch (err) {
            return response.status(400).json({error: err.message});
        }

        return response.json({
            id_ong,
            id_doador,
            vlr_doacao
        });
    },

    //delete doacao direta
    async delete(request,response){
        const { seq } = request.params;
        const id_ong = request.headers.authorization;
        //authorization: aba headers no insomnia: identificação de qual
        //ONG está tentando fazer a operação

        try{
            await connection('doacao_direta')
                .where({id_ong: id_ong,seq_doacao: seq})
                .delete()

        } catch (err){
            return response.status(400).json({error: err.message});
        }

        return response.json({
            id_ong,
            seq
        });
    },

    //update doacao direta
    async update(request,response){
        const { seq } = request.params;
        const id_ong = request.headers.authorization;
        //authorization: aba headers no insomnia: identificação de qual
        //ONG está tentando fazer a operação

        let {
            dat_doacao,
            vlr_doacao,
        } = request.body

        dat_doacao = new Date(dat_doacao);

        try{
            const doacao_direta = await connection('doacao_direta')
                .where({id_ong: id_ong,seq_doacao: seq})
                .update({
                    dat_doacao,
                    vlr_doacao
                })

        } catch (err){
            return response.status(400).json({error: err.message});
        }

        return response.json({
            id_ong,
            seq
        });
    },
    
    //show doacao direta
    async show(request,response){
        const { seq } = request.params;
        const id_ong = request.headers.authorization;
        //authorization: aba headers no insomnia: identificação de qual
        //ONG está tentando fazer a operação

        try{
            const doacao_direta = await connection('doacao_direta')
                .where({id_ong: id_ong,seq_doacao: seq})
                .select('*')

            return response.json({doacao_direta});
        } catch (err){
            return response.status(400).json({error: err.message});
        }

    }
}