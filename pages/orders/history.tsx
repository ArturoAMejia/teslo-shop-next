import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ShopLayout } from "../../components/layout";
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Nombre Completo", width: 300 },
  {
    field: "paid",
    headerName: "Pagado",
    description: "Muestra informacion si está pagada o no",
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="Pendiente" variant="outlined" />
      );
    },
  },
  {
    field: "order",
    headerName: "Ver Orden",
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return(
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
              <Link>
                Ver Orden
              </Link>
        </NextLink>
      )
    },
  },

];


interface Props {
  orders: IOrder[]
}

const HistoryPage:NextPage<Props> = ({orders}) => {

  const rows = orders.map((order, idx) => {
    return {
      id: idx + 1,
      paid: order.isPaid,
      fullname: order.shippingAddress.firstName + " " + order.shippingAddress.lastName,
      orderId: order._id,
    }
  })

  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes del cliente"
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect:{
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      }
    }
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);



  return {
    props: {
      id: session.user._id,
      orders
    }
  }
}

export default HistoryPage;
