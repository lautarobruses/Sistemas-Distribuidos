document.addEventListener('DOMContentLoaded', function () {
    const enviarBtn = document.getElementById('enviarBtn');
    const respuestaDiv = document.getElementById('respuesta');

    enviarBtn.addEventListener('click', function () {
        // Datos que deseas enviar en la solicitud POST
        const datos = {
            id: '1234'
        };

        fetch(`http://localhost:3000/api/user/?id=${datos.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' // Ajusta los encabezados según sea necesario
            },
        })
        .then(response => response.json())
        .then(data => {
            // Maneja la respuesta de la solicitud aquí
            respuestaDiv.innerHTML = `Respuesta del servidor: ${JSON.stringify(data)}`;
        })
        .catch(error => {
            // Maneja cualquier error que ocurra durante la solicitud
            respuestaDiv.innerHTML = `Error: ${error.message}`;
        });
    });

    enviarBtn.addEventListener('click', function () {
        const datos = {"piso":piso};

        fetch(`http://localhost:3000/api/piso/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos),
            })
        .then(response => response.json())
        .then(data => {
            // Maneja la respuesta de la solicitud aquí
            respuestaDiv.innerHTML = `Respuesta del servidor: ${JSON.stringify(data)}`;
        })
        .catch(error => {
            // Maneja cualquier error que ocurra durante la solicitud
            respuestaDiv.innerHTML = `Error: ${error.message}`;
        });
    });
});
