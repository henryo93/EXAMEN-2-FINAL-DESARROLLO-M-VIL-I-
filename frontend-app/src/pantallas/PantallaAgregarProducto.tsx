import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { useState } from "react";
import { api } from "../servicios/api";
import * as ImagePicker from "expo-image-picker";

export default function PantallaAgregarProducto({ navigation }: any){

 const [nombre,setNombre] = useState("");
 const [precio,setPrecio] = useState("");
 const [descripcion,setDescripcion] = useState("");
 const [imagen,setImagen] = useState<string | null>(null);

 const tomarFoto = async () => {

  const permiso = await ImagePicker.requestCameraPermissionsAsync();

  if(!permiso.granted){
   alert("Se necesita permiso para usar la cámara");
   return;
  }

  const resultado = await ImagePicker.launchCameraAsync({
   quality:0.7,
   allowsEditing:true
  });

  if(!resultado.canceled){
   setImagen(resultado.assets[0].uri);
  }

 };

 const guardarProducto = async () => {

  try{

   await api.post("/productos",{
    nombre,
    precio,
    descripcion,
    imagen
   });

   navigation.goBack();

  }catch(error){
   console.log(error);
  }

 };

 return(

  <View style={styles.container}>

   <View style={styles.card}>

    <Text style={styles.titulo}>🍰 Nuevo Producto</Text>

    <TextInput
     placeholder="Nombre del producto"
     placeholderTextColor="#999"
     value={nombre}
     onChangeText={setNombre}
     style={styles.input}
    />

    <TextInput
     placeholder="Precio"
     placeholderTextColor="#999"
     value={precio}
     onChangeText={setPrecio}
     keyboardType="numeric"
     style={styles.input}
    />

    <TextInput
     placeholder="Descripción"
     placeholderTextColor="#999"
     value={descripcion}
     onChangeText={setDescripcion}
     style={styles.input}
    />

    <View style={styles.boton}>
     <Button
      title="Tomar foto del producto"
      color="#B2DFDB"
      onPress={tomarFoto}
     />
    </View>

    {imagen && (
      <Image
       source={{ uri: imagen }}
       style={styles.imagen}
      />
    )}

    <View style={styles.boton}>
     <Button
      title="Guardar producto"
      color="#F8BBD0"
      onPress={guardarProducto}
     />
    </View>

   </View>

  </View>

 );

}

const styles = StyleSheet.create({

 container:{
  flex:1,
  padding:20,
  justifyContent:"center",
  backgroundColor:"#FFF6F2"
 },

 card:{
  backgroundColor:"#FFFFFF",
  padding:25,
  borderRadius:20,
  shadowColor:"#000",
  shadowOpacity:0.1,
  shadowRadius:10,
  elevation:5
 },

 titulo:{
  fontSize:22,
  marginBottom:20,
  fontWeight:"bold",
  textAlign:"center",
  color:"#5F5F5F"
 },

 input:{
  borderWidth:1,
  borderColor:"#F8BBD0",
  borderRadius:12,
  padding:12,
  marginBottom:15,
  backgroundColor:"#FFF"
 },

 boton:{
  marginTop:10,
  borderRadius:15,
  overflow:"hidden"
 },

 imagen:{
  width:"100%",
  height:200,
  marginTop:15,
  borderRadius:12
 }

});