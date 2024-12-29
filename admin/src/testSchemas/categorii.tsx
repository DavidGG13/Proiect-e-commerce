import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';

const domain = 'http://localhost:5500';

export const categorii: PageSchema = {
  name: 'Categorii',
  actions: [
    {
      name: 'Adaugă Categorie', // Adaugăm butonul pentru adăugare
      onSubmit: async (values: any) => {
        const res = await axios.post(domain + '/cat/add', values); // Endpoint pentru adăugare
        return res.data;
      },
      fields: [
        {
          name: 'nume_categorie',
          label: 'Nume Categorie',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
        {
          name: 'descriere',
          label: 'Descriere',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
      ],
    },
  ],
  rowActions: [
    {
      name: 'Delete Categorie', // Ștergere categorie
      onSubmit: async (categorieId: number) => {
        const res = await axios.delete(domain + '/cat/' + categorieId);
        return res.data;
      },
    },
    {
      name: 'Edit categorie', // Editare categorie
      onSubmit: async (values: any, categorieId: number) => {
        const res = await axios.patch(domain + '/cat/update/' + categorieId, values);
        return res.data;
      },
      initialise: async (categorieId: number) => {
        const res = await axios.get(domain + `/cat/${categorieId}`);
        return res.data;
      },
      fields: [
        {
          name: 'nume_categorie',
          label: 'Nume',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
        {
          name: 'descriere',
          label: 'Descriere',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
      ],
    },
  ],
  getRequest: async () => {
    const res = await axios.get(domain + '/cat');
    return res.data;
  },
  tableFields: [
    {
      name: 'ID',
      access: (obj: any) => obj.categorie_id, // ID-ul categoriei
    },
    {
      name: 'Nume',
      access: (obj: any) => obj.nume_categorie, // Numele categoriei
    },
    {
      name: 'Descriere',
      access: (obj: any) => obj.descriere, // Descrierea categoriei
    },
  ],
};