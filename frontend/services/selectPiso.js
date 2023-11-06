export const enviarPiso = (piso) => {
    const datos = {"piso": piso};

    return fetch(`http://localhost:3000/api/piso/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos),
        })
    .then(response => response.json())
    .catch(error => {
        JSON.stringify({ error: error })
    });
}