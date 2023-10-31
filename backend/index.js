const http = require('http');
const url = require('url')

const app = http.createServer(async(req, res) => {
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
            try {
                respuesta = await llamaGestionPermisos(id)

                console.log("RESPUESTA GESTION DE PERMISOS "+respuesta);
    
                // Convierte el objeto en una cadena JSON
                const respuestaJSON = JSON.stringify(respuesta);
    
                // Establece el encabezado "Content-Type" y envía la respuesta JSON
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(respuestaJSON);
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('el ID no existe!\n');
            }
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


const llamaGestionPermisos = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/api/user/?id=${id}`, {
            method: 'POST'
        });
        return await response.json();
    } catch (error) {
        throw new Error(`Error: ${error.message}`)
    }
}