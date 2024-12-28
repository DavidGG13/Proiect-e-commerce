import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';

const domain = 'http://localhost:5500';

export const users: PageSchema = {
  name: 'Users',
  actions: [],
  rowActions: [
    {
      name: 'Delete User', // without form
      onSubmit: async (userId: number) => {
        // onSubmit has only param, the row's ID
        const res = await axios.delete(domain + '/user/delete/' + userId);
        return res.data;
      },
    },
    {
      name: 'Edit User',
      onSubmit: async (values: any, userId: number) => {
        const res = await axios.patch(domain + '/user/update/' + userId, values);
        return res.data;
      },
      initialise: async (userId: number) => {
        // console.log(userId);

        const res = await axios.get(domain + `/user/${userId}`);
        let obj: any = {};
        obj = res.data.user[0];
        console.log(obj);
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
    console.log(res.data);
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
