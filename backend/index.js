const http = require('http');
const url = require('url')

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
                const pisosResponse = await fetch(`http://localhost:5000/visitantes/permisos?id=${id}`, {
                    method: 'GET'
                });
                const informacionResponse = await fetch(`http://localhost:5000/visitantes/informacion?id=${id}`, {
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

                    // let pisos = {
                    //     pisos:[1,2,4]
                    // }
                    // let informacion = 
                    //     { 
                    //         "id":"A001", 
                    //         "nombre":"Nombre Completo", 
                    //         "edad":25, 
                    //         "email":"email@gmail.com", "fecha_checkIn":"2023-09-13T23:09:40.880Z", //formato ISO string "fecha_checkOut":"2023-09-15T23:09:40.880Z" }, 
                    //     }
                    let arrayPisos = pisos.pisos
                    const respuesta = { pisos:arrayPisos, informacion };
                    const respuestaJSON = JSON.stringify(respuesta);
    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(respuestaJSON);
                }
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('el ID no existe!\n');
            }
            return
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Pagina no encontrada\n');
        return
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

// no los vamos a usar mas. 
const llamaGestionPermisos = async (id) => {
    try {
        // CAMBIAR LA URL
        const response = await fetch(`http://localhost:5000/visitantes/permisos?id=${id}`, {
            method: 'GET'
        });
        return await response.json();

    } catch (error) {
        throw new Error(`Error: ${error.message}`)
    }
}

const llamaInformacionUsuario = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/visitantes/informacion?id=${id}`, {
            method: 'GET'
        });
        return await response.json();
    } catch (error) {
        throw new Error(`Error: ${error.message}`)
    }
}


