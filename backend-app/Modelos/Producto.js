const { DataTypes } = require("sequelize");
const sequelize = require("../conexion/database");

const Producto = sequelize.define("producto", {
 id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
 },
 nombre: {
  type: DataTypes.STRING,
  allowNull: false
 },
 descripcion: {
  type: DataTypes.STRING
 },
 precio: {
 type: DataTypes.DECIMAL(10, 2),
  allowNull: false
 },
 imagen: {
  type: DataTypes.STRING

 }
});

module.exports = Producto;