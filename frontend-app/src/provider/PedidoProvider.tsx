import { useState } from "react";
import { ProductoContext } from "../context/ProductoContext";
import { api } from "../servicios/api";
import { Alert } from "react-native";

export default function PedidoProvider({ children }: any) {

 const [cliente, setCliente] = useState<any>(null);
 const [productos, setProductos] = useState<any[]>([]);

 const agregarProducto = (producto: any) => {

  setProductos(prev => {

   const existe = prev.find((p:any) => p.id === producto.id);

   if (existe) {

    return prev.map((p:any) => {

     if (p.id === producto.id) {

      const nuevaCantidad = (p.cantidad ?? 1) + 1;

      return {
       ...p,
       cantidad: nuevaCantidad,
       subtotal: nuevaCantidad * Number(p.precio)
      };

     }

     return p;

    });

   }

   return [
    ...prev,
    {
     ...producto,
     cantidad: 1,
     subtotal: Number(producto.precio)
    }
   ];

  });

 };

 const eliminarProducto = (id: number) => {

  setProductos(prev => prev.filter((p:any) => p.id !== id));

 };

 const actualizarCantidadProducto = (id:number, cantidad:number) => {

  setProductos(prev => prev.map((p:any) => {

   if (p.id === id) {

    return {
     ...p,
     cantidad,
     subtotal: cantidad * Number(p.precio)
    };

   }

   return p;

  }));

 };

 const total = productos.reduce((sum, p) => sum + Number(p.subtotal || 0), 0);

 const limpiarPedido = () => {
  setCliente(null);
  setProductos([]);
 };

 const confirmarPedido = async () => {

  if (!cliente) {
   Alert.alert("Seleccione un cliente");
   return;
  }

  if (productos.length === 0) {
   Alert.alert("Agregue productos al pedido");
   return;
  }

  const detalles = productos.map((p: any) => ({
   producto_id: p.id,
   cantidad: p.cantidad,
   subtotal: p.subtotal
  }));

  const body = {
   cliente_id: cliente.id,
   usuario_id: 1,
   detalles
  };

  const resumen = productos
   .map((p:any)=>`${p.nombre} x${p.cantidad} - L ${p.subtotal}`)
   .join("\n");

  Alert.alert(
   "Confirmar pedido",
   `Cliente: ${cliente.nombre}\n\n${resumen}\n\nTotal: L ${total}`,
   [
    {
     text: "Cancelar",
     style: "cancel"
    },
    {
     text: "Confirmar",
     onPress: async () => {

      try {

       console.log("Enviando pedido:", body);

       await api.post("/pedidos", body);

       Alert.alert("Pedido registrado correctamente");

       limpiarPedido();

      } catch (error:any) {

       console.log("Error backend:", error.response?.data || error);
       Alert.alert("Error al registrar el pedido");

      }

     }
    }
   ]
  );

 };

 return (

  <ProductoContext.Provider
   value={{

    cliente,
    setCliente,

    productos,
    agregarProducto,
    eliminarProducto,
    actualizarCantidadProducto,

    total,

    confirmarPedido,
    limpiarPedido

   }}
  >

   {children}

  </ProductoContext.Provider>

 );

}