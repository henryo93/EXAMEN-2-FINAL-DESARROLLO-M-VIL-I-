import { createContext, useEffect, useState } from "react";
import { api } from "../servicios/api";

export const ProductoContext = createContext<any>(null);

export const ProductoProvider = ({ children }: any) => {

  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    const res = await api.get("/producto");
    setProductos(res.data);
  };

  const crearProducto = async (producto: any) => {
    await api.post("/producto", producto);
    obtenerProductos();
  };

  const eliminarProducto = async (id: number) => {
    await api.delete(`/items/${id}`);
    obtenerProductos();
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <ProductoContext.Provider
      value={{
        productos,
        crearProducto,
        eliminarProducto,
      }}
    >
      {children}
    </ProductoContext.Provider>
  );
};