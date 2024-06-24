const parametro = new URLSearchParams(window.location.search)
const usuario = parametro.get('usuario')

if(usuario in sessionStorage === false){
    alert('Se requieren credenciales de ingreso')
    window.location = '/index.html'    
}

document.getElementById('usuarioreg').textContent = usuario

let btnsalir = document.getElementById('btnsalir')
btnsalir.addEventListener('click',cerrarSesion)

function cerrarSesion(){
    sessionStorage.removeItem(usuario)
    window.location.reload()
}