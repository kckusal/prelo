import { Link, PageHeading } from "~/app/_components/page-utils";
import { LoginForm } from "./LoginForm";

const Login = () => {
  return (
    <>
      <PageHeading
        Subtitle={
          <>
            Not a member yet? <Link href="register">Create an account</Link>{" "}
            now.
          </>
        }
      >
        Login
      </PageHeading>

      <LoginForm />
    </>
  );
};

export default Login;
