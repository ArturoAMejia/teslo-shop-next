import { ConfirmationNumberOutlined } from "@mui/icons-material";
import React from "react";
import useSWR from "swr";
import { AdminLayout } from "../../components/layout";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IOrder, IUser } from "../../interfaces";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 200 },
  { field: 'name', headerName: 'Nombre Completo', width: 200 },
  { field: 'total', headerName: 'Monto Total', width:150 },
  {
    field: 'isPaid',
    headerName: 'Pagado',
    renderCell:({row}: GridValueGetterParams )=> {
      return row.isPaid 
      ? (<Chip variant='outlined' label='Pagado' color="success"/>)
      : (<Chip variant='outlined' label='Pendiente' color="error"/>)
  }
  },
  { field: 'noProducts', headerName: 'No. Productos', align:'center',width: 200 },
  {
    field: 'check',
    headerName: 'Ver Orden',
    renderCell:({row}: GridValueGetterParams )=> {
      return (
        <a href={`/admin/orders/${row.id}`} target='_blank' rel="noreferrer" >
          Ver Orden
        </a>
      )
  }
  },
  { field: 'createdAt', headerName: 'Creada en: ',width: 300 },


]

const OrdersPage = () => {
  const {data, error} = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) return <></>;

  const rows = data!.map(order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt
  }));

  return (
    <AdminLayout
      title={"Ordenes"}
      subtitle={"Mantenimiento de ordenes"}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows} 
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
