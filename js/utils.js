var autos = [] //array de autos
var tbody = document.querySelector("#autos"); // Obtenemos la referencia al elemento <tbody>

//============================ OBETENER AUTOS ============================
async function getCars() {
    try {
        const data = await get('cars');
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let auto = data[key];
                autos.push(auto)
            }
        }
        crearTabla(autos);
    } catch (error) {
        console.error('Error:', error);
    }
}

//============================ INICIAR TABLA =================================
function crearTabla(autos) {
    eliminarContenidoTabla();

    autos.map(function (producto) {
        var fila = document.createElement("tr"); // Creamos una nueva fila de tabla

        var celdaFechaReg = document.createElement("td");
        celdaFechaReg.textContent = formatTimestap(producto.fechaReg);
        celdaFechaReg.className = "border-r";

        var celdaPatente = document.createElement("td"); // Creamos una celda para el nombre del producto
        celdaPatente.textContent = producto.patente; // Asignamos el valor del nombre del producto a la celda
        celdaPatente.className = "border-r";

        var celdaDuenio = document.createElement("td"); // Creamos una celda para el precio del producto
        celdaDuenio.textContent = producto.duenio; // Asignamos el valor del precio del producto a la celda
        celdaDuenio.className = "border-r";

        var celdaInvertido = document.createElement("td");
        var invertido = 0;
        producto.acta.forEach(trabajo => {
            invertido += (JSON.parse(trabajo.manoObraValor) + JSON.parse(trabajo.repuestosValor));
        })
        celdaInvertido.textContent = convertirFormatoMoneda(invertido);
        celdaInvertido.className = "border-r";

        var celdaAcciones = document.createElement("td");
        var botonEditar = document.createElement("button");
        botonEditar.textContent = "Ver";
        botonEditar.className = "btn btn-warning";
        botonEditar.id = producto.uuid + 'edit';
        botonEditar.onclick = function (param) {
            var param = producto.uuid;
            editarAuto(param);
        };

        var botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-danger margin-l";
        botonEliminar.id = producto.uuid + 'delete';
        botonEliminar.onclick = function (param) {
            var param = producto.uuid;
            eliminarAuto(param);
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
    var tabla = document.querySelector("#autos"); // Reemplaza "miTabla" con el ID de tu tabla

    var filas = tabla.querySelectorAll("tr") ? tabla.querySelectorAll("tr") : null;
    if (filas) {
        filas.forEach(function (fila) {
            fila.remove();
        });
    }

    var celdas = tabla.querySelectorAll("td") ? tabla.querySelectorAll("td") : null;
    if (celdas) {
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
    var acta = [{uuid: generateUUID() ,accion: "Sin modificaciones", manoObraValor: "0", repuestosValor: "0", fechaIngreso: new Date().getTime()}];
    var invertido = (JSON.parse(acta[0].manoObraValor) + JSON.parse(acta[0].repuestosValor)).toString();
    const datos = { patente, duenio, invertido, acta, fechaReg };

    if (!patente || !duenio || !invertido) {
        return alert('Ingresar todos los datos por favor.')
    }
    
    try {
        const response = await post('cars', datos);
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        } else {
            form.reset();
            getCars();
        }
    } catch (error) {
        console.error(error);
    }
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

async function eliminarAuto(auto) {
    await remove('cars', auto);
    await getCars();
    auto = document.getElementById(auto + 'delete');
};

//============================ BUSCAR PATENTES ============================
inputBusqueda = document.getElementById("search");
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
        celdaInvertido.textContent = convertirFormatoMoneda(resultado.invertido);

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
            eliminarAuto(param);
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

//formatear valores de numeros

async function get(endpoint) {
    try {
        autos = [];
        const response = await fetch(`http://localhost:3000/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        const data = await response?.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function post(endpoint, body) {
    try {
        const response = await fetch(`http://localhost:3000/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(body)
        });
        return response;
    } catch (error) {
        console.log('Error: ', error);
    }
}

async function remove(endpoint, id) {
    try {
        const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({})
        });
        if(!response.ok) {
            throw new Error('Error en la solicitud:', response.status)
        }
        return response;
    } catch (error) {
        console.log('Error: ', error);
    }
}

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

//============================ EJECUTAR FUNCIONES ============================


getCars();

