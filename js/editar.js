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
      document.getElementById("warn-task").remove();
      var fila = document.createElement("tr"); // Creamos una nueva fila de tabla
      var celdaIngreso = document.createElement("td");
      var celdaTrabajo = document.createElement("td"); // Creamos una celda para el nombre del producto
      var celdaManoObra = document.createElement("td");
      var celdaRepuestos = document.createElement("td");
      var celdaAcciones = document.createElement("td");
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
      repuestosValorInput.type = "number";
      repuestosValorInput.className = "form-control mb-2";
      repuestosValorInput.value = element.repuestosValor;
      celdaRepuestos.appendChild(repuestosValorInput);
  
      valorTotal += (JSON.parse(element.manoObraValor) + JSON.parse(element.repuestosValor));
      valorRepuestosTotal += JSON.parse(element.repuestosValor);
      valorManoObraTotal += JSON.parse(element.manoObraValor);
  
      var ingresoText = document.createElement("td")
      if (element.accion === "Sin modificaciones") {
        ingresoText.textContent = '- / - / - -:-';
      } else {
        ingresoText.textContent = formatTimestap(element.fechaIngreso);
      }
      celdaIngreso.appendChild(ingresoText);
  
      var accionesButton = document.createElement("button");
      accionesButton.type = "button";
      accionesButton.className = "btn btn-success d-flex align-items-center"
      accionesButton.textContent = "Guardar";
      accionesButton.id = `${element.uuid}-save`
      accionesButton.onclick = function () {
        guardarCambios(auto, element);
      }
      celdaAcciones.appendChild(accionesButton);
  
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

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
  });
}

//======================= SERVICIOS =====================

function deleteCarById(id) {
  database.ref(`/carsTest/${id}`).remove();
  getCars();
}

function updateCarById(id, update) {
  database.ref(`/carsTest/${id}`).update(update)
}

function agregarTrabajo(_auto) {
  const form = document.getElementById("add-task");
  var accion = form['trabajoN'].value;
  var manoObraValor = form['manoObraN'].value;
  var repuestosValor = form['repuestosN'].value;
  var uuid = generateUUID();
  var newActa = {
    accion,
    fechaIngreso: new Date().getTime(),
    manoObraValor,
    repuestosValor,
    uuid
  }

  auto.acta.push(newActa);

  database.ref(`carsTest/${auto.uuid}`).update(auto)

  localStorage.setItem('editCar', JSON.stringify(auto));
  window.location.reload();

}



cargarDatos(auto)