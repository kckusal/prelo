"use client";

import { useRouter } from "next/navigation";
import { Formik } from "formik";
import toast from "react-hot-toast";
import Form from "~/app/_components/form-items";
import { api } from "~/trpc/react";

interface RegisterFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm = () => {
  const router = useRouter();

  const registerUser = api.auth.register.useMutation({
    onSuccess: () => {
      toast.success(`User registration successful! Try logging in!`, {
        duration: 4000,
      });
      router.push("/auth/login");
    },

    onError(error) {
      toast.error(error.message, { duration: 4000 });
    },
  });

  return (
    <Formik<RegisterFields>
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validate={(values) => {
        const errors = {} as RegisterFields;

        if (!values.firstName.trim()) {
          errors.firstName = "First name is required";
        }

        if (!values.email.trim()) {
          errors.email = "Email is required";
        }

        if (!values.password) {
          errors.password = "Password is required";
        } else if (values.password.length < 8) {
          errors.password = "Password must be at least 8 characters";
        }

        if (!errors.password && values.password !== values.confirmPassword) {
          errors.confirmPassword = "Password does not match";
        }

        return errors;
      }}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values) => {
        registerUser.mutate(values);
      }}
    >
      {({ values, errors, handleChange, handleSubmit }) => (
        <form
          className=" mt-6 flex flex-col items-start gap-y-4"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full gap-x-6 [&_*]:w-full">
            <Form.Item
              Label={
                <Form.Label htmlFor="firstName" requiredMark>
                  First Name
                </Form.Label>
              }
              Error={<Form.Error>{errors.firstName}</Form.Error>}
            >
              <Form.Input
                type="text"
                name="firstName"
                onChange={handleChange}
                value={values.firstName}
                required
                autoComplete="firstName"
                hasErrors={!!errors.firstName}
              />
            </Form.Item>

            <Form.Item
              Label={<Form.Label htmlFor="lastName">Last Name</Form.Label>}
            >
              <Form.Input
                type="text"
                name="lastName"
                onChange={handleChange}
                value={values.lastName}
                autoComplete="lastName"
              />
            </Form.Item>
          </div>

          <Form.Item
            className=" w-full"
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
            />
          </Form.Item>

          <div className=" flex w-full flex-col gap-y-4 md:flex-row md:gap-x-4 [&_*]:w-full">
            <Form.Item
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

            <Form.Item
              Label={
                <Form.Label htmlFor="confirmPassword" requiredMark>
                  Confirm Password
                </Form.Label>
              }
              Error={<Form.Error>{errors.confirmPassword}</Form.Error>}
            >
              <Form.Input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                value={values.confirmPassword}
                required
                hasErrors={!!errors.confirmPassword}
              />
            </Form.Item>
          </div>

          <Form.Button
            type="submit"
            className=" self-center"
            disabled={registerUser.isLoading}
          >
            Register
          </Form.Button>
        </form>
      )}
    </Formik>
  );
};
