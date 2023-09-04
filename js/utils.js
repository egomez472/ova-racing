const firebaseConfig = {
    apiKey: "AIzaSyDBhVEGhhdfyawnhcK18W8nqp_vcFMy-hw",
    authDomain: "ova-racing-db-7ec41.firebaseapp.com",
    databaseURL: "https://ova-racing-db-7ec41-default-rtdb.firebaseio.com",
    projectId: "ova-racing-db-7ec41",
    storageBucket: "ova-racing-db-7ec41.appspot.com",
    messagingSenderId: "651686116545",
    appId: "1:651686116545:web:7edb103d6a0cf1dd67e840"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const carsRef = database.ref('/carsTest');

var autos = [] //array de autos
var tbody = document.querySelector("#autos"); // Obtenemos la referencia al elemento <tbody>

//============================ OBETENER AUTOS ============================
function getCars() {
    autos = [];
    carsRef.once('value', (snapshot) => {
        const data = snapshot.val();
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let auto = data[key];
                autos.push(auto)
            }
        }
        let sorted = ordenarArregloPorPropiedad(autos, "fechaReg");
        crearTabla(sorted);
    }, (error) => {
        console.log('Error al obtener los datos:', error);
    });
}

function ordenarArregloPorPropiedad(arr, propiedad) {
    return arr.sort((a, b) => b[propiedad] - a[propiedad]);
}

function deleteCarById(id) {
    database.ref(`/carsTest/${id}`).remove();
    getCars();
}

//============================ INICIAR TABLA =================================
function crearTabla(autos) {
    eliminarContenidoTabla();
    evaluarTabla()

    autos.map(function (producto) {
        var fila = newElement("tr"); // Creamos una nueva fila de tabla

        var celdaFechaReg = newElement("td");
        celdaFechaReg.textContent = formatTimestap(producto.fechaReg);
        celdaFechaReg.className = "border-r";

        var celdaPatente = newElement("td"); // Creamos una celda para el nombre del producto
        celdaPatente.textContent = producto.patente; // Asignamos el valor del nombre del producto a la celda
        celdaPatente.className = "border-r";

        var celdaDuenio = newElement("td"); // Creamos una celda para el precio del producto
        celdaDuenio.textContent = producto.duenio; // Asignamos el valor del precio del producto a la celda
        celdaDuenio.className = "border-r";

        var celdaInvertido = newElement("td");
        var invertido = 0;
        producto.acta.forEach(trabajo => {
            if(trabajo.isEmpty) {
                invertido = 0
            } else if(trabajo.manoObraValor === ''){
                invertido = 0
            } else {
                invertido += (JSON.parse(trabajo.manoObraValor) + JSON.parse(trabajo.repuestosValor));
            }
        })
        celdaInvertido.textContent = convertirFormatoMoneda(invertido);
        celdaInvertido.className = "border-r";

        var celdaAcciones = newElement("td");
        var botonEditar = newElement("button");
        botonEditar.textContent = "Ver";
        botonEditar.className = "btn btn-warning";
        botonEditar.id = producto.uuid + 'edit';
        botonEditar.onclick = function (param) {
            var param = producto.uuid;
            editarAuto(param);
        };

        var botonEliminar = newElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-danger margin-l";
        botonEliminar.id = producto.uuid + 'delete';
        botonEliminar.onclick = function (param) {
            var param = producto.uuid;
            deleteCarById(param);
        };

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);


        fila.appendChild(celdaFechaReg);
        fila.appendChild(celdaPatente); // Agregamos la celda de nombre a la fila
        fila.appendChild(celdaDuenio); // Agregamos la celda de precio a la fila
        fila.appendChild(celdaInvertido);
        fila.appendChild(celdaAcciones);

        tbody.appendChild(fila); // Agregamos la fila completa al cuerpo de la tabla
    });
};

function eliminarContenidoTabla() {
    var tabla = document.querySelector("#autos");

    var filas = tabla.querySelectorAll("tr") ? tabla.querySelectorAll("tr") : null;
    if (filas.length !== 0) {
        filas.forEach(function (fila) {
            fila.remove();
        });
    }

    var celdas = tabla.querySelectorAll("td") ? tabla.querySelectorAll("td") : null;
    if (celdas.length !== 0) {
        celdas.forEach(function (celda) {
            celda.remove();
        });
    }
};

//============================ ACCIONES ============================
async function saveCars() {
    var form = document.getElementById("auto-form");
    var patente = form.elements.patente.value;
    var duenio = form.elements.duenio.value;
    var fechaReg = new Date().getTime();
    var acta = [{isEmpty: true}];
    var invertido = "0";
    const datos = { patente, duenio, invertido, acta, fechaReg };

    if (!patente || !duenio || !invertido) {
        return alert('Ingresar todos los datos por favor.')
    }
    const newcar = await carsRef.push(datos)
    
    await newcar.set({
        uuid: newcar._delegate._path.pieces_[1],
        acta: datos.acta,
        patente: datos.patente,
        duenio: datos.duenio,
        fechaReg: datos.fechaReg
    });
    form.reset();
    getCars();
}

function editarAuto(auto) {
    autoFound = autos.find(c => c.uuid === auto);
    localStorage.setItem('editCar', JSON.stringify(autoFound))
    auto = document.getElementById(auto + 'edit');
    var a = document.createElement("a")
    a.href = "editar.html"
    auto.appendChild(a)
    a.click();
};

//============================ BUSCAR PATENTES ============================
var inputBusqueda = document.getElementById("search");
inputBusqueda.addEventListener("input", function () {
    var terminoBusqueda = inputBusqueda.value.toLowerCase();

    // Filtrar los elementos del array que coincidan con el término de búsqueda
    var resultados = autos.filter(function (elemento) {
        return elemento.patente.toLowerCase().includes(terminoBusqueda);
    });

    // Mostrar los resultados de la búsqueda en una tabla
    mostrarResultados(resultados);
});

function mostrarResultados(resultados) {
    eliminarContenidoTabla()
    tbody.innerHTML = "";

    resultados.forEach(function (resultado) {
       var fila = document.createElement("tr"); // Creamos una nueva fila de tabla

        var celdaFechaReg = document.createElement("td");
        celdaFechaReg.textContent = formatTimestap(resultado.fechaReg);
        celdaFechaReg.className = "border-r";

        var celdaPatente = document.createElement("td"); // Creamos una celda para el nombre del producto
        celdaPatente.textContent = resultado.patente; // Asignamos el valor del nombre del producto a la celda

        var celdaDuenio = document.createElement("td"); // Creamos una celda para el precio del producto
        celdaDuenio.textContent = resultado.duenio; // Asignamos el valor del precio del producto a la celda

        var celdaInvertido = document.createElement("td");
        var invertido = 0;
        resultado.acta.forEach(trabajo => {
            if(trabajo.isEmpty) {
                invertido = 0
            } else {
                invertido += (JSON.parse(trabajo.manoObraValor) + JSON.parse(trabajo.repuestosValor));
            }
        })
        celdaInvertido.textContent = convertirFormatoMoneda(invertido);
        celdaInvertido.className = "border-r";

        var celdaAcciones = document.createElement("td");
        var botonEditar = document.createElement("button");
        botonEditar.textContent = "Ver";
        botonEditar.className = "btn btn-warning";
        botonEditar.id = resultado.uuid + 'edit';
        botonEditar.onclick = function (param) {
            var param = resultado.uuid;
            editarAuto(param);
        };

        var botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-danger margin-l";
        botonEliminar.id = resultado.uuid + 'delete';
        botonEliminar.onclick = function (param) {
            var param = resultado.uuid;
            deleteCarById(param);
        };
        
        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);


        fila.appendChild(celdaFechaReg);
        fila.appendChild(celdaPatente); // Agregamos la celda de nombre a la fila
        fila.appendChild(celdaDuenio); // Agregamos la celda de precio a la fila
        fila.appendChild(celdaInvertido);
        fila.appendChild(celdaAcciones);

        tbody.appendChild(fila); // Agregamos la fila completa al cuerpo de la tabla
    });
};

//============================ UTILS ============================

function convertirFormatoMoneda(numero) {
    // Convertir el string a número
    let numeroParseado = parseFloat(numero);

    // Validar si el número es válido
    if (isNaN(numeroParseado)) {
        return "Invalid number";
    }

    // Formatear el número utilizando el método toLocaleString()
    let numeroFormateado = numeroParseado.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });

    // Retornar el número formateado
    return numeroFormateado;
};

function formatTimestap(tmp) {
    const timestamp = tmp;
    const fecha = new Date(timestamp);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses van de 0 a 11, por lo que se suma 1
    const anio = fecha.getFullYear() % 100; // Obtiene los últimos dos dígitos del año
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();

    // Formatea la fecha como dd/mm/aa hh:mm
    const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio.toString().padStart(2, '0')} ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

    return fechaFormateada;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function evaluarTabla() {
    if(autos.length === 0 && !getElement("aviso-table")) {
        var table = getElement("table-cars");
        var aviso = newElement("span");
        aviso.id = "aviso-table"
        aviso.textContent = "Ningun cliente registrado...";
        table.appendChild(aviso);
    } else if (autos.length !== 0 && getElement("aviso-table")) {
        getElement("aviso-table").remove();
    }
}

function getElement(id) {
    return document.getElementById(id);
}

function newElement(element) {
    return document.createElement(element);
}

//============================ EJECUTAR FUNCIONES ============================
getCars();

var zoomState = localStorage.getItem('zoom-state') ? JSON.parse(localStorage.getItem('zoom-state')) : 0.8;
function zoom(param, inOut) {
    zoomState = inOut === '+' ? zoomState + param : zoomState - param;
    var zoomLevel = zoomState; // Nivel de zoom deseado
    var scale = zoomLevel / window.devicePixelRatio;
    localStorage.setItem('zoom-state', JSON.stringify(scale))
    document.body.style.zoom = scale;
}

function loadZoomState(zoom) {
    document.body.style.zoom = zoom;
}  
loadZoomState(zoomState);
  



