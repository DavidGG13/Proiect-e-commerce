import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { Field, Form, Formik, FieldArray, getIn } from 'formik';
import { Action, FormField, SimpleField, DropdownField, RowAction } from '../schema';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

interface RowActionWithInitialise extends RowAction {
  initialise: (obj: any) => any;
}

interface GenericFormProps {
  action: Action | RowAction;
  onClose?: () => void;
  rowId?: number;
  rowObject?: any;
}

function parseValidation(fields: FormField[] | undefined) {
  if (!fields) {
    return {};
  }

  return fields.reduce((acc: any, field) => {
    if (field.type !== 'object' && field.type !== 'array') {
      acc[field.name] = field.validationSchema ? field.validationSchema : '';
    } else if (field.type === 'array') {
      if (field.element.type === 'dropdown') {
        acc[field.name] = field.element.validationSchema
          ? Yup.array().of(field.element.validationSchema)
          : '';
      } else if (field.element.type === 'object') {
        acc[field.name] = Yup.array().of(Yup.object(parseValidation(field.element.fields)));
      } else {
        acc[field.name] = Yup.array().of(field.element.validationSchema);
      }
    } else if (field.type === 'object') {
      acc[field.name] = Yup.object(parseValidation(field.fields));
    }
    return acc;
  }, {});
}

function generateSingleField(formfield: SimpleField | DropdownField, fieldName: string, key: any) {
  return (
    <Field name={fieldName} key={key}>
      {({ field, form }: any) => (
        <FormControl isInvalid={getIn(form.touched, fieldName) && getIn(form.errors, fieldName)}>
          <FormLabel marginTop={2}>{formfield.label}</FormLabel>

          {formfield.type === 'string' ||
          formfield.type === 'number' ||
          formfield.type === 'date' ||
          formfield.type === 'datetime-local' ||
          formfield.type === 'time' ? (
            <Input
              {...field}
              value={field.value ?? ''}
              type={
                formfield.type === 'number' ||
                formfield.type === 'date' ||
                formfield.type === 'datetime-local' ||
                formfield.type === 'time'
                  ? formfield.type
                  : 'text'
              }
            />
          ) : formfield.type === 'file' ? (
            <Input
              type="file"
              name={fieldName}
              onChange={(event) => {
                if (event.currentTarget.files != null) {
                  form.setFieldValue(fieldName, event.currentTarget.files[0]);
                }
              }}
            />
          ) : (
            <Select
              {...field}
              value={field.value || ''}
              onChange={(e) => {
                const selectedOption = (formfield as DropdownField).options?.[
                  parseInt(e.target.value)
                ];
                form.setFieldValue(fieldName, selectedOption?.value);
              }}
            >
              <option disabled={true} value="">
                Select an option!
              </option>
              {(formfield as DropdownField).options?.map((option, key) => (
                <option key={key} value={key}>
                  {option.display}
                </option>
              ))}
            </Select>
          )}

          <FormErrorMessage>{getIn(form.errors, fieldName)}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}

function parseFields(fields: FormField[] | undefined, previous?: string | undefined) {
  if (!fields) {
    return [];
  }

  const computedFields = fields.map((formfield, key) => {
    const fieldName: string =
      previous !== undefined ? previous + '.' + formfield.name : formfield.name;

    if (formfield.type === 'object') {
      const objectFields = parseFields(formfield.fields, fieldName);
      return <FormControl key={key}>{objectFields}</FormControl>;
    } else if (formfield.type === 'array') {
      return (
        <FieldArray name={fieldName} key={key}>
          {({ remove, push, form }) => (
            <div>
              <FormLabel marginTop={2}>{formfield.label}</FormLabel>
              {getIn(form.values, fieldName).length > 0 &&
                getIn(form.values, fieldName).map((_: any, index: number) => (
                  <Box paddingLeft={10} key={index}>
                    <h4>
                      <b>{`${fieldName}.${index}`}</b>
                    </h4>
                    <Box paddingLeft={10}>
                      {formfield.element.type === 'object'
                        ? parseFields(formfield.element.fields, `${fieldName}.${index}`)
                        : generateSingleField(formfield.element, `${fieldName}.${index}`, key)}
                    </Box>
                    <Button
                      type="button"
                      colorScheme="red"
                      marginY={2}
                      onClick={() => remove(index)}
                    >
                      Remove {`${fieldName}.${index}`}
                    </Button>
                  </Box>
                ))}

              <Button
                type="button"
                marginY={2}
                colorScheme="blue"
                onClick={() => {
                  let value = undefined;

                  if (formfield.element.type === 'object') {
                    value = getCustomInitialValues(formfield.element.fields);
                  } else {
                    value = getCustomInitialValues([formfield.element])[0];
                  }

                  push(value);
                }}
              >
                Add {fieldName}
              </Button>
            </div>
          )}
        </FieldArray>
      );
    } else {
      return generateSingleField(formfield, fieldName, key);
    }
  });

  return computedFields;
}

function getCustomInitialValues(fields: FormField[] | undefined) {
  const obj: any = {};

  if (!fields) {
    return obj;
  }

  fields.forEach((field) => {
    if (field.type === 'object') obj[field.name] = getCustomInitialValues(field.fields);
    else obj[field.name] = undefined;
  });

  return obj;
}

async function getInitialValues(action: Action | RowAction, rowId: number | undefined) {
  let obj: any = {};
  if ((action as RowAction).initialise) {
    obj = await (action as RowActionWithInitialise).initialise(rowId);
  }
  const customInitialValues = getCustomInitialValues(action.fields);
  return Object.assign({}, customInitialValues, obj);
}

async function setOptions(fields: FormField[] | undefined) {
  if (!fields) {
    return;
  }

  const promises = fields.map(async (field) => {
    if (field.type === 'dropdown')
      field.options = field.options || (field.getOptions && (await field.getOptions()));
    else if (field.type === 'array') await setOptions([field.element]);
    else if (field.type === 'object') await setOptions(field.fields);
  });

  await Promise.all(promises);
}

export function GenericForm({ action, onClose, rowId, rowObject }: GenericFormProps) {
  const [formFields, setFormFields] = useState<any[]>(parseFields(action.fields));
  const [initialValues, setInitialValues] = useState<any>(getCustomInitialValues(action.fields));
  const [validationSchema, _] = useState<any>(parseValidation(action.fields));

  useEffect(() => {
    setOptions(action.fields).then(() => {
      setFormFields(parseFields(action.fields));
    });
  }, []);

  const handleFormReset = async () => {
    const newInitialValues = await getInitialValues(action, rowId);
    setInitialValues(newInitialValues);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={Yup.object(validationSchema)}
        onReset={handleFormReset}
        onSubmit={async (values) => {
          try {
            if (rowObject !== undefined) await action.onSubmit(values, rowId, rowObject);
            else if (rowId !== undefined) await action.onSubmit(values, rowId);
            else await action.onSubmit(values);

            if (onClose) onClose();

            Swal.fire('Action/RowAction executed successfully');
          } catch (e: any) {
            if (onClose) onClose();
            const err = (e as Error).message;

            Swal.fire({
              text: 'Error: ' + err,
            });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {formFields}
            <Button mt={4} mb={2} colorScheme="teal" isLoading={isSubmitting} type="submit">
              Submit
            </Button>
            {(action as RowAction).initialise && (
              <Button mt={4} mb={2} ml={4} colorScheme="teal" type="reset">
                Initialise Form
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
}
