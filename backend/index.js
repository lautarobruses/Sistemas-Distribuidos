const http = require('http');
const url = require('url')

const PUERTO_GESTION_VISITANTE = 8002
const PUERTO_GESTION_PERMISOS = 8003
const PUERTO_SELECTOR_ASCENSOR = 8080

const app = http.createServer(async(req, res) => {
    const parsedUrl = url.parse(req.url, true); // Analiza la URL y extrae los parámetros de consulta
    const queryParams = parsedUrl.query

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hola soy el BACK!\n');
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
                console.log(id)
                const pisosResponse = await fetch(`http://10.2.212.10:${PUERTO_GESTION_PERMISOS}/visitantes/${id}/permisos`, {
                    method: 'GET'
                });
                const informacionResponse = await fetch(`http://10.2.212.10:${PUERTO_GESTION_VISITANTE}/visitantes/${id}/info`, {
                    method: 'GET'  
                });

                if (!pisosResponse.ok || !informacionResponse.ok) {
                    // esto podria meterlo dentro un unico writeHead() y res.end()
                    if (pisosResponse.status === 404 || informacionResponse.status === 404) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'El ID no existe' }));
                    } else if (pisosResponse.status === 500 || informacionResponse.status === 500) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error interno del servidor' })); 
                    } else {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error en la solicitud' })); 
                    }
                } else {  
                    // Si llega a este punto, ambas solicitudes fueron exitosas
                    const pisos = await pisosResponse.json();
                    const informacion = await informacionResponse.json();


                    console.log('LA RESPUESTA DE PISOS ES',pisos)
                    let arrayPisos = pisos.pisos_permitidos
                    const respuesta = { pisos:arrayPisos, informacion };
                    const respuestaJSON = JSON.stringify(respuesta); 
                    console.log(respuesta);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(respuestaJSON); 
                } 
            } catch (error) {
                console.log(error)
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('el ID no existe!\n');
            }
            return
        } 
    }  

    if (req.method === 'POST' && parsedUrl.pathname === `/api/piso/`) {
        var requestBody = '';

        req.on('data', (chunk) => { 
        requestBody += chunk;  // Recopila los datos del cuerpo de la solicitud
        });

        req.on('end', async() => {
            try {
                console.log ("Petición al BackEnd "+ requestBody);
                const requestData = JSON.parse(requestBody);
                const piso = requestData.piso;
                const datos = {
                    "piso_origen":0,
                    "piso_destino":parseInt(piso)
                    };
                console.log(piso)
                console.log(datos)
                const ascensorResponse = await fetch(`http://10.2.210.241:${PUERTO_SELECTOR_ASCENSOR}/api/selectorAscensor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify(datos),
                });

                if (!ascensorResponse.ok) {
                    // esto podria meterlo dentro un unico writeHead() y res.end()
                    if (ascensorResponse.status === 404) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'El ID no existe' }));
                    } else if (ascensorResponse.status === 500) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
                    } else {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error en la solicitud' }));
                    }
                } else {
                    // Si llega a este punto, solicitud exitosa
                    const ascensor = await ascensorResponse.json();

                    let nombre = ascensor.nombre

                    const respuesta = { nombre };
                    const respuestaJSON = JSON.stringify(respuesta);

                    console.log ("Respuesta del Backend "+ respuestaJSON);
    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(respuestaJSON);
                }
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Piso no existe!\n');
            }
        });
    } else {
        console.log("falla")
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Pagina no encontrada\n');
    }
    return 
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
