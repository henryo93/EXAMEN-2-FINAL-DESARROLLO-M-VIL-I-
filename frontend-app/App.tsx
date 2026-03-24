import { ProductoProvider } from "./src/context/ProductoContext";
import ListaProductos from "./src/pantallas/PantallaAgregarProducto";

export default function App() {
  return (
    <ProductoProvider>
      <ListaProductos />
    </ProductoProvider>
  );
}