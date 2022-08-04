import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import React from "react";
import NextLink from "next/link";
import { ShopLayout } from "../../components/layout";


const emptyPage = () => {
  return (
    <ShopLayout
      title={"Carrito Vacío"}
      pageDescription={"No hay nada que mostrar aqui"}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display="flex" flexDirection="column">
          <Typography>Su carrito está vacío</Typography>
          <NextLink href="/" passHref>
            <Link typography="h4" color="secundary">
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default emptyPage;
