pedirId()

document.getElementById('registrarse').addEventListener('click', (e) => {
    e.preventDefault();
    postDatos();
});

function pedirId() {
    let url = '../db/usuarios.json'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            const longitud = datos.length;
            const ultimo = datos[longitud - 1];
            const ultimoId = parseInt(ultimo.id) + 1;
            let id = document.getElementById("idu");
            id.value = ultimoId;
            id.readOnly = true;
        })
        .catch(error => console.error('Error al pedir el ID:', error));
}


async function postDatos() {
    const formulario = document.getElementById('enviardatos');
    let datos = new FormData(formulario);

    const nuevoUsuario = {
        id: document.getElementById('idu').value,
        name: datos.get('name'),
        username: datos.get('nombreus'),
        password: datos.get('contraus'),
        email: datos.get('email'),
        phone: datos.get('phone')
    };

    const opciones = {
        method: 'POST',
        body: JSON.stringify(nuevoUsuario),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        let peticion = await fetch('/app/usuarios', opciones);
        if (!peticion.ok) {
            throw new Error('Hubo un problema al realizar la petición');
        }
        let valores = await peticion.json();
        alert('Usuario registrado');
        document.getElementById('enviardatos').reset();
        pedirId();
    } catch (error) {
        console.error('Error en la petición:', error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    pedirId();
});