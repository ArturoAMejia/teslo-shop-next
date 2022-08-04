import { GetServerSideProps } from 'next'
import NextLink from "next/link";
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthLayout } from "../../components/layout";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { ErrorOutline } from "@mui/icons-material";
import { validations } from "../../utils";
import { tesloApi } from "../../api";
import { useRouter } from "next/router";
import { AuthContext } from "../../context";
import { getSession, signIn } from "next-auth/react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const destination = router.query.p?.toString() || "/";


  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onRegisterForm = async ({ name, email, password }: FormData) => {
    
    const {hasError, message} = await registerUser(name, email, password);

    if(hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    // router.replace(destination);
    await signIn('credentials', { email, password })
    

    
  };

  return (
    <AuthLayout title="Regístrate">
      <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crea tu Cuenta
              </Typography>
              {showError && (
                <Chip
                  label="Credenciales inválidas"
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                  sx={{ mt: "5px" }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: "El nombre es requerido",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
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
                Crear Cuenta
              </Button>
            </Grid>
            <Grid item xs={12}>
            <NextLink href={  destination ? `/auth/login?p=${destination} ` : `/auth/login`} passHref>

                <Link underline="always">
                  Ya tienes una cuenta? Inicia Sesión acá
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {


  const session = await getSession({req});

  const {p='/'} = query

  if (session) {
    return{
      redirect:{
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: { }
  }
}

export default RegisterPage;
