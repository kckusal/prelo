"use client";

import { Formik } from "formik";
import toast from "react-hot-toast";
import Form from "~/app/_components/form-items";
import { useAuthToken } from "~/app/_store/auth";
import { api } from "~/trpc/react";

import { Button } from "@kcstack/ui-react";

const authToastKey = "authToast";

interface LoginFields {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { setToken, removeToken } = useAuthToken();

  const loginUser = api.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success("Login successful!", { id: authToastKey, duration: 4000 });
      setToken(data.accessToken);
    },
    onError(error) {
      toast.error(error.message, { id: authToastKey, duration: 4000 });
      removeToken();
    },
  });

  return (
    <Formik<LoginFields>
      initialValues={{ email: "", password: "" }}
      validate={(values) => {
        const errors = {} as LoginFields;

        if (!values.password) {
          errors.password = "Password is required";
        }

        return errors;
      }}
      validateOnChange={false}
      onSubmit={(values) => {
        toast.remove(authToastKey);
        loginUser.mutate(values);
      }}
    >
      {({ values, errors, handleChange, handleSubmit }) => (
        <form
          className=" flex flex-col items-start gap-y-4 "
          onSubmit={handleSubmit}
        >
          <Form.Item
            className=" w-[300px]"
            Label={
              <Form.Label htmlFor="email" requiredMark>
                Email
              </Form.Label>
            }
          >
            <Form.Input
              type="email"
              name="email"
              onChange={handleChange}
              value={values.email}
              required
              autoComplete="email"
              placeholder="john@example.com"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            className=" w-[300px]"
            Label={
              <Form.Label htmlFor="password" requiredMark>
                Password
              </Form.Label>
            }
            Error={<Form.Error>{errors.password}</Form.Error>}
          >
            <Form.Input
              type="password"
              name="password"
              onChange={handleChange}
              value={values.password}
              required
              hasErrors={!!errors.password}
            />
          </Form.Item>

          <Button
            title="Click to submit"
            type="submit"
            className=" mb-2 gap-x-2 self-center rounded bg-gray-600 p-3 text-white"
            disabled={loginUser.isLoading}
          >
            {loginUser.isLoading && (
              <span className="loading loading-spinner loading-xs" />
            )}
            Login
          </Button>
        </form>
      )}
    </Formik>
  );
};
