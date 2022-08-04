import React from "react";
import { GetServerSideProps, NextPage } from "next";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { CartList, OrderSummary } from "../../../components/cart";
import { AdminLayout } from "../../../components/layout";
import {
  AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces";

export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

  return (
    <AdminLayout
      title={`Resumen de orden`}
      subtitle={`Orden: ${order._id}` }
      icon={<AirplaneTicketOutlined/>}
    >
      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          {/* CartList */}
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen (
                {order.numberOfItems > 1
                  ? `${order.numberOfItems} productos`
                  : `${order.numberOfItems}producto`}
                )
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega:
                </Typography>
              </Box>

              <Typography>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </Typography>
              <Typography>{order.shippingAddress.address}</Typography>
              <Typography>
                {order.shippingAddress.address2
                  ? `${order.shippingAddress.address2}`
                  : ""}
              </Typography>
              <Typography>{order.shippingAddress.phone}</Typography>
              <Typography>{order.shippingAddress.zip}</Typography>
              <Typography>{order.shippingAddress.city}</Typography>
              <Typography>{order.shippingAddress.country}</Typography>
              <Divider sx={{ my: 1 }} />

              {/* Order Summary */}
              <OrderSummary orderValues={order} />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                >
                </Box>
                <Box display='flex' flexDirection="column">
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <Chip
                    sx={{ my: 2 }}
                    label="Orden sin pagar"
                    variant="outlined"
                    color="error"
                    icon={<CreditCardOffOutlined />}
                  />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};


export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  // Valida si la orden es existe
  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders/`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
