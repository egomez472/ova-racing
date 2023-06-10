const uuid = localStorage.getItem('acta-uuid');

// INDEX.HTML - UTILS.JS
var btnAgregar = document.getElementById('btn-agregar');
if(btnAgregar) {
    btnAgregar.addEventListener('click', function(btn) {
        var spinner = document.createElement('div');
        spinner.className = "spinner"
        spinner.id = 'spinner'
        btnAgregar.textContent = 'Agregando';
        btnAgregar.disabled = true;
        btnAgregar.appendChild(spinner)
        setTimeout(() => {
            document.getElementById('spinner').remove();
            btnAgregar.textContent = 'Agregar'
            btnAgregar.disabled = false;
        }, 1200);
    })
}

var btnCargar = document.getElementById('btn-cargar');
if(btnCargar) {
    btnCargar.addEventListener('click', function(btn) {
        var spinner = document.createElement('div');
        spinner.className = "spinner"
        spinner.id = 'spinner'
        btnCargar.textContent = 'Cargando';
        btnCargar.disabled = true;
        btnCargar.appendChild(spinner)
        setTimeout(() => {
            document.getElementById('spinner').remove();
            btnCargar.textContent = 'Cargar'
            btnCargar.disabled = false;
        }, 1200);
    })
}

// EDITAR.HTML - EDITAR.JS
var btnCargarUuid = document.getElementById(`${uuid}-save`);
if(btnCargarUuid) {
    btnCargarUuid.addEventListener('click', function(btn) {
        var spinner = document.createElement('div');
        spinner.className = "spinner"
        spinner.id = 'spinner'
        btnCargarUuid.textContent = 'Guardando';
        btnCargarUuid.disabled = true;
        btnCargarUuid.appendChild(spinner)
        setTimeout(() => {
            document.getElementById('spinner').remove();
            btnCargarUuid.textContent = 'Guardar'
            btnCargarUuid.disabled = false;
            window.location.reload();
        }, 1200);
    })
}

var btnGuardarUuid = document.getElementById(`${uuid}-save`);
if(btnGuardarUuid) {
    btnGuardarUuid.addEventListener('click', function(btn) {
        var spinner = document.createElement('div');
        spinner.className = "spinner"
        spinner.id = 'spinner'
        btnGuardarUuid.textContent = 'Guardando';
        btnGuardarUuid.disabled = true;
        btnGuardarUuid.appendChild(spinner)
        setTimeout(() => {
            document.getElementById('spinner').remove();
            btnGuardarUuid.textContent = '💾'
            btnGuardarUuid.disabled = false;
            window.location.reload();
        }, 1200);
    })
}