pedirId()

document.getElementById('registrarp').addEventListener('click',(e)=>{
    e.preventDefault()
    postDatos()
})

function pedirId() {
    let url = '/app/productos'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos =>{
            const longitud = datos.length
            const ultimo = datos[longitud-1]
            const ultimoId = parseInt(ultimo.id)+1
            let id = document.getElementById("idp")
            id.value = ultimoId
            id.readOnly = true 
        })
}

async function postDatos(){
    const formulario = document.getElementById('enviardatos')
    let datos = new FormData(formulario)

    let url = '/app/productos'

    const cont = {
        method: 'POST',
        body: datos
    }

    try{
        let peticion = await fetch(url, cont)
        if(!peticion.ok){
            throw new Error('Hubo un problema a realizar la peticion')
        }let = valore = peticion.json()
        alert('Producto registrado')
        document.getElementById('enviardatos').reset()
        pedirId()
    }catch{
        console.log('Error en la peticion')
    }
}