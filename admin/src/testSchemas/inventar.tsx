import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';

const domain = 'http://localhost:5500';

export const inventar: PageSchema = {
  name: 'Inventar',
  actions: [],
  rowActions: [
    {
      name: 'Delete Inventar', // without form
      onSubmit: async (inventarId: number) => {
        // onSubmit has only param, the row's ID
        const res = await axios.delete(domain + '/inventar/' + inventarId);
        return res.data;
      },
    },
    {
      name: 'Edit inventar',
      onSubmit: async (values: any, inventarId: number) => {
        console.log(values);
        console.log(inventarId);
        const res = await axios.patch(domain + '/inventar/update/' + inventarId, values);
        return res.data;
      },
      initialise: async (inventarId: number) => {
        console.log(inventarId);

        const res = await axios.get(domain + `/inventar/${inventarId}`);
        let obj: any = {};
        obj = res.data;
        console.log(obj);
        return obj;
      },
      fields: [
        {
          name: 'nume_inventar',
          label: 'Name',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
        {
          name: 'categorie_id',
          label: 'Categorie ID',
          type: 'number',
          validationSchema: Yup.number().required('Required'),
        },
        {
          name: 'cantitate',
          label: 'Cantitate',
          type: 'number',
          validationSchema: Yup.number().required('Required'),
        },
        {
          name: 'pret',
          label: 'Pret',
          type: 'number',
          validationSchema: Yup.number().required('Required'),
        },
      ],
    },
  ],

  getRequest: async () => {
    const res = await axios.get(domain + '/inv');
    console.log(res.data);
    return res.data;
  },

  tableFields: [
    {
      name: 'inventar_id',
      access: (obj: any) => obj.inventar_id,
    },
    {
      name: 'produs_id',
      access: (obj: any) => obj.produs_id,
    },
    {
      name: 'cantitate_inventar',
      access: (obj: any) => obj.cantitate_inventar,
    },
    {
      name: 'locatie_stoc',
      access: (obj: any) => obj.locatie_stoc,
    },
  ],
};
