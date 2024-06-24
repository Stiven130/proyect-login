traerProducto()

function traerProducto() {
    let url = '/app/productos'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            let datosJson = datos
            console.log(datosJson)
            let rutaimg = datosJson[1].imagen
            let ruta = rutaimg.slice(6)
            let imgp = document.getElementById('imgp')
            imgp.src = ruta
            let nombrep = document.getElementById('nombrep')
            nombrep.textContent = datosJson[0].nombre
            let descripcionp = document.getElementById('descripcionp')
            descripcionp.textContent = datosJson[0].descripcion
            let preciop = document.getElementById('preciop')
            preciop.textContent = datosJson[0].precio
            let cantidadp = document.getElementById('cantidadp')
            cantidadp.textContent = datosJson[0].cantidad
        })

}