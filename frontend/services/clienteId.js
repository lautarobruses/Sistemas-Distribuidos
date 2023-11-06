export const solicitarDatosVisitante = (id) => {
    return fetch(`http://localhost:3000/api/user/?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' // Ajusta los encabezados según sea necesario
        },
    })
    .then(response => response.json())
    .catch(error => {
        JSON.stringify({ error: error })
    });
}