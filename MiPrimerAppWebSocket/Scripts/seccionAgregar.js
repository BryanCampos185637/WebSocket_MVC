window.onload = function () {
    listarSecciones();
    CirculoCarga(false);
}
function listarSecciones(lista) {
    var IIDCURSO = get('IIDCURSO');
    fetchGetJSON('seccion/listar?Id=' + IIDCURSO, function (rpt) {
        var html = '';
        for (var i = 0; i < rpt.length; i++) {
            var objActual = rpt[i];
            if (lista != undefined) {
                var nombreClaseBoton = ''; var nombreClaseContenedor = '';
                var filtro = lista.filter(p => p.Id == objActual['IIDSECCION']);
                var longitud = filtro.length;
                if (longitud != 0) {
                    nombreClaseBoton = filtro[0].ClaseBoton;
                    nombreClaseContenedor = filtro[0].ClaseContenedor;
                } else {
                    nombreClaseBoton = 'accordion-button';
                    nombreClaseContenedor = 'accordion-collapse collapse';
                }
            }
            html += `
            <div class="accordion-item mb-3">
                <div class="d-flex">
                <h2 class="accordion-header" id="headingOne" style="width:70%">
                    <button id="${objActual['IIDSECCION']}" class="${lista == undefined ? "accordion-button" : nombreClaseBoton}" name="boton" type="button" data-bs-toggle="collapse" data-bs-target="#d${objActual['IIDSECCION']}" aria-expanded="true" aria-controls="collapseOne">
                        Seccion ${(i + 1).toString().padStart(2, 0)}: ${objActual['NOMBRESECCION']}
                    </button>
                </h2>
                <div style="width:10%" class="d-flex">
                    <a class="btn btn-success" style="height:40px;" onclick="Abrir('Editar sección',${objActual['IIDSECCION']})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>
                    </a>
                    <a class="btn btn-danger" style="height:40px;" onclick="Eliminar(${objActual['IIDSECCION']})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg>
                    </a>
                </div>
                </div>
                <div id="d${objActual['IIDSECCION']}" class="${lista == undefined ? "accordion-collapse collapse" : nombreClaseContenedor}" name="contenedor" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body">${objActual['DESCRIPCIONSECCION']}</div>
                </div>
            </div>`;
        }
        document.getElementById('accordionExample').innerHTML = html;
    });
}
function Eliminar(id) {
    Confirmacion('Eliminar', '¿Desea eliminar la seccion?', undefined, 'Si! Eliminar', function () {
        fetchGetText('seccion/eliminar?id=' + id, function () {
            socket.send('seccionEliminar' + get('IIDCURSO'));
        }, undefined);
    });
}
function Agregar() {
    var objetoSeccion = {
        'IIDSECCION': get('IIDSECCION'),
        'IIDCURSO': get('IIDCURSO'),
        'NOMBRESECCION': get('NOMBRESECCION'),
        'DESCRIPCIONSECCION': get('DESCRIPCIONSECCION')
    }
    var arrayData = [];
    var botones = document.getElementsByName('boton');
    var contenedores = document.getElementsByName('contenedor');
    for (var i = 0; i < botones.length; i++) {
        arrayData.push({
            'Id': botones[i].id,
            'ClaseBoton': botones[i].className,
            'ClaseContenedor': contenedores[i].className
        });
    }
    fetchPost('seccion/guardar', objetoSeccion, function () {
        socket.send('seccionAgregar' + get('IIDCURSO'));
        limpiar();
        Exito('Exito', 'Se guardo la sección');
        listarSecciones(arrayData);
    });
}
function limpiar() {
    set('IIDSECCION', '');
    set('NOMBRESECCION', '');
    set('DESCRIPCIONSECCION', '');
}

socket.onmessage = function (e) {
    let text = e.data; let idcurso = get('IIDCURSO');
    if (text == 'seccionAgregar' + idcurso || text == 'seccionEliminar' + idcurso) {
        var arrayData = [];
        var botones = document.getElementsByName('boton');
        var contenedores = document.getElementsByName('contenedor');
        for (var i = 0; i < botones.length; i++) {
            arrayData.push({
                'Id': botones[i].id,
                'ClaseBoton': botones[i].className,
                'ClaseContenedor': contenedores[i].className
            });
        }
        listarSecciones(arrayData);
    }
}
function Abrir(titulo, id) {
    setI('lblTitulo', titulo);
    if (titulo == 'Editar sección') {
        fetchGetJSON('seccion/obtenerPorId?Id=' + id, function (resp) {
            set('IIDSECCION_EDIT', resp['IIDSECCION'])
            set('NOMBRESECCION_EDIT', resp['NOMBRESECCION'])
            set('DESCRIPCIONSECCIONE_EDIT', resp['DESCRIPCIONSECCION'])
        });
    }
}
function GuardarDatos() {
    var titulo = getI('lblTitulo');
    if (titulo = 'Editar sección') {
        var objetoSeccion = {
            'IIDSECCION': get('IIDSECCION_EDIT'),
            'NOMBRESECCION': get('NOMBRESECCION_EDIT'),
            'DESCRIPCIONSECCION': get('DESCRIPCIONSECCIONE_EDIT')
        }
        fetchPost('seccion/guardar', objetoSeccion, function () {
            socket.send('seccionAgregar' + get('IIDCURSO'));
            limpiar();
            Exito('Exito', 'Se guardo la sección');
            listarSecciones(arrayData);
        });
    }
}