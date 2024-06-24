console.clear()

const puerto = 3150;

const express = require('express')
const path = require('path');
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const mibdu = require('./public/db/usuarios.json');
const mibdp = require('./public/db/productos.json')
const { METHODS } = require('http');
const fs = require('fs')

app.use(express.static('public'))
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))//para cuando se procesan archivos mas complejos que un texto
app.use(cors())


// Endpoint para registrar un nuevo usuario
app.post('/app/usuarios', (req, res) => {
    const nuevoUsuario = req.body;
    mibdu.push(nuevoUsuario);

    let datosJson = JSON.stringify(mibdu, null, 2);

    try {
        fs.writeFileSync('./public/db/usuarios.json', datosJson);
        res.json({ message: 'Usuario registrado' });
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ error: 'Error al guardar los datos' });
    }
});

app.get('/app/productos', (req, res) => {
    const productos = mibdp
    if (!productos) return res.status(400)
    return res.send(productos)
})


// INICIO JSON WEB TOKEN

app.post('/app/login', verficaUsuario, (req, res) => {
    const credenciales = {
        nombreus: req.body.nombreus,
        contraus: req.body.contraus
    }
    jwt.sign({ usuario: credenciales }, 'cualquiercosa', { expiresIn: '45s' }, (err, token) => {
        // res.json(token)
        let nombreus = credenciales.nombreus
        const rutahtml = '/views/regproducto.html'
        res.json({ token, rutahtml, nombreus })
    })
    // console.log(credenciales);|
})

app.post('/app/restringido', verificatoken, (req, res) => {
    jwt.verify(req.token, 'cualquiercosa', (error, datos) => {
        if (error) {
            res.sendFile(path.join(__dirname, 'public/views', 'noautho.html'))
        } else {
            res.sendFile(path.join(__dirname, 'public/views', 'restringido.html'))
        }
    })
})

//middleware para validar el usuario y la contraseña
function verficaUsuario(req, res, next) {
    const credenciales = {
        nombreus: req.body.nombreus,
        contraus: req.body.contraus
    }
    if (!credenciales.nombreus && !credenciales.contraus) return res.sendStaus(400)
    let user = mibdu.find(user => user.username === credenciales.nombreus)
    if (!user) return res.send('Usuario no valido')
    if (user.password != credenciales.contraus) return res.send('Contraseña incorrecta')
    next()
}


function verificatoken(req, res, next) {
    const portadora = req.headers['authorization']
    if (portadora) {
        let tokenportadora = portadora.split(' ')[1]
        req.token = tokenportadora
        next()
    } else {
        res.status(403)
    }
}

// FIN JSON WEB TOKEN

// INICIO MULTER
//middelware para hacer uso de multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, destino) => {
        destino(null, 'public/img')
    },
    filename: (req, file, nombre) => {
        // let extension = file.mimetype.split('/')[1]
        nombre(null, `${file.originalname}`)
    }
})

const subirArchivo = multer({ storage: almacenamiento })

//endpoint para cargar la imagen

app.post('/app/productos', subirArchivo.single('imagenp'), (req, res, next) => {
    const idp = req.body.idp,
        nombrep = req.body.nombrep,
        descripcionp = req.body.descripcionp,
        preciop = req.body.preciop,
        cantidadp = req.body.cantidadp,
        imagenp = req.file

    const datos = {
        id:idp,
        nombre:nombrep,
        descripcion:descripcionp,
        precio:preciop,
        cantidad:cantidadp,
        imagen:imagenp.path


    }

    mibdp.push(datos)

    let datosJson = JSON.stringify(mibdp)

    try{
        fs.writeFileSync('./public/db/productos.json',datosJson)
    }catch{
        console.log('Error al cargar los datos')
    }

    res.send(mibdp)



    // res.sendFile(path.resolve(__dirname, `public/img/${archivo.filename}`))
})

// app.post('/archivo', subirArchivo.single('imagen'), (req, res, next) => {
//     const archivo = req.file
//     if (!archivo) {
//         res.send(400)
//         return next(error)
//     } else {
//         // res.send(archivo)
//         res.sendFile(path.resolve(__dirname, `public/img/${archivo.filename}`))
//     }
// })

//endpint para cargar las n imagenes
// app.post('/archivos', subirArchivo.array('imagenes', 3), (req, res, next) => {
//     const archivo = req.files
//     if (!archivo) {
//         res.send(400)
//         return next(error)
//     } else {
//         res.send(archivo)
//         // res.sendFile(path.resolve(__dirname, `public/img/${archivo.filename}`))
//     }
// })

// FIN MULTER


app.listen(puerto, () => {
    console.log(`servidor listo y escuchando en http://localhost:${puerto}`);
})