import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {login} from "../api/authApi";
import {authStorage} from "../storage/authStorage";

const schema = z.object({
  login: z.string().min(3, "Login musi mieć minimum 3 znaki"),
  password: z.string().min(6, "Hasło musi mieć minimum 6 znaków"),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await login(data);
      authStorage.setToken(response.accessToken);
      window.location.reload();
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error ? error.message : "Nie udało się zalogować",
      });
    }
  };

  return (
    <div className="loginWrap">
      <div className="loginCard">
        <h1 className="loginTitle">SmartHome Control Center</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="loginForm">
          <input placeholder="Login" {...register("login")} />
          {errors.login && <p className="loginError">{errors.login.message}</p>}

          <input
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="loginError">{errors.password.message}</p>
          )}

          {errors.root && <p className="loginError">{errors.root.message}</p>}

          <button disabled={isSubmitting}>
            {isSubmitting ? "Logowanie..." : "Zaloguj"}
          </button>
        </form>

        <p className="loginHint">Demo: user / admin</p>
      </div>
    </div>
  );
};

export default LoginPage;
