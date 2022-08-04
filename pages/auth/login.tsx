import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthLayout } from "../../components/layout";
import { useForm } from "react-hook-form";
import { validations } from "../../utils";

import { ErrorOutline } from "@mui/icons-material";

import { useRouter } from "next/router";
import { getSession, signIn, getProviders } from "next-auth/react";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  // const { loginUser } = useContext(AuthContext);]
  const destination = router.query.p?.toString() || "/";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);

  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    getProviders().then(prov =>{
      setProviders(prov)
    })
  
  }, [])
  

  const onLoginUser = async ({ email, password }: FormData) => {
    // const isLoggedIn = await loginUser(email, password);

    // if (!isLoggedIn) {
    //   setShowError(true);
    //   setTimeout(() => setShowError(false), 5000);
    // }

    // router.replace(destination);
    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>
              {showError && (
                <Chip
                  label="No reconocemos ese usuario / contraseña"
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                  sx={{ mt: "5px" }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "El campo es requerido",
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "El campo es requerido",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12}>
              <NextLink
                href={
                  destination
                    ? `/auth/register?p=${destination} `
                    : `/auth/register`
                }
                passHref
              >
                <Link underline="always">
                  Aún no tienes una cuenta? Regístrate acá
                </Link>
              </NextLink>
            </Grid>
            <Grid item xs={12} display='flex' flexDirection='column' justifyContent='flex-end'>
              <Divider sx={{ with: "100%", mb: 2 }} />
              {
                Object.values(providers).map((provider:any) => {
                  if(provider.id === 'credentials') return (<div key='credentials'></div>)
                  return (
                    <Button key={provider.id}
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{mb:1}}
                      onClick={() => signIn(provider.id)}
                    >
                      {provider.name}
                    </Button>
                  )
                })
              }
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });

  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
export default LoginPage;
