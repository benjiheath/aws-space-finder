import React from 'react';
import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

interface InputLabelProps {
  name: string;
}

const InputLabel = (props: InputLabelProps) => {
  const { formState } = useFormContext();
  const error = formState.errors[props.name];

  const text = error ? (
    <Text display='inline' color='#AB0552'>
      {String(error.message)}
    </Text>
  ) : (
    props.name
  );

  return <FormLabel>{text}</FormLabel>;
};

interface InputFieldProps {
  name: string;
  options?: RegisterOptions;
  required?: string;
  type?: string;
}

export const InputField = (props: InputFieldProps) => {
  const { name, type, options, required } = props;
  const { register } = useFormContext();

  const inputType = React.useMemo(() => (type ?? name === 'password' ? 'password' : 'text'), [type, name]);
  const registration = register(name, { required: required ?? `${name} required`, ...options });

  return (
    <FormControl>
      <InputLabel name={name} />
      <Input type={inputType} {...registration} focusBorderColor='#e6ddd3' />
    </FormControl>
  );
};
