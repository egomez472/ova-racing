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
        console.log(autos);
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

        var celdaPatente = document.createElement("td"); // Creamos una celda para el nombre del producto
        celdaPatente.textContent = producto.patente; // Asignamos el valor del nombre del producto a la celda

        var celdaDuenio = document.createElement("td"); // Creamos una celda para el precio del producto
        celdaDuenio.textContent = producto.duenio; // Asignamos el valor del precio del producto a la celda

        var celdaInvertido = document.createElement("td");
        celdaInvertido.textContent = convertirFormatoMoneda(producto.invertido);

        var celdaAcciones = document.createElement("td");
        var botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
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
    var invertido = form.elements.invertido.value;
    var acta = [{accion: "Sin modificaciones", manoObraValor: "0", repuestosValor: "0"}];
    const datos = { patente, duenio, invertido, acta };

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
    const response = await remove('cars', auto);
    if(response.ok) {
        getCars();
    }
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

        var celdaPatente = document.createElement("td"); // Creamos una celda para el nombre del producto
        celdaPatente.textContent = resultado.patente; // Asignamos el valor del nombre del producto a la celda

        var celdaDuenio = document.createElement("td"); // Creamos una celda para el precio del producto
        celdaDuenio.textContent = resultado.duenio; // Asignamos el valor del precio del producto a la celda

        var celdaInvertido = document.createElement("td");
        celdaInvertido.textContent = convertirFormatoMoneda(resultado.invertido);

        var celdaAcciones = document.createElement("td");
        var botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "btn btn-warning";
        botonEditar.id = resultado.patente + 'edit';
        botonEditar.onclick = function (param) {
            var param = resultado.patente;
            editarAuto(param);
        };

        var botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-danger margin-l";
        botonEliminar.id = resultado.patente + 'delete';
        botonEliminar.onclick = function (param) {
            var param = resultado.patente;
            eliminarAuto(param);
        };

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);



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
        const data = await response.json();
        console.log(data);
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
            }
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

//============================ EJECUTAR FUNCIONES ============================
getCars();

