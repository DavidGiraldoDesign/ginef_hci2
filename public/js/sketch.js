/*var info = {
    preferencias: [200, 200, 200, 200, 200, 200, 200],
    cercania: [200, 180, 170, 150, 130, 110, 90, 70, 50]
}*/
var metodos = [];

var canvas;
var runP5 = 0;
var display = ["none", "block"]
var fs = false;
//if (this.runP5 == true) {

var img = [];

function preload() {
    img[0] = loadImage("imgs/icono_pila.svg");
    img[1] = loadImage("imgs/icono_pastas.svg");
    img[2] = loadImage("imgs/icono_inyectable.svg");
    img[3] = loadImage("imgs/icono_anillo.svg");
    img[4] = loadImage("imgs/icono_parche.svg");
    img[5] = loadImage("imgs/icono_t.svg");
    img[6] = loadImage("imgs/icono_mujer.svg");
}

function windowResized() {
    resizeCanvas(windowWidth - 50, windowHeight - 50);
}

function setup() {
    pixelDensity(1);
    imageMode(CENTER);
    rectMode(CENTER);
    canvas = createCanvas(windowWidth - 100, windowHeight - 100);
    canvas.position(50, 50);
    canvas.style('z-index', '-1');
    canvas.style('display', display[runP5]);
    metodos = [];

    if (vista.metodos != null) {
        vista.metodos.forEach((m, index) => {
            metodos.push(new Metodo(img[index], m.nombre, m.aplicacion, m.control, m.visible, m.inyectable, m.ingerible, m.insercion, m.interrupcion, m.uso, m.costo));
        });

    } else {
        console.log(vista.metodos);
    };

}

function draw() {
    background(255, 252, 250);
    metodos.forEach((metodo, index) => {
        metodo.setIncremento(index * 0.99);
        metodo.mover(width / 2, height / 2);
        metodo.flotar();
        metodo.pintar();
    });
    image(img[6], width / 2, height / 2);
    noFill();
    stroke(245, 108, 141);
    ellipse(width / 2, height / 2, 350, 350);
    stroke(173, 194, 220);
    ellipse(width / 2, height / 2, 600, 600);
    stroke(173, 173, 173);
    ellipse(width / 2, height / 2, 700, 700);
}

function mousePressed() {
    //fullscreen(!fs);
}


function Metodo(img, n, a, c, v, y, g, s, t, uso, costo) {

    this.nombre = n;
    this.aplicacion = a;
    this.control = c;
    this.visible = v;
    this.inyectable = y;
    this.ingerible = g;
    this.insercion = s;
    this.interrupcion = t;
    this.uso = uso;
    this.costo = costo;

    this.diametro = 50;
    this.img = img;
    this.x = width / 2;
    this.y = height / 2;

    this.p = 4;
    this.pasos = 0;
    this.amp = [400, 360, 320, 280, 240, 200, 160, 120, 80];

    this.incremento = 2;

    this.fx = 0;
    this.fy = 0;
    this.famp = Math.floor(Math.random() * (6 - 5)) + 5;
    this.finc = 0;
    this.fs = Math.random() * (0.1);

    this.mover = function (width, height) {
        this.x = width + (cos(this.incremento) * this.amp[this.p]);
        this.y = height + (sin(this.incremento) * this.amp[this.p]);
    }

    this.setIncremento = function (incremento) {
        this.incremento = incremento;
    }

    this.setAmp = function (paso) {
        this.p = paso;

    }

    this.getAmpLength = function () {
        return this.amp.length;
    }

    this.flotar = function () {
        this.finc += this.fs;
        this.fx = cos(this.finc) * this.famp;
        this.fy = sin(this.finc) * this.famp;
    }

    this.pintar = function () {

        //rect(this.x, this.y, this.diametro, this.diametro);
        image(img, this.x, this.y, this.diametro, this.diametro);
        // image(img, this.x + this.fx, this.y + this.fy, this.diametro, this.diametro);
    }

}
