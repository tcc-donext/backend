import connection from '../../connection';
import configuration from '../../connection';

export async function seed(knex) {
  await connection('categoria').insert([
    { cod_categoria: 1, nom_categoria: 'Animais' },
    { cod_categoria: 2, nom_categoria: 'Pessoas' },
    { cod_categoria: 3, nom_categoria: 'Natureza' },
    { cod_categoria: 4, nom_categoria: 'Educação' },
  ]);
}
