import { enviarPiso } from './services/selectPiso.js';
import { solicitarDatosVisitante } from './services/clienteId.js';

const estados = {
    INICIO: 'Inicio',
    PISOS: 'Pisos',
    FINAL: 'Final',
    ERROR: 'Error'
};

const TIEMPO_ESPERA = 5000

const tecladoPisos = document.getElementById('tecladoPisos');
const tecladoNumerico = document.getElementById('tecladoNumerico');
const toggleButton = document.getElementById('aceptarBtn');
const btnPisos = document.querySelectorAll('.pisoBtn');
const btnNumeros = document.querySelectorAll('.numBtn');
const divPantallaInicio = document.getElementById('pantallaInicio');
const divPantalla = document.getElementById('pantalla');
const divPantallaAscensor = document.getElementById('pantallaAscensor');
const divPantallaError = document.getElementById('pantallaError');

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
        default:
            activarBtnAceptar(false)
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
            break;
        case "Final":
            while (divPantalla.firstChild) {
                divPantalla.removeChild(divPantalla.firstChild); // Elimina el primer hijo hasta que no queden más
            }
            break;
        default:
            //Limpio todas las pantallas
            while (divPantallaAscensor.firstChild) {
                divPantallaAscensor.removeChild(divPantallaAscensor.firstChild);
            }
            display.value = ""
            divPantallaInicio.style.display = "flex"

            divPantallaInicio.style.display = "none"

            while (divPantalla.firstChild) {
                divPantalla.removeChild(divPantalla.firstChild);
            }
            //Muestro la pantalla ERROR
            divPantallaError.style.display = "flex"

            setTimeout(() => {
                divPantallaError.style.display = "none"
                divPantallaError.removeChild(divPantallaError.lastChild);
            }, TIEMPO_ESPERA)
    }
}

const activarBtnAceptar = (activo) => {
    if (activo) {
        toggleButton.classList.remove('not-available');
        toggleButton.classList.add('available');
        toggleButton.disabled = false;
    } else {
        toggleButton.classList.remove('available');
        toggleButton.classList.add('not-available');
        toggleButton.disabled = true;
    }
}

const limpiarBtnPisos = () => {
    btnPisos.forEach(btn => {
        btn.classList.remove('selected')
        btn.classList.remove('available')
        btn.classList.remove('not-available')
    });
}

const mostrarDatosVisitante = (datosVisitante) => {
    const idVisitante = document.createElement('h2');
    idVisitante.textContent = '#' + datosVisitante.id;
    idVisitante.className = 'textoSecundario';

    const nombreCompleto = document.createElement('h1');
    nombreCompleto.textContent = datosVisitante.nombre.toUpperCase();
    nombreCompleto.className = 'textoPrincipal';

    const edad = document.createElement('h2');
    edad.textContent = datosVisitante.edad + ' años';
    edad.className = 'textoSecundario';

    const email = document.createElement('h2');
    email.textContent = datosVisitante.email;
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

const mostrarAscensor = (nroAscensor) => {
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

const mostrarMensajeError = (mensaje) => {
    const mensajeError = document.createElement('h2');
    mensajeError.textContent = mensaje;
    mensajeError.className = 'textoSecundario';
    mensajeError.id = 'mensajeError';

    divPantallaError.appendChild(mensajeError);
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

toggleButton.addEventListener('click', async function() {
    switch (estadoActual) {
        case "Inicio":
            const ID = display.value
    
            const responseID = await solicitarDatosVisitante(ID)
            if (responseID && !responseID.error) {
                const pisosHabilitados = responseID.pisos
                const infoVisitante = responseID.informacion
    
                //CASO EXITO
                cambiarEstado(estados.PISOS);
                mostrarDatosVisitante(infoVisitante)
                habilitarPisos(pisosHabilitados)
            } else {
                //CASO ERROR
                cambiarEstado(estados.ERROR)
                mostrarMensajeError(responseID.error)
                habilitarPisos([])
                setTimeout(() => {
                    cambiarEstado(estados.INICIO)
                }, TIEMPO_ESPERA)
            }
            break;
        case "Pisos":
            const botonSeleccionado = document.querySelector('.pisoBtn.selected ');

            const pisoSeleccionado = botonSeleccionado.textContent.match(/\d+/)[0];

            const responsePiso = await enviarPiso(pisoSeleccionado)

            if (responsePiso && !responsePiso.error) {
                const nombreAscensor = responsePiso.nombre
        
                //CASO EXITO
                cambiarEstado(estados.FINAL)
                mostrarAscensor(nombreAscensor)
                habilitarPisos([])
    
                setTimeout(() => {
                    cambiarEstado(estados.INICIO)
                }, TIEMPO_ESPERA)
            } else {
                //CASO ERROR
                cambiarEstado(estados.ERROR)
                mostrarMensajeError(responsePiso.error)
                habilitarPisos([])
                setTimeout(() => {
                    cambiarEstado(estados.INICIO)
                }, TIEMPO_ESPERA)
            }
            break;
    }
});
