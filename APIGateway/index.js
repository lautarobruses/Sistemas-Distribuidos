const http = require('http')
const url = require('url')

const mqtt = require("mqtt");
const { log } = require('console');
const client = mqtt.connect("mqtt://test.mosquitto.org");

var booleanRFID=false;
var idRFID;

client.on("connect", () => {
  client.subscribe("SistemasDistribuidos2023", (err) => {
    if (err)
        console.error(err);
    else
        console.log('suscripto correctamente a topico MQTT')
  });
});

client.on("message", async(topic, message) => {// alguien apoyo una tarjeta
 
  const  mes = message.toString();
  console.log(mes);

  console.log("HOLA");

  idRFID=JSON.parse(mes);

  console.log(idRFID);

  console.log("1");

  respuestaRFID=true;

  console.log("El ID es:"+idRFID);

});

client.on("error", (error) => {                           // Manejo de errores
    console.error("Error en el cliente MQTT:", error);
  });
  
  client.on("close", () => {                              // Manejo de desconexión
    console.log("Desconectado del servidor MQTT");
  });


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
            return
        }
    }



    if (req.method === 'GET' && parsedUrl.pathname === `/api/lectortarjeta`) {
        if (!booleanRFID) {
                try {
                    response = await fetch(`http://localhost:3001/api/user/?id=${idRFID}`, {
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
                booleanRFID=false;
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
                console.log ("Petición a la API-Gateway "+ requestBody);
                const requestData = JSON.parse(requestBody);
                const piso = requestData.piso;
                const datos = {"piso":piso};
                const response = await fetch(`http://localhost:3001/api/piso/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(datos),
                });
                if (!response.ok){
                    console.log('error')
                    // pasamos el mismo error que nos tiro el back
                    res.writeHead(response.status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error' }));
                }
                else{
                    info = await response.json() 
                    const respuestaJSON = JSON.stringify(info);
                    console.log ("Respuesta de la API-Gateway "+ respuestaJSON);

                    // Establece el encabezado "Content-Type" y envía la respuesta JSON
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(respuestaJSON);
                }
            } catch (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Piso no encontrado!\n');
            }
            
        }); 
    }
        else {
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

