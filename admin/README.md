# Generic Admin Panel

For configuring your own admin panel, follow the next instructions.

## How to install it?

- `npm install admin_lsac`

This command will download and install the specified package and its dependencies into your project's node_modules directory, making it available for use in your project.

## What do you need to import?

- `import { ChakraProvider } from '@chakra-ui/react'`

- `import { pageToUrl } from 'admin_lsac'`

- `import { AdminPage } from 'admin_lsac'`

You can import these in App.js / App.ts or wherever your routes to the pages are located.

- `import { PageSchema } from 'admin_lsac'`

If your project is TypeScript-based, you need to use the line above as well.

Import the component from above where you want to write your schemas! (See below for details about schemas)

## How to add routes to the admin panel's pages?

```
{your_array.map((page, index) => (
  <Route
    key={index}
    path={`${your_url_to_admin_panel}/${pageToUrl(page)}`}
    element={
      <AdminPage
        pages={your_array}
        selectedPage={page} // 'page' param from above
        basePath={your_url_to_admin_panel}
        apiURL={your_url_to_backend} // optional, for websockets
      />
    }
  />
))}
{your_array[0] ? ( // recommended default route when accessing admin panel
  <Route
    path={`${your_url_to_admin_panel}/*`}
    element={
      <AdminPage
        pages={your_array}
        selectedPage={your_array[0]}
        basePath={your_url_to_admin_panel}
        apiURL={your_url_to_backend} // optional, for websockets
      />
    }
  />
) : null}
```

You will need to create an array of schemas for your own admin panel.

#### ⚠️ Don't forget to wrap the Router component into a ChakraProvider component. Otherwise, you will not like the way it looks. :)

## What is a schema?

```
export interface TableField {
  name: string;
  access: (obj: any) => string | number | React.ReactElement;
}

export interface SimpleField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'file' | 'date' | 'datetime-local' | 'time';
  validationSchema: any;
}

export interface Option {
  value: string | number | boolean;
  display: string;
}

export interface DropdownField {
  name: string;
  label: string;
  type: 'dropdown';
  validationSchema?: any;
  options?: Option[];
  getOptions?: () => Promise<Option[]>;
}

export interface ObjectField {
  name: string;
  label: string;
  type: 'object';
  fields: FormField[];
}

export interface ArrayField {
  name: string;
  label: string;
  type: 'array';
  element: Exclude<FormField, ArrayField>;
}

export type FormField = SimpleField | DropdownField | ObjectField | ArrayField;

export interface Action {
  name: string;
  fields?: FormField[];
  onSubmit: (obj1: any, obj2?: any, obj3?: any) => Promise<any>;
}

export interface RowAction {
  name: string;
  fields?: FormField[];
  initialise?: (obj: any) => Promise<any>;
  onSubmit: (obj1: any, obj2?: any, obj3?: any) => Promise<any>;
}

export interface PageSchema {
  name: string;
  actions: Action[];
  rowActions: RowAction[];
  getRequest: () => Promise<any[]>;
  tableFields: TableField[];
}
```

A page schema is based on these interfaces, and it describes how one table of your admin panel would need to be structured to accomplish what the user needs to do regarding an entity. (i.e. users, teams, companies, quizzes)

The most important interface is `PageSchema`, as it stands at the top of the relations between all these interfaces.

What do the fields of `PageSchema` refer to?

- name = name of the table
- actions = these are operations that can affect all entries in the table (like updating all or some of the entries in the table) or operations that envolve creating new entries (one by one)
- rowActions = these are operations that can affect just one entry/row (like updating or deleting an entry)
- getRequest = this is a field containg the function that will retrieve all the entries from one table in the database
- tableFields = these are the 'definitions' of the displayed table's columns

The operations for the rowActions and actions will generally have a form to complete before executing it. There are 4 types of inputs for the form part:

- simpleField = simple data like numbers, strings, files and dates
- dropdownField = enable the user to choose an option from a predefined list
- arrayField = arrays of data
- objectField = an object containing more fields/inputs, or even other objects (some cool recursion)

#### Schema example

```
import axios from "axios";
import React from "react";
const domain = "http://localhost:3001"; // dev mode

const companies: PageSchema = {
  name: "Companies",

  getRequest: async () => { // retrieve all entries from the database
    const res = await axios.get(domain + "/something");
    return res.data;
  },

  tableFields: [ // the columns displayed on the page
    {
      name: "Company ID", // the ID must be displayed (and as first column),
      // if you would like to use rowActions ⚠️
      access: (obj: any) => obj.id, // obj.field_name
    },
    {
      name: "Name",
      access: (obj: any) => obj.name,
    },
    {
      name: "Logo",
      access: (obj: any) => // you can have even more complex functions
        obj.logoUrl
          ? React.createElement("img", {
            src: obj.logoUrl,
            alt: "ERROR",
            style: { width: "100px" },
          })
          : "No Image Available",
    },
  ],

  actions: [
    {
      name: "Create New Quiz",
      fields: [
        {
          name: "name",
          label: "Quiz Name",
          type: "string", // for every FormField, type must be specified
          validationSchema: Yup.string().required(), // you can also require 'boolean' values with Yup
        },
        {
          name: "questions",
          label: "Questions",
          type: "array",
          element: {
            name: "",
            label: "",
            type: "object",
            fields: [
              {
                name: "text",
                label: "Question Text",
                type: "string",
                validationSchema: Yup.string().required(),
              },
              {
                name: "type",
                label: "Question Type",
                type: "dropdown",
                // validationSchema is missing here (optional), so it will not be a required field
                getOptions: async () => [
                  {
                    value: "OPEN",
                    display: "Open",
                  },
                  {
                    value: "SINGLE",
                    display: "Single",
                  },
                  {
                    value: "MULTIPLE",
                    display: "Multiple",
                  },
                ],
              },
            ],
          },
        },
      ],
      onSubmit: async (formValues: any) => { // onSubmit function can also be complex
        // for actions, onSubmit will always have one param (formValues - you can change the name though)
        // you can also process formVaues as you wish
        const result = await axios.post(domain + "/something", formValues);
        return result.data;
      }
    },
  ],

  rowActions: [
    {
      name: "Modify Event - Variant 1", // without form
      onSubmit: async (eventId: number) => { // onSubmit has only param, the row's ID
        const res = await axios.delete(domain + "/something/" + eventId);
        return res.data;
      },
    },
    {
      name: "Modify Event - Variant 2", // with form
      fields: [
        {
          name: "input",
          label: "Mock Field",
          type: "string",
          validationSchema: "",
        },
      ],
      onSubmit: async (formValues: any, eventId: number) => { // onSubmit has two params
        // the first param - formValues, while the second is the row's ID
        const result = await axios.patch(domain + "/something" + eventId, formValues);
        return result.data;
      },
    },
  ],
}
```

Please note that the schema above is not related to any entity, and the fields of PageSchema do not necessarily have any relation between them. These are just random examples to teach you how to create your own schema.

#### An array of schemas must be defined as below:

```
const your_array = [
    {
        // schema 1
    },
    {
        // schema 2
    },
    ...
];
```

- In TypeScript, it would slightly change:

```
const your_array: PageSchema[] = [
    {
        // schema 1
    },
    {
        // schema 2
    },
    ...
];
```

## Websockets Support

For real-time changes, this NPM module uses socket.io-client library to implement WebSockets. So, on the server-side, you will have to use socket.io library, and provide an `apiURL` as shown above.

In order for it to work, emit an event 'updateData' from the server for every route associated with an action/rowAction. You can also send a message that the client will receive (the message will be shown in the web console).

## Other Specifications

Due to some corrupt dependencies, you will need a Node version >= 20.5.0 to use this NPM package (it may work in some cases, but we still recommend updating Node to a newer version).

For every entity you describe through a page schema, getRequest and onSubmit functions use routes created for the entity. `getRequest` function makes a GET request, while `onSumbit` function generally makes a POST, PATCH or DELETE request.

## Learn More

For more details, especially about page schemas, contact the owner. :)
