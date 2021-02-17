//socket
var socket = new WebSocket('ws://192.168.43.18:9898');
socket.onopen = function () {
    document.getElementById('SocketEstado').innerHTML = '<i title="websocket encendido" class="text-success">WebSocket</i>';
}
socket.onclose = function () {
    Error('Vaya!', 'El websocket esta apagodo, la aplicación seguira funcionando pero no sera tiempo real.');
    document.getElementById('SocketEstado').innerHTML = '<i title="websocket apagado" class="text-danger">WebSocket</i>';
}
//obtiene un tag
function getI(id) {
    return document.getElementById(id).innerHTML;
}
//dar valor a los tag
function setI(id, valor) {
    document.getElementById(id).innerHTML = valor;
}
//obtener los valores de input,select,textarea
function get(id) {
    return document.getElementById(id).value;
}
//obtener los valores de img
function getS(id) {
    return document.getElementById(id).src;
}
//dar valor a los input,select,textarea
function set(id, valor) {
    document.getElementById(id).value = valor;
}
//dar valor a los img
function setS(id, valor) {
    document.getElementById(id).src = valor;
}
//pintar las tablas
function pintar(url, idcontenedor = 'contenido', cabeceras, propiedades, idTabla = 'TablaGenerica', eliminar = false, editar = false, propiedadId = 'id'
    , IsCallback = false, callback, campoImagen) {
    //obtener la url absoluta
    var urlAbsoluta = window.location.protocol + '//' + window.location.host + get('hdfOculto') + url;
    //link, que formato, obtener la data { then = , }
    fetch(urlAbsoluta).then(res => res.json()).then(res => {
        var html = '';
        html += '<table class="table table-striped table-hover" id="' + idTabla + '">';
        html += '<thead class="thead-dark">';
        html += '<tr>';
        for (var i = 0; i < cabeceras.length; i++)
        {
            html += '<th>' + cabeceras[i] + '</th>';
        }
        if (editar || eliminar)
            html += '<th>OPCIONES</th>';
        html += '</tr>';
        html += '<tbody>';
        for (var i = 0; i < res.length; i++) {
            var objetoActual = res[i];
            html += '<tr>';
            for (var j = 0; j < propiedades.length; j++){
                var propiedadActual = propiedades[j];
                if (campoImagen != undefined && campoImagen.includes(propiedadActual)) {
                    html += '<td> <img src="' + objetoActual[propiedadActual] + '" width="130px"  height="130px"/></td>';
                } else {
                    html += '<td>' + objetoActual[propiedadActual] + '</td>';
                }
            }
            if (editar || eliminar) {
                html += '<td>';
                if (editar)
                    html += `<i class="btn-sm btn-success" onclick="Editar(${objetoActual[propiedadId]})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></i> `;
                if (eliminar)
                    html += `<i class="btn-sm btn-danger" onclick="EliminarDatos(${objetoActual[propiedadId]})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></i>`;
                html += '</td>';
            }
        }
        html += '</tbody>';
        html += '</thead>';
        html += '</table>';
        document.getElementById(idcontenedor).innerHTML = html;
        $('#' + idTabla).DataTable();
        if (IsCallback) {
            callback();
        }
        CirculoCarga(undefined)
    });
}
//pinta o oculta el circulo de carga
function CirculoCarga(aparecer = false) {
    //si el parametro viene en true se muestra de lo contrario se oculta
    var contenedor = document.getElementById('contenedor-carga');
    if (aparecer) {
        contenedor.style.display = 'block';
        contenedor.style.opacity = '100';
    } else {
        contenedor.style.visibility = 'hidden';
        contenedor.style.opacity = '0';
    }
}
//funcion para envair la data al controlador
function fetchPost(url, obj, callback) {
    Confirmacion(undefined, undefined, undefined, undefined, function () {
        //obtener la url absoluta
        var urlAbsoluta = window.location.protocol + '//' + window.location.host + get('hdfOculto') + url;
        fetch(urlAbsoluta, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(obj)
        }).then(resp => resp.text()).then(resp => {
            if (resp == 1) {
                callback();
            } else {
                Error(undefined, undefined);
            }
        });
    })
}
//mensaje de error
function Error(titulo='Error', texto='Ocurrio un error! intente mas tarde...') {
    Swal.fire({
        icon: 'error',
        title: titulo,
        text: texto
    });
}
//mensaje de exito
function Exito(titulo='Exito', texto='Se guardo correctamente') {
    Swal.fire({
        icon: 'success',
        position:'top-center',
        title: titulo,
        showConfirmButton: false,
        text: texto,
        timer:2000
    });
}
//mensaje de confirmacion
function Confirmacion(titulo = 'Guardar cambios!', texto = '¿Quieres guardar los cambios?',
                      icono = 'warning', tituloBoton = 'Si! Guardar', collback) {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: tituloBoton
    }).then((result) => {
        if (result.isConfirmed) {
            collback();
        }
    })
}
//eliminar datos
function EliminarDatos(id) {
    Confirmacion('Eliminar', '¿Estas seguro que deseas eliminar?', undefined, 'Si!, Eliminar', function () {
        Eliminar(id);
    });
}
//obtener datos en formato JSON
function fetchGetJSON(url, callback) {
    //obtener la url absoluta
    var urlAbsoluta = window.location.protocol + '//' + window.location.host + get('hdfOculto') + url;
    fetch(urlAbsoluta).then(resp => resp.json()).then(objetoJson => {
        callback(objetoJson);
    })
}
//obtener datos en formato Texto
function fetchGetText(url, callback, mensaje = 'Se elimino correctamente') {
    //obtener la url absoluta
    var urlAbsoluta = window.location.protocol + '//' + window.location.host + get('hdfOculto') + url;
    fetch(urlAbsoluta).then(resp => resp.text()).then(resp => {
        if (resp == '1') {
            callback();
            Exito(undefined, mensaje);
        } else {
            Error(undefined, undefined);
        }
    })
}
//llena los select
function pintarCombo(url, propiedadId, propiedadMostrar, idCombo, IsCallback = false, callback) {
    //obtener la url absoluta
    var urlAbsoluta = window.location.protocol + '//' + window.location.host + get('hdfOculto') + url;
    fetch(urlAbsoluta).then(res => res.json()).then(res => {
        var html = '<option value="">--Seleccione--</option>';
        for (var i = 0; i < res.length; i++) {
            var objetoActual = res[i];
            html += '<option value="' + objetoActual[propiedadId] + '">' + objetoActual[propiedadMostrar] + '</option>';
        }
        document.getElementById(idCombo).innerHTML = html;
        if (IsCallback) {
            callback();
        }
    });
}
//obtiene la url donde se enviara el cliente
function UrlEnviar(url) {
    //obtener la url absoluta
    var urlAbsoluta = window.location.protocol + '//' + window.location.host + get('hdfOculto') + url;
    return urlAbsoluta;
}
//saber en que pagina me encuentro en el DataTable
function indiceActualFuncion(idTabla) {
    var objPaginaActual = document.querySelector('#' + idTabla + '_paginate .current');
    return objPaginaActual.innerHTML;
}
//posicionar en la hoja del paginado
function RecuperarPaginaActual(idTabla, indiceActual) {
    while (1 == 1) {
        var obj = document.querySelectorAll('#' + idTabla + '_paginate :not(#' + idTabla + '_previous) a');
        var link;
        var indiceBucle;
        var encontro = false;
        for (var i = 0; i < obj.length; i++) {
            link = obj[i];
            indiceBucle = document.querySelector('#' + idTabla + '_paginate .current').innerHTML;
            if (indiceBucle == indiceActual) {
                encontro = true; break;
            } else {
                document.getElementById(idTabla + '_next').click();
                var indiceSiguientePagina = document.querySelector('#' + idTabla + '_paginate .current').innerHTML;
                if (indiceBucle == indiceSiguientePagina) {
                    encontro = true;
                    break;
                }
            }
        }
        if (encontro) { break; };
    }
}
