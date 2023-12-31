export const solicitarDatosVisitante = (id) => {
    return fetch(`http://localhost:3000/api/user/?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .catch(error => {
        JSON.stringify({ error: error })
    });
}

export const preguntarIdVisitante = () => {
    return fetch(`http://localhost:3000/api/lectortarjeta`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .catch(error => {
        JSON.stringify({ error: error })
    });
}
