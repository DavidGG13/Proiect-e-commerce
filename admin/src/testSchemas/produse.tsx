import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';

const domain = 'http://localhost:5500';

export const produse: PageSchema = {
  name: 'Produse',
  actions: [],
  rowActions: [
    {
      name: 'Delete Produs', // without form
      onSubmit: async (produsId: number) => {
        // onSubmit has only param, the row's ID
        const res = await axios.delete(domain + '/prod/' + produsId);
        return res.data;
      },
    },
    {
      name: 'Edit produs',
      onSubmit: async (values: any, produsId: number) => {
        console.log(values);
        console.log(produsId);
        const res = await axios.patch(domain + '/prod/update/' + produsId, values);
        return res.data;
      },
      initialise: async (produsId: number) => {
        console.log(produsId);

        const res = await axios.get(domain + `/prod/${produsId}`);
        let obj: any = {};
        obj = res.data;
        console.log(obj);
        return obj;
      },
      fields: [
        {
          name: 'nume_produs',
          label: 'Name',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
        {
          name: 'pret',
          label: 'Price',
          type: 'number',
          validationSchema: Yup.number().required('Required'),
        },
        {
          name: 'cantitate_stoc',
          label: 'Stock',
          type: 'number',
          validationSchema: Yup.number().required('Required'),
        },
        {
          name: 'descriere',
          label: 'Description',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
      ],
    },
  ],
  getRequest: async () => {
    const res = await axios.get(domain + '/prod');
    console.log(res.data);
    return res.data;
  },
  tableFields: [
    {
      name: 'id',
      access: (obj: any) => obj.produs_id,
    },
    {
      name: 'nume_produs',
      access: (obj: any) => obj.nume_produs,
    },
    {
      name: 'pret',
      access: (obj: any) => obj.pret,
    },
    {
      name: 'cantitate',
      access: (obj: any) => obj.cantitate_stoc,
    },
    {
      name: 'descriere',
      access: (obj: any) => obj.descriere,
    },
  ],
};
