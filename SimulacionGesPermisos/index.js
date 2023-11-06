const http = require('http');
const url = require('url')

const app = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true); // Analiza la URL y extrae los parámetros de consulta
    const queryParams = parsedUrl.query

    if (req.method === 'GET' && req.url === '/') {
        console.log('peticion 0')
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hola soy el BACK!\n');
        return
    }  

    if (req.method === 'OPTIONS') {
        res.end();
        return;
    }
    
    if (req.method === 'GET' && parsedUrl.pathname === `/visitantes/permisos`) {
        const id = queryParams.id; // Accede al parámetro de consulta "id"
        if (id) {

            console.log('recibe peticion 1')
           
            var respuesta;

            if (id == '333') 
                respuesta = {pisos:[2,5,7]};
            else
                if (id == '444')
                    respuesta = {pisos:[3,4,8]};
                else
                respuesta = {pisos:[0]};
               
            console.log ("Respuesta del GesPermisosclear "+respuesta);

            // Convierte el objeto en una cadena JSON
            const respuestaJSON = JSON.stringify(respuesta);

            // Establece el encabezado "Content-Type" y envía la respuesta JSON
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(respuestaJSON);
            return
        }
    }
    if (req.method === 'GET' && parsedUrl.pathname === `/visitantes/informacion`) {
        const id = queryParams.id; // Accede al parámetro de consulta "id"
        if (id) {

            console.log('recibe peticion 2')
           
            var respuesta;

            if (id == '333') {
                respuesta = { 
                    "id":id, 
                    "nombre":"Nombre Completo", 
                    "edad":25, 
                    "email":"email@gmail.com", "fecha_checkIn":"2023-09-13T23:09:40.880Z", //formato ISO string "fecha_checkOut":"2023-09-15T23:09:40.880Z" }, 
                    };
                }
            else{
                respuesta = { 
                        "id":id, 
                        "nombre":"EL USUARIO NO EXISTE", 
                        "edad":26, 
                        "email":"email@gmail.com",
                        "fecha_checkIn":"2023-09-13T23:09:40.880Z", //formato ISO string "fecha_checkOut":"2023-09-15T23:09:40.880Z" }, 
                }
            }
               
            console.log ("Respuesta del GesPermisosclear ",{respuesta});

            // Convierte el objeto en una cadena JSON
            const respuestaJSON = JSON.stringify(respuesta);

            // Establece el encabezado "Content-Type" y envía la respuesta JSON
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(respuestaJSON);
            return
        }
    } 
    else {
        console.log('peticion 3')
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Pagina no encontrada\n');
        return
    }  
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Simulador de Gestion de Permisos HTTP escuchando en el puerto ${PORT}`);
});


// no es necesario cors ya que el navegador no le pega al back

const cors = (res) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}