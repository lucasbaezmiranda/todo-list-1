const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Servir los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Redirigir las solicitudes /api a FastAPI (backend)
app.use('/api', createProxyMiddleware({
    target: 'http://127.0.0.1:8000',  // Backend FastAPI corriendo en el puerto 8000
    changeOrigin: true,
    pathRewrite: {
        '^/api': '',  // Quitar '/api' de la ruta antes de enviar a FastAPI
    },
}));

// Redirigir todas las demás solicitudes al frontend (index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar el servidor Express en el puerto 80
app.listen(80, () => {
    console.log('Frontend y backend corriendo en http://localhost');
});

