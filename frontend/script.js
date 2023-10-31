const tecladoPisos = document.getElementById('tecladoPisos');
const tecladoNumerico = document.getElementById('tecladoNumerico');
const toggleButton = document.getElementById('aceptarBtn');

condicion = true

const cambiarPantalla = (condicion) =>{
    if (condicion) {
        tecladoPisos.style.display = 'none'; // Muestra el elemento
        tecladoNumerico.style.display = 'grid'; // Muestra el elemento
    } else {
        tecladoPisos.style.display = 'grid'; // Oculta el elemento
        tecladoNumerico.style.display = 'none'; // Oculta el elemento
    }
}

const mostrarDatosVisitante = () => { //falta pasar el JSON como parametro
    const datosJSON = {
        "id":"A001",
        "nombre":"Lautaro Nahuel Bruses",
        "edad":25,
        "email":"lautarobruses@gmail.com",
        "pisos_permitidos":[1,3], //por si puede entrar a mas de una habitacion
        "fecha_checkIn":"2023-09-13T23:09:40.880Z", //formato ISO string
        "fecha_checkOut":"2023-09-15T23:09:40.880Z"
    };
    
    const divPantalla = document.getElementById('pantalla');
    
    // Crear elementos HTML y asignar datos JSON
    const idVisitante = document.createElement('h2');
    idVisitante.textContent = '#' + datosJSON.id;
    idVisitante.className = 'textoSecundario';

    const nombreCompleto = document.createElement('h1');
    nombreCompleto.textContent = datosJSON.nombre.toUpperCase();
    nombreCompleto.className = 'textoPrincipal';

    const edad = document.createElement('h2');
    edad.textContent = datosJSON.edad + ' años';
    edad.className = 'textoSecundario';

    const email = document.createElement('h2');
    email.textContent = datosJSON.email;
    email.className = 'textoSecundario';

    // const fechaCheckIn = formatearFechaEnLenguajeNatural(datosJSON.fecha_checkIn)
    // const fechaCheckOut = formatearFechaEnLenguajeNatural(datosJSON?.fecha_checkOut)

    // Agregar elementos al contenedor
    divPantalla.appendChild(idVisitante);
    divPantalla.appendChild(nombreCompleto);
    divPantalla.appendChild(edad);
    divPantalla.appendChild(email);
    // divPantalla.appendChild(fechaCheckIn);
    
}

const formatearFechaEnLenguajeNatural = (fechaISO) => {
    const fecha= new Date(fechaISO);

    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${dia} de ${mes} de ${año}`;
}

toggleButton.addEventListener('click', function() {
    const idValue = "123"; // Establece el valor del id que deseas enviar

    fetch(`http://localhost:3000/api/user/?id=${idValue}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar la respuesta en el div con id 'responseDiv'
        const responseDiv = document.getElementById('responseDiv');
        responseDiv.textContent = 'Respuesta del servidor: ' + JSON.stringify(data);
        cambiarPantalla(!condicion)
    })
    .catch(error => {
        console.error('Error:', error);
    });

    mostrarDatosVisitante()
});