export type AuthFormState = {
  errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  };
  values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
};
