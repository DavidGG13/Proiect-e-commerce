import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';

const domain = 'http://localhost:5500';

export const recenzie: PageSchema = {
  name: 'Recenzii',
  actions: [],
  rowActions: [
    {
      name: 'Delete Recenzie',
      onSubmit: async (recenzieId: number) => {
        const res = await axios.delete(domain + '/recenzii/' + recenzieId);
        return res.data;
      },
    },
    {
      name: 'Edit Recenzie',
      onSubmit: async (values: any, recenzieId: number) => {
        console.log(values);
        console.log(recenzieId);
        const res = await axios.patch(domain + '/recenzii/update/' + recenzieId, values);
        return res.data;
      },
      initialise: async (recenzieId: number) => {
        console.log(recenzieId);

        const res = await axios.get(domain + `/recenzii/${recenzieId}`);
        let obj: any = {};
        obj = res.data;
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
          validationSchema: Yup.string().required('Required'),
        },
        {
          name: 'mesaj',
          label: 'Message',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
      ],
    },
  ],

  getRequest: async () => {
    const res = await axios.get(domain + '/rec');
    console.log(res.data);
    return res.data;
  },

  tableFields: [
    {
      name: 'id',
      access: (obj: any) => obj.recenzie_id,
    },
    {
      name: 'utilizator',
      access: (obj: any) => obj.utilizator_id,
    },
    {
      name: 'produs',
      access: (obj: any) => obj.produs_id,
    },
    {
      name: 'rating',
      access: (obj: any) => obj.rating,
    },
    {
      name: 'comentariu',
      access: (obj: any) => obj.comentariu,
    },
    {
      name: 'data',
      access: (obj: any) => obj.data_recenzie,
    },
  ],
};
