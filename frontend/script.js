const tecladoPisos = document.getElementById('tecladoPisos');
const tecladoNumerico = document.getElementById('tecladoNumerico');
const toggleButton = document.getElementById('aceptarBtn');

condicion = true

function cambiarPantalla(condicion){
    if (condicion) {
        tecladoPisos.style.display = 'none'; // Muestra el elemento
        tecladoNumerico.style.display = 'grid'; // Muestra el elemento
    } else {
        tecladoPisos.style.display = 'grid'; // Oculta el elemento
        tecladoNumerico.style.display = 'none'; // Oculta el elemento
    }
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
});