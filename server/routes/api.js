const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

router.post('/data', async (req, res) => {
    try {
        const { message, additionalMessage, amount, ufValor } = req.body;
        const newData = new Data({ message, additionalMessage, amount, ufValor });
        const savedData = await newData.save();
        res.json(savedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/data/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const removedData = await Data.findByIdAndDelete(id);
        res.json(removedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
