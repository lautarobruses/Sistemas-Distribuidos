const http = require('http');
const url = require('url')

const app = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true); // Analiza la URL y extrae los parámetros de consulta
    const queryParams = parsedUrl.query

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hola soy el BACK!\n');
    }  

    if (req.method === 'OPTIONS') {
        res.end();
        return;
    }
    
    if (req.method === 'POST' && parsedUrl.pathname === `/api/user/`) {
        const id = queryParams.id; // Accede al parámetro de consulta "id"
        if (id) {
            const respuesta = "hola soy el back";

            console.log ("Respuesta del back "+respuesta);

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
    console.log(`Backend HTTP escuchando en el puerto ${PORT}`);
});


// no es necesario cors ya que el navegador no le pega al back

const cors = (res) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}