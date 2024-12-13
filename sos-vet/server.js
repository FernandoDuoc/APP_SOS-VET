const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 3000;

app.use(express.json());

app.get('https://maps.googleapis.com/maps/api', async (req, res) => {
  const { latitud, longitud, radio, tipo } = req.query;
  const apiKey = 'AIzaSyCa1v0xBkBxXoRqdH9P3RJOAe6nKqq9q2E'; // Reemplaza con tu clave de API

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitud},${longitud}&radius=${radio}&type=${tipo}&key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectarse con la API de Google' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
