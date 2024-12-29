import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';

const domain = 'http://localhost:5500';

export const produse: PageSchema = {
  name: 'Produse',
  actions: [
    {
      name: 'Adaugă Produs', // Buton nou pentru adăugare
      onSubmit: async (values: any) => {
        const res = await axios.post(domain + '/prod/add', values);
        return res.data;
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
  rowActions: [
    {
      name: 'Delete Produs', // Șterge produsul selectat
      onSubmit: async (produsId: number) => {
        const res = await axios.delete(domain + '/prod/' + produsId);
        return res.data;
      },
    },
    {
      name: 'Edit produs', // Editează produsul selectat
      onSubmit: async (values: any, produsId: number) => {
        const res = await axios.patch(domain + '/prod/update/' + produsId, values);
        return res.data;
      },
      initialise: async (produsId: number) => {
      const res = await axios.get(domain + `/prod/${produsId}`);
     let obj: any = {};
      obj = res.data; // Accesează datele direct din răspuns
      console.log(obj); // Debug pentru verificare
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