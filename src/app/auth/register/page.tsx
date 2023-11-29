import { Link, PageHeading } from "~/app/_components/page-utils";
import { RegisterForm } from "./RegisterForm";

const Login = () => {
  return (
    <div className=" mx-auto max-w-[600px] bg-slate-100 px-8 py-4">
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
    </div>
  );
};

export default Login;
