import { Link, PageHeading } from "~/app/_components/page-utils";
import { LoginForm } from "./LoginForm";

const Login = () => {
  return (
    <div className="mx-auto max-w-[360px] bg-slate-100 px-8 py-4">
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
    </div>
  );
};

export default Login;
