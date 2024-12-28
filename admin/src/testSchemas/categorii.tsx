import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';

const domain = 'http://localhost:5500';

export const categorii: PageSchema = {
  name: 'Categorii',
  actions: [],
  rowActions: [
    {
      name: 'Delete Categorie', // without form
      onSubmit: async (categorieId: number) => {
        // onSubmit has only param, the row's ID
        const res = await axios.delete(domain + '/categ/' + categorieId);
        return res.data;
      },
    },
    {
      name: 'Edit categorie',
      onSubmit: async (values: any, categorieId: number) => {
        console.log(values);
        console.log(categorieId);
        const res = await axios.patch(domain + '/categ/update/' + categorieId, values);
        return res.data;
      },
      initialise: async (categorieId: number) => {
        console.log(categorieId);

        const res = await axios.get(domain + `/categ/${categorieId}`);
        let obj: any = {};
        obj = res.data;
        console.log(obj);
        return obj;
      },
      fields: [
        {
          name: 'nume_categorie',
          label: 'Name',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
      ],
    },
  ],

  getRequest: async () => {
    const res = await axios.get(domain + '/cat');
    console.log(res.data);
    return res.data;
  },

  tableFields: [
    {
      name: 'nume_categorie',
      access: (obj: any) => obj.nume_categorie,
    },
  ],
};
