const http = require('http')
const url = require('url')

const app = http.createServer(async (req, res) => {
    cors(res)

    const parsedUrl = url.parse(req.url, true); // Analiza la URL y extrae los parámetros de consulta

    const queryParams = parsedUrl.query

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hola soy la API-Gateway!\n');
        return 
    }  

    if (req.method === 'OPTIONS') {
        res.end();
        return;
    }
    
    if (req.method === 'GET' && parsedUrl.pathname === `/api/user/`) {
        const id = queryParams.id; // Accede al parámetro de consulta "id"
        if (id) {
            try {
                response = await fetch(`http://localhost:3001/api/user/?id=${id}`, {
                    method: 'GET'
                });
                if (!response.ok){
                    console.log('error')
                    // pasamos el mismo error que nos tiro el back
                    res.writeHead(response.status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error' }));
                }
                else{
                    info = await response.json() 
                    console.log("RESPUESTA DE API ",response);
                    const respuestaJSON = JSON.stringify(info);
                    // Establece el encabezado "Content-Type" y envía la respuesta JSON
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(respuestaJSON);
                }
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('el ID no existe!\n');
            }
        }
    }

    if (req.method === 'GET' && parsedUrl.pathname === `/api/piso/`) {

        const piso = queryParams.piso; // Accede al parámetro de consulta "piso"

        if (piso) {
            try {
                response = await fetch(`http://localhost:3001/api/piso/?piso=${piso}`, {
                    method: 'POST'
                });
                if (!response.ok){
                    console.log('error')
                    // pasamos el mismo error que nos tiro el back
                    res.writeHead(response.status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error' }));
                }
                else{
                    info = await response.json() 
                    console.log("RESPUESTA DE API ",response);
                    const respuestaJSON = JSON.stringify(info);
                    // Establece el encabezado "Content-Type" y envía la respuesta JSON
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(respuestaJSON);
                }
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Piso no encontrado!\n');
            }
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Pagina no encontrada\n');
    }

    return  
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API-Gateway HTTP escuchando en el puerto ${PORT}`);
});

const cors = (res) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

const llamaBackend = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/api/user/?id=${id}`, {
            method: 'GET'
        });
        return await response.json();
    } catch (error) {
        throw new Error(`Error: ${error.message}`)
    }
}