import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { z } from "zod";
import { http } from "../api/http";
import { authStorage } from "../auth/authStorage";

const schema = z.object({
    login: z.string().min(3),
    password: z.string().min(6),
});

type Form = z.infer<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<Form>({resolver: zodResolver(schema)});
  const onSubmit = async (data: Form) => {
    const res = await http<{accessToken: string; user: any}>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    authStorage.set(res.accessToken);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Login" {...register("login")} />
      {errors.login && <p>{errors.login.message}</p>}

      <input placeholder="Password" type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <button disabled={isSubmitting}>Zaloguj</button>
    </form>
  );
};

export default Login;
