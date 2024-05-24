import express from "express";
import Jimp from "jimp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import url from "url";
import fs from "fs";

const app = express();

// Obtener la ruta del directorio actual
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, "public")));

// Analizar cuerpos codificados en URL (como los enviados por formularios HTML)
app.use(express.urlencoded({ extended: true }));

// Manejar la presentación del formulario
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Manejar la presentación del formulario
app.post("/formulario", async (req, res) => {
  const imageUrl = req.body.imageUrl;

  try {
    
    const image = await Jimp.read(imageUrl);// Leer la imagen desde la URL

    
    image.grayscale();// Convertir la imagen a escala de grises

   
    image.resize(350, Jimp.AUTO); // Redimensionar la imagen a 350px de ancho

    // Generar un UUID para el nombre del archivo
    const uuid = uuidv4();

    await image.writeAsync(
      path.join(__dirname, "public/images", `${uuid}.jpg`)
    ); // Guardar la imagen en el directorio "public/images"
    res.redirect(`/images/${uuid}.jpg`); // Redirigir al usuario a la página de la imagen
  } catch (error) {
    console.error(error);
    res.status(500).send("Error procesando la imagen");
  }
});

app.get("/formulario", async (req, res) => {
  res.setHeader("Content-Type", "image/png");
  try {
    const imagen = await Jimp.read(
      "https://wp-content.miviaje.com/2017/11/nueva-york.jpg?auto=webp&quality=60&width=1920&crop=16:9,smart,safe"
    );
    await imagen
      .resize(350, Jimp.AUTO)
      .greyscale()
      .quality(20)
      .writeAsync("img.png");
    const imagenData = fs.readFileSync("img.png");
    res.send(imagenData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log(`Servidor corriendo en  http://localhost:3000`);
});
