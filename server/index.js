// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/db?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Conexión error:'));
db.once('open', () => {
    console.log('Conectado a la Base de Datos');
});

app.get('/uf/:date', async (req, res) => {
    try {
        const date = req.params.date;
        const response = await axios.get(`https://mindicador.cl/api/uf/${date}`);
        res.send(response.data);
    }
    catch (error) {
        res.status(500).send('Error al obtener el valor de la UF');
    }
});

const apiRoutes = require('./routes/api');
app.use('/', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
