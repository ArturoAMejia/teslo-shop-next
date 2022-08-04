import React, { useContext, useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layout";
import { CartContext } from "../../context";
import { countries } from "../../utils";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const SummaryPage = () => {
  const router = useRouter();

  const {shippingAddress, numberOfItems, createOrder} = useContext(CartContext)
  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!Cookies.get('firstName')){
      router.push('/checkout/address')
    }
  

  }, [router])
  
  const onCreateOrder = async () => {
    setIsPosting(true)
    const {hasError, message} = await createOrder()
    if (hasError){
      setIsPosting(false)
      setErrorMessage(message)
      return
    }
    router.replace(`/orders/${message}`)
  }

  if(!shippingAddress) {
    return <></>
  }

  return (
    <ShopLayout
      title={"Resumen de orden - 3"}
      pageDescription={"Resumen de la orden"}
    >
      <Typography variant="h1" component="h1">
        Resumen de la Orden
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          {/* CartList */}
          <CartList editable={false} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen ({numberOfItems} productos)</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega:
                </Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>{shippingAddress?.firstName} {shippingAddress?.lastName}</Typography>
              <Typography>{shippingAddress?.address}</Typography>
              <Typography>{shippingAddress?.address2}</Typography>
              <Typography>{countries.find(c=> c.code === shippingAddress.country)?.name}</Typography>
              <Typography>{shippingAddress?.phone}</Typography>
              <Typography>{shippingAddress?.zip}</Typography>
              <Divider sx={{ my: 1 }} />

              {/* Order Summary */}
              <OrderSummary />
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Button onClick={onCreateOrder} color="secondary" className="circular-btn" fullWidth disabled={isPosting}>
                  Confirmar Orden
                </Button>
                <Chip color='error' label={errorMessage} sx={{display: errorMessage ? 'flex' : 'none', mt:2}}/>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
