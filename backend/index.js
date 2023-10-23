const http = require('http');
const url = require('url')

const app = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        // Si es una solicitud OPTIONS (preflight), responde con 200 OK y los encabezados CORS necesarios.
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*', // O ajusta el origen permitido según tus necesidades
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Los métodos permitidos
            'Access-Control-Allow-Headers': 'Content-Type', // Los encabezados permitidos
            'Access-Control-Allow-Credentials': 'true', // Si se permiten credenciales (cookies, autenticación)
        });
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true); // Analiza la URL y extrae los parámetros de consulta

    const queryParams = parsedUrl.query

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hola, mundo!\n');
    }  
    
    if (req.method === 'POST' && parsedUrl.pathname === `/api/user/`) {
        const id = queryParams.id; // Accede al parámetro de consulta "id"
        if (id) {
            const respuesta = {
                res: "hola soy el back!"
            };

            // Convierte el objeto en una cadena JSON
            const respuestaJSON = JSON.stringify(respuesta);

            // Establece el encabezado "Content-Type" y envía la respuesta JSON
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(respuestaJSON);
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Pagina no encontrada\n');
    }  
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${PORT}`);
});