const tecladoPisos = document.getElementById('tecladoPisos');
const tecladoNumerico = document.getElementById('tecladoNumerico');
const toggleButton = document.getElementById('aceptarBtn');

condicion = true

toggleButton.addEventListener('click',() => {
    if (condicion) {
        tecladoPisos.style.display = 'none'; // Muestra el elemento
        tecladoNumerico.style.display = 'grid'; // Muestra el elemento
    } else {
        tecladoPisos.style.display = 'grid'; // Oculta el elemento
        tecladoNumerico.style.display = 'none'; // Oculta el elemento
    }
    condicion = !condicion
})

