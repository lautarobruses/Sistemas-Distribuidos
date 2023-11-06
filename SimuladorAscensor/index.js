const http = require('http');
const url = require('url')

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true); // Analiza la URL y extrae los parámetros de consulta
    const queryParams = parsedUrl.query

    if (req.method === 'GET' && req.url === '/') {
        console.log('peticion 0')
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hola soy el Simuldor del Ascensor!\n');
        return
    }  

    if (req.method === 'OPTIONS') {
        res.end();
        return;
    }

    if (req.method === 'POST' && parsedUrl.pathname === `/api/selectorAscensor/`) {
        let requestBody = '';

        req.on('data', (chunk) => {
        requestBody += chunk;  // Recopila los datos del cuerpo de la solicitud
        });

        req.on('end', () => {
        try{ 
            const requestData = JSON.parse(requestBody);
            console.log ("Petición al Simulador de Ascensor "+ requestBody);
            const piso = requestData.piso;

            if (piso!=undefined) {
    
                var respuesta;

                if (piso < '3') 
                    respuesta = {"nombre":"A"};
                else
                    if (piso >= '7')
                        respuesta = {"nombre":"B"};
                    else
                    respuesta = {"nombre":"c"};

                // Convierte el objeto en una cadena JSON
                const respuestaJSON = JSON.stringify(respuesta);
                console.log ("Respuesta del Simulador de Ascensor "+ respuestaJSON);

                // Establece el encabezado "Content-Type" y envía la respuesta JSON
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(respuestaJSON);
                return
            }
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            console.log("error");
            res.end(JSON.stringify({ error: 'Solicitud no válida' }));
            return;
          }
        });
    }

    else {
        console.log('peticion 3')
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Pagina no encontrada\n');
        return
    }  
});

const PORT = 4500;

server.listen(PORT, () => {
    console.log(`Simulador de Ascensor HTTP escuchando en el puerto ${PORT}`);
});


// no es necesario cors ya que el navegador no le pega al back

const cors = (res) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}