const express = require('express');
const cors = require('cors');
const sequelize = require('./conexion/database');
const Producto = require('./modelos/Producto');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());



app.post("/productos", async (req, res) => {

  const { nombre, descripcion, precio, imagen } = req.body;

  if (!nombre || precio == null) {
    return res.status(400).json({ msg: "Nombre y precio son obligatorios" });
  }

  try {

    const nuevo = await Producto.create({
      nombre,
      descripcion,
      precio,
      imagen
    });

    res.status(200).json({
      msg: "Producto agregado al inventario",
      data: nuevo
    });

  } catch (error) {

    res.status(500).json({ error: error.message || error });

  }

});

app.delete("/productos/:id", async (req, res) => {

  try {

    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    await producto.destroy();

    res.status(200).json({
      msg: "Producto eliminado correctamente"
    });

  } catch (error) {

    res.status(500).json({ error: error.message || error });

  }

});

app.put("/pedidos/:id/estado", async (req, res) => {

 const { estado_id } = req.body;

 try {

  const pedido = await Pedido.findByPk(req.params.id);

  if (!pedido) {
   return res.status(404).json({ msg: "Pedido no encontrado" });
  }

  await pedido.update({ estado_id });

  res.status(200).json({
   msg: "Estado actualizado",
   data: pedido
  });

 } catch (error) {
  res.status(500).json({ error: error.message || error });
 }

});

app.get('/', (req, res) => {
    res.json({ message: 'Backend funcionando correctamente' });
});

app.get('/api/productos/promedio-por-categoria', async (req, res) => {
    try {
        const [results] = await sequelize.query(`
            SELECT 
                categoryCode as categoria,
                AVG(value) as promedio
            FROM producto
            WHERE value > 0 AND categoryCode != ''
            GROUP BY categoryCode
            ORDER BY promedio DESC
        `);

        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            message: 'Error al obtener datos', 
            error: error.message 
        });
    }
});

app.get('/api/productos/cantidad-por-marca', async (req, res) => {
    try {
        const [results] = await sequelize.query(`
            SELECT 
                brandCode as marca,
                COUNT(*) as cantidad
            FROM producto
            WHERE brandCode != ''
            GROUP BY brandCode
            ORDER BY cantidad DESC
        `);

        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            message: 'Error al obtener datos', 
            error: error.message 
        });
    }
});

app.get('/api/productos/todos', async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            message: 'Error al obtener productos', 
            error: error.message 
        });
    }
});


sequelize.sync({ alter: true });

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto 5000");
});