const estados = {
    INICIO: 'Inicio',
    PISOS: 'Pisos',
    FINAL: 'Final',
};

const tecladoPisos = document.getElementById('tecladoPisos');
const tecladoNumerico = document.getElementById('tecladoNumerico');
const toggleButton = document.getElementById('aceptarBtn');
const btnPisos = document.querySelectorAll('.pisoBtn');
const btnNumeros = document.querySelectorAll('.numBtn');
const divPantallaInicio = document.getElementById('pantallaInicio');
const divPantalla = document.getElementById('pantalla');
const divPantallaAscensor = document.getElementById('pantallaAscensor');

let display = document.getElementById('display');

let estadoActual = estados.INICIO;

//================================ FUNCIONES ===========================================
const cambiarEstado = (nuevoEstado) => {
    estadoActual = nuevoEstado;
    cambiarTeclado()
    cambiarPantalla()
    switch (estadoActual) {
        case "Inicio":
            activarBtnAceptar(true)
            break;
        case "Pisos":
            activarBtnAceptar(false)
            const pisosHabilitados = [1, 3, 6, 8, 11, 12];
            habilitarPisos(pisosHabilitados)
            break;
        case "Final":
            activarBtnAceptar(false)
            habilitarPisos([])
            break;
    }
}

const cambiarTeclado = () => {
    switch (estadoActual) {
        case "Inicio":
            tecladoPisos.style.display = 'none'
            tecladoNumerico.style.display = 'grid'
            break;
        default:
            tecladoPisos.style.display = 'grid'
            tecladoNumerico.style.display = 'none'
    }
}

const cambiarPantalla = () => {
    switch (estadoActual) {
        case "Inicio":
            while (divPantallaAscensor.firstChild) {
                divPantallaAscensor.removeChild(divPantallaAscensor.firstChild); // Elimina el primer hijo hasta que no queden más
            }
            display.value = ""
            divPantallaInicio.style.display = "flex"
            break;
        case "Pisos":
            divPantallaInicio.style.display = "none"
            mostrarDatosVisitante()
            break;
        case "Final":
            while (divPantalla.firstChild) {
                divPantalla.removeChild(divPantalla.firstChild); // Elimina el primer hijo hasta que no queden más
            }
            mostrarAscensor("A")
            break;
    }
}

const activarBtnAceptar = (activo) => {
    if (activo) {
        toggleButton.classList.remove('not-available');
        toggleButton.classList.add('available');
    } else {
        toggleButton.classList.remove('available');
        toggleButton.classList.add('not-available');
    }
}

const limpiarBtnPisos = () => {
    btnPisos.forEach(btn => {
        btn.classList.remove('selected')
        btn.classList.remove('available')
        btn.classList.remove('not-available')
    });
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

const agregarNumero = (numero) => {
    display.value += numero;
}

const borrarNumero = () => {
    display.value = display.value.slice(0, -1);
}

const habilitarPisos = (pisosHabilitados) => {
    limpiarBtnPisos()

    btnPisos.forEach(boton => {
        const numeroPiso = parseInt(boton.id);
        
        if (pisosHabilitados.includes(numeroPiso)) {
            boton.disabled = false; // Habilitar el botón si el piso está en el array
            boton.classList.add('available');
        } else {
            boton.disabled = true; // Deshabilitar el botón si el piso no está en el array
            boton.classList.add('not-available');

        }
    });
}

const mostrarAscensor = (nroAscensor) => { //falta pasar el JSON como parametro
    const texto = document.createElement('h2');
    texto.textContent = 'Ascensor';
    texto.className = 'textoSecundario';
    texto.id = 'ascensor';

    const ascensor = document.createElement('h1');
    ascensor.textContent = nroAscensor.toUpperCase();
    ascensor.className = 'textoPrincipal';
    ascensor.id = 'nroAscensor';

    divPantallaAscensor.appendChild(texto);
    divPantallaAscensor.appendChild(ascensor);
}

//================================ LISTENERS ===========================================
btnPisos.forEach(boton => {
    boton.addEventListener('click', () => {
        // Deseleccionar todos los botones
        btnPisos.forEach(b => b.classList.remove('selected'));
        
        // Seleccionar el botón actual
        boton.classList.add('selected');

        activarBtnAceptar(true)
    });
});

btnNumeros.forEach(boton => {
    boton.addEventListener('click', () => {
        switch (boton.id) {
            case "del":
                borrarNumero();
                break;
            case "btn0":
                agregarNumero("0");
                break;
            default:
                agregarNumero(boton.id)
        }
    });
});

toggleButton.addEventListener('click', function() {
    switch (estadoActual) {
        case "Inicio":
            const ID = display.value
            console.log(ID);

            //ENVIAR ID

            //RECIBO PERMISOS 
            //RECIBO INFO

            //CASO EXITO
            cambiarEstado(estados.PISOS);
        
            //CASO ERROR

            break;
        case "Pisos":
            const botonSeleccionado = document.querySelector('.pisoBtn.selected ');

            const pisoSeleccionado = botonSeleccionado.textContent;
            console.log(pisoSeleccionado)

            //ENVIAR PISO SELECCIONADO
            //OBTENGO NUMERO ASCENSOR
        
            //CASO EXITO
            cambiarEstado(estados.FINAL)

            setTimeout(() => {
                cambiarEstado(estados.INICIO)
            }, 3000)

            //CASO ERROR

            break;
    }

    // const idValue = "123"; // Establece el valor del id que deseas enviar

    // fetch(`http://localhost:3000/api/user/?id=${idValue}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // Mostrar la respuesta en el div con id 'responseDiv'
    //     const responseDiv = document.getElementById('responseDiv');
    //     responseDiv.textContent = 'Respuesta del servidor: ' + JSON.stringify(data);
    //     cambiarPantalla(!condicion)
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
});





