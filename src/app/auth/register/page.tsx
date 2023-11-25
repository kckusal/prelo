import { Link, PageHeading } from "~/app/_components/page-utils";
import { RegisterForm } from "./RegisterForm";

const Login = () => {
  return (
    <>
      <PageHeading
        Subtitle={
          <>
            Already have an account? <Link href="login">Go to login</Link> page.
          </>
        }
      >
        Create Account
      </PageHeading>

      <RegisterForm />
    </>
  );
};

export default Login;
