const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const User = require('../models/User');

router.post('/api/data', async (req, res) => {
    try {
        const { message, additionalMessage, amount, ufValor, currentTime } = req.body;
        const newData = new Data({ message, additionalMessage, amount, ufValor, currentTime });
        const savedData = await newData.save();
        res.json(savedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/api/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/api/data/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const removedData = await Data.findByIdAndDelete(id);
        res.json(removedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint para el login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Verifica si el usuario existe
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
        }
        return res.status(200).json({ message: 'Login exitoso.', username: user.username });
    } catch (error) {
        return res.status(500).json({ message: 'Ocurrió un error.', error });
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Verifica si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }
        // Crea un nuevo usuario
        const newUser = new User({ username, password });
        // Guarda el usuario en la base de datos
        await newUser.save();
        return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al registrar el usuario.', error });
    }
});

module.exports = router;