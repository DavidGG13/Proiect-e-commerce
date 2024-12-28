import * as React from 'react';

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
