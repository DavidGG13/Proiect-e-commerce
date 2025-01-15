import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';

const domain = 'http://localhost:5500';

export const comenzi: PageSchema = {
  name: 'Comenzi',
  actions: [],
  rowActions: [
    {
  name: 'Delete Comanda', // Funcționalitate de ștergere comandă
  onSubmit: async (comandaId: number) => {
    try {
      // Trimitem cererea DELETE la backend
      const res = await axios.delete(`${domain}/comanda/delete/${comandaId}`);

      // Afișăm răspunsul în consolă pentru debugging
      console.log('Delete Response:', res.data);

      // Returnăm răspunsul pentru UI
      return res.data;
    } catch (err: any) {
      // Log pentru eroare detaliată
      console.error('Error:', err.response?.data || err.message);

      // Aruncăm eroarea pentru gestionare în UI
      throw err;
    }
  },
},
    {
      name: 'Edit comanda',
      onSubmit: async (values: any, comandaId: number) => {
        console.log(values);
        console.log(comandaId);
        const res = await axios.patch(domain + '/comanda/update/' + comandaId, values);
        return res.data;
      },
      initialise: async (comandaId: number) => {
        console.log(comandaId);

        const res = await axios.get(domain + `/comanda/${comandaId}`);
        let obj: any = {};
        obj = res.data;
        console.log(obj);
        return obj;
      },
      fields: [
        {
          name: 'nume_client',
          label: 'Name',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
        {
          name: 'adresa',
          label: 'Address',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
        {
          name: 'telefon',
          label: 'Phone',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
        {
          name: 'email',
          label: 'Email',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
      ],
    },
  ],

  getRequest: async () => {
    const res = await axios.get(domain + '/com');
    console.log(res.data);
    return res.data;
  },

  tableFields: [
    {
      name: 'comanda_id',
      access: (obj: any) => obj.comanda_id,
    },
    {
      name: 'adresa',
      access: (obj: any) => obj.adresa_livrare,
    },
    {
      name: 'pret_total',
      access: (obj: any) => obj.pret_total,
    },
    {
      name: 'status',
      access: (obj: any) => obj.status,
    },
  ],
};
