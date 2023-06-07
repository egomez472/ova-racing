var auto = JSON.parse(localStorage.getItem('editCar'));
var tbody = document.querySelector("#auto");

document.getElementById('patente').value = auto.patente;

function cargarDatos(auto) {
    var fila = document.createElement("tr"); // Creamos una nueva fila de tabla
    var valorTotal = 0;
    var valorRepuestosTotal = 0;
    var valorManoObraTotal = 0;
    var celdaTrabajo = document.createElement("td"); // Creamos una celda para el nombre del producto
    var celdaManoObra = document.createElement("td");
    var celdaRepuestos = document.createElement("td");
    auto.acta.forEach(element => {
        var trabajoInput = document.createElement("input");
        trabajoInput.className = "form-control mb-2";
        trabajoInput.value = element.accion; // Asignamos el valor del nombre del producto a la celda
        celdaTrabajo.appendChild(trabajoInput);

        var manoObraInput = document.createElement("input");
        manoObraInput.type = "number";
        manoObraInput.className = "form-control mb-2";
        manoObraInput.value = element.manoObraValor;
        celdaManoObra.appendChild(manoObraInput);

        var repuestosValorInput = document.createElement("input");
        repuestosValorInput.type= "number";
        repuestosValorInput.className = "form-control mb-2";
        repuestosValorInput.value = element.repuestosValor;
        celdaRepuestos.appendChild(repuestosValorInput);

        valorTotal += (JSON.parse(element.manoObraValor) + JSON.parse(element.repuestosValor));
        valorRepuestosTotal += JSON.parse(element.repuestosValor);
        valorManoObraTotal += JSON.parse(element.manoObraValor);
    });

    var totalRepuestosInput = document.getElementById("totalRepuestos");
    totalRepuestosInput.value = convertirFormatoMoneda(valorRepuestosTotal);

    var totalManoObraInput = document.getElementById("totalManoObra");
    totalManoObraInput.value = convertirFormatoMoneda(valorManoObraTotal);

    var inputInversion = document.getElementById("inversionTotal");
    inputInversion.value = convertirFormatoMoneda(valorTotal);


    fila.appendChild(celdaTrabajo); // Agregamos la celda de nombre a la fila
    fila.appendChild(celdaManoObra);
    fila.appendChild(celdaRepuestos);

    tbody.appendChild(fila); // Agregamos la fila completa al cuerpo de la tabla
};


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

cargarDatos(auto)