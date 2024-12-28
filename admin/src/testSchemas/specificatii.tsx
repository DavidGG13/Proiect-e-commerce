import axios from 'axios';
import { PageSchema } from '../schema';
import * as Yup from 'yup';

const domain = 'http://localhost:5500';

export const specificatii: PageSchema = {
  name: 'Specificatii',
  actions: [],
  rowActions: [
    {
      name: 'Delete Specificatie', // without form
      onSubmit: async (specificatieId: number) => {
        // onSubmit has only param, the row's ID
        const res = await axios.delete(domain + '/spec/' + specificatieId);
        return res.data;
      },
    },
    {
      name: 'Edit specificatie',
      onSubmit: async (values: any, specificatieId: number) => {
        console.log(values);
        console.log(specificatieId);
        const res = await axios.patch(domain + '/spec/update/' + specificatieId, values);
        return res.data;
      },
      initialise: async (specificatieId: number) => {
        console.log(specificatieId);

        const res = await axios.get(domain + `/spec/${specificatieId}`);
        let obj: any = {};
        obj = res.data;
        console.log(obj);
        return obj;
      },
      fields: [
        {
          name: 'nume_specificatie',
          label: 'Name',
          type: 'string',
          validationSchema: Yup.string().required('Required'),
        },
      ],
    },
  ],

  getRequest: async () => {
    const res = await axios.get(domain + '/spec');
    console.log(res.data);
    return res.data;
  },

  tableFields: [
    {
      name: 'specificatie_id',
      access: (obj: any) => obj.specificatie_id,
    },
    {
      name: 'produs_id',
      access: (obj: any) => obj.produs_id,
    },
    {
      name: 'procesor',
      access: (obj: any) => obj.procesor,
    },
    {
      name: 'ram',
      access: (obj: any) => obj.ram,
    },
    {
      name: 'rom',
      access: (obj: any) => obj.rom,
    },
    {
      name: 'capacitate_baterie',
      access: (obj: any) => obj.capacitate_baterie,
    },
    {
      name: 'sistem_operare',
      access: (obj: any) => obj.sistem_operare,
    },
  ],
};
