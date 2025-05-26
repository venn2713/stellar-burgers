import { useState, ChangeEvent } from 'react';

export function useForm<T extends Record<string, string>>(
  inputValues: T = {} as T
) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
}
