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

var auto = JSON.parse(localStorage.getItem('editCar'));
var tbody = document.querySelector("#auto");

document.getElementById('patente').textContent = auto.patente;
document.getElementById('cliente').textContent = auto.duenio;

function guardarCambios(_auto, acta) {
  localStorage.setItem('acta-uuid', acta.uuid)
  let doc = document.getElementById(acta.uuid);
  let fechaIngreso = doc.querySelectorAll("td")[0].firstChild.textContent;
  if (fechaIngreso === '- / - / - -:-') {
    fechaIngreso = new Date().getTime();
  } else {
    fechaIngreso = formatStrToTimestap(fechaIngreso)
  }
  let accion = doc.querySelectorAll("td")[2].firstChild.value.toString();
  let manoObraValor = doc.querySelectorAll("td")[3].firstChild.value.toString();
  let repuestosValor = doc.querySelectorAll("td")[4].firstChild.value.toString();
  const taskUpdated = {
    accion,
    fechaIngreso,
    manoObraValor,
    repuestosValor,
    uuid: acta.uuid,
  };

  let trabajoKeep = _auto.acta.filter(el => el.uuid !== acta.uuid);
  let autoUpdated = _auto;
  autoUpdated.acta = trabajoKeep
  autoUpdated.acta.push(taskUpdated)

  const request = autoUpdated;

  updateCarById(auto.uuid, request);
  localStorage.setItem('editCar', JSON.stringify(request));
}

function cargarDatos(auto) {
  var valorTotal = 0;
  var valorRepuestosTotal = 0;
  var valorManoObraTotal = 0;
  auto.acta.forEach(element => {
    if(element.isEmpty) {
      var span_ = document.createElement("span");
      span_.textContent = "Ningun trabajo ingresado...";
      span_.id = "warn-task"
      tbody.appendChild(span_)
    } else {
      if(document.getElementById("warn-task")) {
        document.getElementById("warn-task").remove();
      }
      var fila = document.createElement("tr");
      var celdaIngreso = document.createElement("td");
      var celdaTrabajo = document.createElement("td");
      var celdaManoObra = document.createElement("td");
      var celdaRepuestos = document.createElement("td");
      var celdaAcciones = document.createElement("td");
      var trabajoInput = document.createElement("input");
      trabajoInput.className = "form-control mb-2";
      trabajoInput.value = element.accion;
      celdaTrabajo.appendChild(trabajoInput);
      
      let manoObra = element.manoObraValor == "" ? "0" : element.manoObraValor;
      let repuestos = element.repuestosValor == "" ? "0" : element.repuestosValor;

      var manoObraInput = document.createElement("input");
      manoObraInput.type = "text";
      manoObraInput.className = "form-control mb-2";
      manoObraInput.value = manoObra;
      celdaManoObra.appendChild(manoObraInput);
  
      var repuestosValorInput = document.createElement("input");
      repuestosValorInput.type = "number";
      repuestosValorInput.className = "form-control mb-2";
      repuestosValorInput.value = repuestos;
      celdaRepuestos.appendChild(repuestosValorInput);
      
      valorTotal += (JSON.parse(manoObra == "" ? "0" : manoObra) + JSON.parse(repuestos == "" ? "0" : repuestos));
      valorRepuestosTotal += JSON.parse(repuestos == "" ? "0" : repuestos);
      valorManoObraTotal += JSON.parse(manoObra == "" ? "0" : manoObra);
  
      var ingresoText = document.createElement("td")
      if (element.accion === "Sin modificaciones") {
        ingresoText.textContent = '- / - / - -:-';
      } else {
        ingresoText.textContent = formatTimestap(element.fechaIngreso);
      }
      celdaIngreso.appendChild(ingresoText);

      
      var accionesButton = document.createElement("button");
      var contentButtons = newElement("div");
      contentButtons.className = "d-flex align-items-center";
      accionesButton.type = "button";
      accionesButton.className = "btn btn-success margin-r d-flex align-items-center"
      accionesButton.textContent = "💾";
      accionesButton.id = `${element.uuid}-save`
      accionesButton.onclick = function () {
        guardarCambios(auto, element);
      }
      accionesButton.addEventListener('click', function(btn) {
        var spinner = document.createElement('div');
        spinner.className = "spinner"
        spinner.id = 'spinner'
        accionesButton.textContent = 'Guardando';
        accionesButton.disabled = true;
        accionesButton.appendChild(spinner)
        setTimeout(() => {
            document.getElementById('spinner').remove();
            accionesButton.textContent = '💾'
            accionesButton.disabled = false;
            window.location.reload();
        }, 1200);
    })
      contentButtons.appendChild(accionesButton);
      
      var buttonBorrar = document.createElement("button");
      buttonBorrar.type = "button";
      buttonBorrar.className = "btn btn-danger d-flex align-items-center"
      buttonBorrar.textContent = "🗑️";
      buttonBorrar.id = `${element.uuid}-save`
      buttonBorrar.onclick = function () {
        eliminarTarea(auto, element);
      }
      contentButtons.appendChild(buttonBorrar);
      
      celdaAcciones.appendChild(contentButtons);
  
      fila.id = element.uuid;
      var totalRepuestosInput = document.getElementById("totalRepuestos");
      totalRepuestosInput.value = convertirFormatoMoneda(valorRepuestosTotal);
  
      var totalManoObraInput = document.getElementById("totalManoObra");
      totalManoObraInput.value = convertirFormatoMoneda(valorManoObraTotal);
  
      var inputInversion = document.getElementById("inversionTotal");
      inputInversion.value = convertirFormatoMoneda(valorTotal);
  
      fila.appendChild(celdaIngreso);
      fila.appendChild(celdaTrabajo); // Agregamos la celda de nombre a la fila
      fila.appendChild(celdaManoObra);
      fila.appendChild(celdaRepuestos);
      fila.appendChild(celdaAcciones);
  
      tbody.appendChild(fila); // Agregamos la fila completa al cuerpo de la tabla
    }
  });

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

function convertirStringANumero(str) {
  // Eliminar los caracteres no numéricos del string
  var numericString = str.replace(/[^0-9.-]/g, '');

  // Convertir el string a número
  var numero = parseFloat(numericString);

  // Retornar el número
  return numero;
}

function formatStrToTimestap(string) {
  const [fecha, hora] = string.split(' '); // Divide la cadena en fecha y hora
  const [dia, mes, anio] = fecha.split('/'); // Divide la fecha en día, mes y año
  const [horas, minutos] = hora.split(':'); // Divide la hora en horas y minutos

  // Forma una cadena de fecha válida en el formato "mm/dd/aa hh:mm"
  const fechaValida = `${mes}/${dia}/${anio} ${horas}:${minutos}`;

  // Convierte la cadena de fecha en un timestamp
  const timestamp = Date.parse(fechaValida);

  return timestamp;
}

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

async function put(endpoint, body, uuid) {
  try {
    const response = await fetch(`http://localhost:3000/${endpoint}/${uuid}`, {
      method: 'PUT',
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

async function post(endpoint, body, uuid) {
  try {
    const response = await fetch(`http://localhost:3000/${endpoint}/${uuid}`, {
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

function formatNumber(n) {
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, currency, blur) {
  var input_val = input.value;
  if (input_val === "") {
    return;
  }
  var original_len = input_val.length;
  var caret_pos = input.selectionStart;
  if (input_val.indexOf(".") >= 0) {
    var decimal_pos = input_val.indexOf(".");
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);
    left_side = formatNumber(left_side);
    right_side = formatNumber(right_side);
    if (blur === "blur") {
      right_side += "00";
    }
    right_side = right_side.substring(0, 2);
    input_val = currency + left_side + "." + right_side;
  } else {
    input_val = formatNumber(input_val);
    input_val = currency + input_val;
    if (blur === "blur") {
      input_val += ".00";
    }
  }
  input.value = input_val;
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input.setSelectionRange(caret_pos, caret_pos);
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
  });
}

//======================= SERVICIOS =====================

function eliminarTarea(auto, acta) {
  var acta_ = auto.acta.filter(el => el.uuid !== acta.uuid);
  var auto_ = {
    acta: acta_
  }
  if(auto_.acta.length === 0) {
    let isEmpty = {isEmpty: true}
    auto_.acta.push(isEmpty);
  }
  database.ref(`/carsTest/${auto.uuid}`).update(auto_)
  database.ref(`/carsTest/${auto.uuid}`).once('value', (snapshot) => {
    const data = snapshot.val();
    auto = data;
    localStorage.setItem('editCar', JSON.stringify(auto));
    window.location.reload();
  }, (error) => {
    console.log('Error al obtener los datos:', error);
  });
}

function updateCarById(id, update) {
  database.ref(`/carsTest/${id}`).update(update)
}

function agregarTrabajo(_auto) {
  const form = document.getElementById("add-task");
  var accion = form['trabajoN'].value;
  if(!form['manoObraN'].value || !form['repuestosN'].value) {
    return alert('Escribir valor en todos los campos de precios')
  }
  var manoObraValor = convertirStringANumero(form['manoObraN'].value).toString();
  var repuestosValor = convertirStringANumero(form['repuestosN'].value).toString();
  var uuid = generateUUID();
  if(auto.acta[0].isEmpty) {
    auto.acta.pop();
  }
  var newActa = {
    accion,
    fechaIngreso: new Date().getTime(),
    manoObraValor,
    repuestosValor,
    uuid
  }
  console.log(newActa);

  auto.acta.push(newActa);

  database.ref(`carsTest/${auto.uuid}`).update(auto)

  localStorage.setItem('editCar', JSON.stringify(auto));
  window.location.reload();

}

function imprimirFactura() {
  console.log(auto);
  let duenio = auto.duenio;
  let patente = auto.patente;
  let infoCliente = document.getElementById("info-cliente");
  infoCliente.innerText = `Cliente: ${duenio} - Patente del vehículo: ${patente}`;

  let tablePrint = document.getElementById("printCar");
  let html = '';
  let totalAPagar = 0;
  auto.acta.forEach(ob => {
    let totalPagar = (JSON.parse(ob.manoObraValor) + JSON.parse(ob.repuestosValor));
    totalAPagar += totalPagar;
    html += 
    `
    <tr>
      <td>${formatTimestap(ob.fechaIngreso)}</td>
      <td>${ob.accion}</td>
      <td>${ob.manoObraValor == "0" ? "-" : convertirFormatoMoneda(ob.manoObraValor)}</td>
      <td>${convertirFormatoMoneda(ob.repuestosValor)}</td>
      <td>${convertirFormatoMoneda(totalPagar)}</td>
    </tr>
    `
  })
  document.getElementById("total-a-pagar-print").innerText = `Total a pagar: ${convertirFormatoMoneda(totalAPagar)}`
  tablePrint.innerHTML = html;


  window.print();
}

function getElement(id) {
  return document.getElementById(id);
}

function newElement(element) {
  return document.createElement(element);
}

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
cargarDatos(auto)