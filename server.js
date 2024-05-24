const express = require('express');
const path = require('path');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3005;

// Configurar middleware para servir archivos estáticos y parsear el cuerpo de las solicitudes
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Ruta raíz que devuelve el formulario HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para procesar la imagen
app.post('/procesarimagen', async (req, res) => {
    const imageUrl = req.body.imageUrl;

    try {
        const image = await Jimp.read(imageUrl);
        const fileName = `${uuidv4().slice(0, 8)}.jpg`;
        const filePath = path.join(__dirname, 'images', fileName);

        await image
            .resize(350, Jimp.AUTO)
            .grayscale()
            .writeAsync(filePath);

        res.sendFile(filePath);
    } catch (error) {
        res.status(500).send('Error al procesar la imagen');
    }
}); 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});