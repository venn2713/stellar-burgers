import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '@app-store';
import { login } from '@slices';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const dispatch = useAppDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(login({ email: values.email, password: values.password }));
  };

  return (
    <LoginUI
      errorText=''
      email={values.email}
      setEmail={(value) =>
        handleChange({ target: { name: 'email', value } } as any)
      }
      password={values.password}
      setPassword={(value) =>
        handleChange({ target: { name: 'password', value } } as any)
      }
      handleSubmit={handleSubmit}
    />
  );
};
