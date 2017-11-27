const express = require('express'),
    bodyParser = require("body-parser"),
    mongo = require("mongodb"),
    fileUpload = require("express-fileupload"),
    ObjectID = require("mongodb").ObjectID;
//==============================================================================
const app = express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//==============================================================================
var url = '<YOUR MONGODB CLUSTER>';

var mongoClient = mongo.MongoClient;

var db = null // global variable to hold the database

mongoClient.connect(url, (err, database) => {
    if (!err) {
        console.log("Database connected!");
        db = database;
    }

    /*var metodos = [
        {   nombre: "Implante subdémico",
            aplicacion: false,
            control: true,
            visible: false,
            inyectable: true,
            ingerible: false,
            insercion: false,
            interrupcion: false,
            uso: 2,
            costo: 200500

    }, {    nombre: "Píldoras anticonceptivas",
            aplicacion: true,
            control: false,
            visible: false,
            inyectable: false,
            ingerible: true,
            insercion: false,
            interrupcion: true,
            uso: 0,
            costo: 60000

    }, {    nombre: "Inyectables (Mensual o Trimestral)",
            aplicacion: false,
            control: false,
            visible: false,
            inyectable: true,
            ingerible: false,
            insercion: false,
            interrupcion: true,
            uso: 1,
            costo: 35500

    }, {    nombre: "Anillo vaginal",
            aplicacion: true,
            control: false,
            visible: false,
            inyectable: true,
            ingerible: false,
            insercion: true,
            interrupcion: true,
            uso: 1,
            costo: 66000

    }, {    nombre: "Parche",
            aplicacion: true,
            control: false,
            visible: true,
            inyectable: false,
            ingerible: false,
            insercion: false,
            interrupcion: true,
            uso: 1,
            costo: 100000

    }, {    nombre: "Dispositivo intrauterino",
            aplicacion: false,
            control: true,
            visible: false,
            inyectable: false,
            ingerible: false,
            insercion: true,
            interrupcion: false,
            uso: 2,
            costo: 650000
    }
];

    db.collection("metodos").insertMany(metodos, function (err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        console.log(res);
        db.close();
    }); 
    
    db.collection("usuarios").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });

    db.collection("metodos").deleteMany({}, function (err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " document(s) deleted");
        db.close();
    });*/



});

//============================================================================

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");

});

app.post('/registro', (req, res) => {

    var targetUser = {
        email: req.body.email
    };

    db.collection("usuarios").find(targetUser).toArray((err, coincidencias) => {
        if (!err && coincidencias.length == 0) {

            var nuevoUsuario = {
                nombre: req.body.nombre,
                edad: req.body.edad,
                email: req.body.email,
                psw: req.body.psw,
                conPareja: false,
                aplicacion: null,
                control: null,
                visibible: null,
                inyectable: null,
                ingerible: null,
                insercion: null,
                interrupcion: null,
                uso: null,
                costo: null,
                pareja: {
                    nombre: "",
                    irControl: null,
                    inyectable: null,
                    insercion: null,
                    uso: null,
                    costo: null
                }
            }

            db.collection("usuarios").insertOne(nuevoUsuario, (error, result) => {
                if (error) throw error;

                db.collection("metodos").find({}).toArray((er, mets) => {
                    if (er) throw er;
                    res.json({
                        mensaje: "in",
                        usuario: nuevoUsuario,
                        metodos: mets

                    });
                });
            });


        } else {
            res.json({
                mensaje: "out"
            });
        }
    });

});

app.post('/ingreso', (req, res) => {

    var targetUser = {
        email: req.body.email,
        psw: req.body.psw
    };
    console.log(targetUser);
    var noIncluir = {
        psw: false
    }

    db.collection("usuarios").find(targetUser, noIncluir).toArray((err, coincidencias) => {
        if (err) throw err;
        if (coincidencias.length > 0) {

            db.collection("metodos").find({}).toArray((error, mets) => {
                if (error) throw error;

                res.json({
                    mensaje: 'in',
                    usuario: coincidencias[0],
                    metodos: mets
                });

            });


        } else {
            res.json({
                mensaje: 'usuario o contraseña incorrecto'
            });
        }
    });
});

app.post('/confirmaPareja', (req, res) => {

    var targetUser = {
        email: req.body.email
    };

    var values = {
        $set: {
            conPareja: true,
            "pareja.nombre": req.body.nombre
        }
    };

    db.collection("usuarios").update(targetUser, values, (err, result) => {
        if (err) throw err;

        var noIncluir = {
            psw: false
        };

        db.collection("usuarios").find(targetUser, noIncluir).toArray((error, coincidencias) => {
            if (error) throw error;
            console.log(coincidencias[0]);
            res.json({
                mensaje: ':v',
                usuario: coincidencias[0]
            });

        });


    });


});

app.post('/eliminarPareja', (req, res) => {

    var targetUser = {
        email: req.body.email
    };

    var values = {
        $set: {
            conPareja: false,
            "pareja.nombre": ""
        }
    };

    db.collection("usuarios").update(targetUser, values, (err, result) => {
        if (err) throw err;

        var noIncluir = {
            psw: false
        };

        db.collection("usuarios").find(targetUser, noIncluir).toArray((error, coincidencias) => {
            if (error) throw error;
            console.log(coincidencias[0]);
            res.json({
                mensaje: ':v',
                usuario: coincidencias[0]
            });

        });


    });


});

app.use("/public", express.static("public"));
app.use("/js", express.static('public/js'));
app.use("/libs", express.static('public/libs'));
app.use("/imgs", express.static('public/imgs'));
app.use("/css", express.static('public/css'));

app.listen(process.env.PORT || 8081);
