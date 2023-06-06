var autos = [] //array de autos
var tbody = document.querySelector("#autos"); // Obtenemos la referencia al elemento <tbody>

/* CREAR Y ELIMINAR TABLA */

function crearTabla(autos) {
    eliminarContenidoTabla();

    autos.map(function (producto) {
        var fila = document.createElement("tr"); // Creamos una nueva fila de tabla

        var celdaPatente = document.createElement("td"); // Creamos una celda para el nombre del producto
        celdaPatente.textContent = producto.patente; // Asignamos el valor del nombre del producto a la celda

        var celdaDuenio = document.createElement("td"); // Creamos una celda para el precio del producto
        celdaDuenio.textContent = producto.duenio; // Asignamos el valor del precio del producto a la celda

        var celdaInvertido = document.createElement("td");
        celdaInvertido.textContent = producto.invertido;


        fila.appendChild(celdaPatente); // Agregamos la celda de nombre a la fila
        fila.appendChild(celdaDuenio); // Agregamos la celda de precio a la fila
        fila.appendChild(celdaInvertido);

        tbody.appendChild(fila); // Agregamos la fila completa al cuerpo de la tabla
    });
}

function eliminarContenidoTabla() {
    var tabla = document.querySelector("#autos"); // Reemplaza "miTabla" con el ID de tu tabla

    var filas = tabla.querySelectorAll("tr") ? tabla.querySelectorAll("tr") : null;
    if(filas) {
        filas.forEach(function (fila) {
            fila.remove();
        });
    }

    var celdas = tabla.querySelectorAll("td") ? tabla.querySelectorAll("td") : null;
    if(celdas) {
        celdas.forEach(function (celda) {
            celda.remove();
        });
    }
}

/* LEER Y CARGAR AUTOS */

document.getElementById("load").addEventListener("click", leerArchivoJson);
var archivoInput = document.getElementById("archivoJson");
archivoInput.addEventListener("change", function(event) {
    var archivo = archivoInput.files[0];
    console.log(archivo);
    if (archivo) {
        var lector = new FileReader();

        lector.onload = function (evento) {
            if(evento.target.result === "") {
                alert("No hay nada cargado, agregá un auto");
            } 
            var contenido = evento.target.result;
            console.log(contenido);
            var datos = JSON.parse(contenido);
            autos = datos;

            crearTabla(autos);
        };

        lector.readAsText(archivo);
    }
})

async function leerArchivoJson() {
    archivoInput.click()
}

/* BUSCAR PATENTES */
inputBusqueda = document.getElementById("search");
inputBusqueda.addEventListener("input", function() {
    var terminoBusqueda = inputBusqueda.value.toLowerCase();
  
    // Filtrar los elementos del array que coincidan con el término de búsqueda
    var resultados = autos.filter(function(elemento) {
      return elemento.patente.toLowerCase().includes(terminoBusqueda);
    });
  
    // Mostrar los resultados de la búsqueda en una tabla
    mostrarResultados(resultados);
});

function mostrarResultados(resultados) {
    eliminarContenidoTabla()
    tbody.innerHTML = "";
  
    resultados.forEach(function(resultado) {
      var fila = document.createElement("tr");
  
      var celdaPatente = document.createElement("td");
      celdaPatente.textContent = resultado.patente;
  
      var celdaDuenio = document.createElement("td");
      celdaDuenio.textContent = resultado.duenio;
  
      var celdaInvertido = document.createElement("td");
      celdaInvertido.textContent = resultado.invertido;
  
      fila.appendChild(celdaPatente);
      fila.appendChild(celdaDuenio);
      fila.appendChild(celdaInvertido);
  
      tbody.appendChild(fila);
    });
  }

/* GUARDAR NUEVO JSON */

document.getElementById("save").addEventListener("click", descargarArchivoJSON);
function escribirArchivo() {
    console.log(autos);
}

function descargarArchivoJSON() {
    var contenidoJSON = autos

    nuevoAuto = {
        patente: "FEO226",
        duenio: "Alberto Fernandez",
        invertido: "$10.300,00"
    };
    contenidoJSON.push(nuevoAuto);
  
    var contenidoTexto = JSON.stringify(contenidoJSON);
    var blob = new Blob([contenidoTexto], { type: "application/json" });
  
    var enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = "autos.json";
    enlaceDescarga.click();
    archivoInput.value = "";
}
