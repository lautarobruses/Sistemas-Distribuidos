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
    
    if (req.method === 'POST' && parsedUrl.pathname === `/api/selectorAscensor/`) {
        const piso = queryParams.piso; // Accede al parámetro de consulta "piso"
        if (piso) {

            console.log('recibe peticion 1')
           
            var respuesta;

            if (piso < '3') 
                respuesta = {"id":1};
            else
                if (piso >= '7')
                    respuesta = {"id":2};
                else
                respuesta = {"id":3};
               
            console.log ("Respuesta del GesAscensor "+respuesta);

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

const PORT = 4500;

app.listen(PORT, () => {
    console.log(`Simulador de Ascensor HTTP escuchando en el puerto ${PORT}`);
});


// no es necesario cors ya que el navegador no le pega al back

const cors = (res) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}