import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
const domain = 'http://localhost:5500';

export const users: PageSchema = {
  name: 'Users',
  actions: [
    {
      name: 'Add User', // Funcția de adăugare utilizator
      fields: [
  {
    name: 'nume',
    label: 'Name',
    type: 'string',
    validationSchema: Yup.string().required('Required'),
  },
  {
    name: 'email',
    label: 'Email',
    type: 'string',
    validationSchema: Yup.string().email('Invalid email').required('Required'),
  },
  {
    name: 'parola', // Folosim exact denumirea cerută de backend
    label: 'Password',
    type: 'string',
    validationSchema: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
  },
  {
    name: 'rol',
    label: 'Role',
    type: 'string',
    validationSchema: Yup.string().required('Required'),
  },
  {
    name: 'adresa', // Exact denumirea cerută de backend
    label: 'Address',
    type: 'string',
    validationSchema: Yup.string().required('Required'),
  },
  {
    name: 'numar_telefon', // Exact denumirea cerută de backend
    label: 'Phone Number',
    type: 'string',
    validationSchema: Yup.string().required('Required'),
  },
],
      onSubmit: async (values: any) => {
  try {
    // Criptăm parola
    const hashedPassword = await bcrypt.hash(values.parola, 10);

    // Creăm obiectul final pentru trimitere
    const userData = {
      nume: values.nume,
      email: values.email,
      parola: hashedPassword, // Trimitem parola criptată
      rol: values.rol,
      adresa: values.adresa,
      numar_telefon: values.numar_telefon,
    };

    // Trimitem datele către backend
    const res = await axios.post(domain + '/user/register', userData);
    return res.data;
  } catch (err: any) {
    console.error('Error:', err.response?.data || err.message);
    throw err;
  }
},
    },
  ],
  rowActions: [
    {
      name: 'Delete User', // Ștergere utilizator
      onSubmit: async (userId: number) => {
  try {
    const res = await axios.delete(`${domain}/user/delete/${userId}`);
    console.log('Delete Response:', res.data);
    return res.data;
  } catch (err: any) {
    console.error('Error:', err.response?.data || err.message);
    throw err; // Propagăm eroarea pentru UI
  }
}
    },
    {
      name: 'Edit User', // Editare utilizator
      onSubmit: async (values: any, userId: number) => {
        const res = await axios.patch(domain + '/user/update/' + userId, values);
        return res.data;
      },
      initialise: async (userId: number) => {
        const res = await axios.get(domain + `/user/${userId}`);
        let obj: any = {};
        obj = res.data.user[0];
        return obj;
      },
      fields: [
        {
          name: 'nume',
          label: 'Name',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
        {
          name: 'email',
          label: 'Email',
          type: 'string',
          validationSchema: Yup.string().email('Invalid email').required('Required'),
        },
        {
          name: 'rol',
          label: 'Role',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
      ],
    },
  ],
  getRequest: async () => {
    const res = await axios.get(domain + '/user');
    return res.data.users;
  },
  tableFields: [
    {
      name: 'id',
      access: (obj: any) => obj.utilizator_id,
    },
    {
      name: 'name',
      access: (obj: any) => obj.nume,
    },
    {
      name: 'email',
      access: (obj: any) => obj.email,
    },
    {
      name: 'role',
      access: (obj: any) => obj.rol,
    },
  ],
};