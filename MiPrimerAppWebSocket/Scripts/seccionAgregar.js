/** */
window.onload = function () {
    obtenerNombreCurso();
    listarSecciones();
    CirculoCarga(false);
}
/** */
function obtenerNombreCurso() {
    var urlAbsoluta = window.location.protocol + '//' + window.location.host + get('hdfOculto') + 'seccion/obtenerNombre?id=' + get('IIDCURSO');
    fetch(urlAbsoluta).then(p => p.text()).then(nombre => {
        document.getElementById('nombreCurso').innerHTML ='<strong>Curso: </strong>'+ nombre;
    });
}
/**
 * 
 * @param {any} lista
 */
function listarSecciones(lista) {
    var IIDCURSO = get('IIDCURSO');
    fetchGetJSON('seccion/listarSeccionVideo?Id=' + IIDCURSO, function (dataVideos) {
        fetchGetJSON('seccion/listar?Id=' + IIDCURSO, function (rpt) {
            var html = '';
            for (var i = 0; i < rpt.length; i++) {
                var objActual = rpt[i];
                var listaVideos;
                listaVideos = dataVideos.filter(p => p.IIDSECCION == objActual['IIDSECCION']);
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
                </h2>-
                <div style="width:10%" class="d-flex">
                    <a class="btn btn-success ml-2" style="height:40px;" onclick="Abrir('Editar sección',${objActual['IIDSECCION']})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                    </a>-
                    <a class="btn btn-danger ml-2" style="height:40px;" onclick="Eliminar(${objActual['IIDSECCION']})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                    </a>
                </div>
                </div>
                <div id="d${objActual['IIDSECCION']}" class="${lista == undefined ? "accordion-collapse collapse" : nombreClaseContenedor}" name="contenedor" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                         <strong>Descripción: </strong>${objActual['DESCRIPCIONSECCION']}
                         - <button class="btn btn-sm btn-primary" onclick="Abrir('Agregar una clase',${objActual['IIDSECCION']})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                             Subir 
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z"/>
                             </svg>
                         </button><br><br>
                         ${listaVideos.length == 0 ? '' :
                        listaVideos.map((o, i) =>
                            `<div class="alert alert-secondary" style="width:70%;cursor:pointer;" >
                                <i class="btn btn-danger mr-2" onclick="EliminarVideo(${o.IIDVIDEOS})">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                         <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                    </svg>
                                </i>
                                <a class="btn btn-success mr-2" onclick="Abrir('Editar Video',${o.IIDVIDEOS})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                    </svg>
                                </a>
                                <a class="btn btn-primary" onclick="AbrirVideos(${o.IIDVIDEOS})" data-bs-toggle="modal" data-bs-target="#modalVideo">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
                                    </svg>
                                </a>
                                
                                ${(i + 1).toString().padStart(2, 0)} - ${o.NOMBRE}
                            </div>\n`).join("")}
                    </div>
                </div>
            </div>`;
            }
            document.getElementById('accordionExample').innerHTML = html;
        });
    });
}
/**
 * 
 * @param {any} id
 */
function EliminarVideo(id) {
    Confirmacion('Eliminar video', '¿Estas seguro que deseas eliminar el video?', 'warning', 'Si!, Eliminar', function () {
        fetchGetText('seccion/eliminarVideo?id=' + id, function () {
            socket.send('eliminarVideo' + get('IIDCURSO'));
        })
    });
}
/**
 * 
 * @param {any} id
 */
function AbrirVideos(id) {
    document.getElementById('videoDatos').src = '';
    fetchGetTextMasivos('seccion/obtenerVideo?id='+id, function (text) {
        document.getElementById('videoDatos').src = text;
    });
}
/**
 * 
 * @param {any} id
 */
function Eliminar(id) {
    Confirmacion('Eliminar', '¿Desea eliminar la seccion?', undefined, 'Si! Eliminar', function () {
        fetchGetText('seccion/eliminar?id=' + id, function () {
            socket.send('seccionEliminar' + get('IIDCURSO'));
        }, undefined);
    });
}
/* */
function Agregar() {
    var objetoSeccion = {
        'IIDSECCION': get('IIDSECCION_EDIT') == '' ? 0 : get('IIDSECCION_EDIT'),
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
    set('VIDEO_EDIT', '');
    set('NOMBRESECCION', '');
    set('DESCRIPCIONSECCION', '');
    set('DESCRIPCIONSECCION', '');
    set('IIDSECCION_EDIT', '');
    set('NOMBRESECCION_EDIT', '');
    set('DESCRIPCIONSECCIONE_EDIT', '');
    set('TITULO', '');
    set('VIDEO', '');
    document.getElementById('BARRA_PROGRESO').value = 0;
    document.getElementById('BARRA_PROGRESO').max = 0;
    document.getElementById('porcentaje').innerHTML = '';
    porcentajeActual = 0;
    porcentajePorViaje = 0;
}

socket.onmessage = function (e) {
    let text = e.data; let idcurso = get('IIDCURSO');
    if (text == 'seccionAgregar' + idcurso ||
        text == 'seccionEliminar' + idcurso ||
        text == 'agregarVideo' + idcurso ||
        text == 'eliminarVideo' + idcurso ||
        text == 'editarVideo' + idcurso) {
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
    else if (text == 'editarCurso') {
        obtenerNombreCurso();
    }
}
function Abrir(titulo, id) {
    limpiar();
    set('IIDSECCION_EDIT', id)
    setI('lblTitulo', titulo);
    displayHTML('divEditar', 'none');
    displayHTML('divAgregarClase', 'none');
    if (titulo == 'Editar sección') {
        displayHTML('divEditar', 'block');
        fetchGetJSON('seccion/obtenerPorId?Id=' + id, function (resp) {
            set('NOMBRESECCION_EDIT', resp['NOMBRESECCION'])
            set('DESCRIPCIONSECCIONE_EDIT', resp['DESCRIPCIONSECCION'])
        });
    } else if (titulo == 'Agregar una clase') {
        displayHTML('divAgregarClase', 'block');
    } else if (titulo == 'Editar Video') {
        displayHTML('divAgregarClase', 'block');
        fetchGetJSON('seccion/recuperarVideo?id=' + id, function (data) {
            set('VIDEO_EDIT', id);
            set('TITULO', data['NOMBRE'])
        });
    }
}
var videoCadena = '';
var bloque = 1500000;
var nTotalViajes;
var viajeActual = 1;
var porcentajeActual = 0;
var porcentajePorViaje=0;
function GuardarDatos() {
    var titulo = getI('lblTitulo');
    var archivo = document.getElementById('VIDEO').files[0];
    if (titulo == 'Editar sección') {
        var objetoSeccion = {
            'IIDSECCION': get('IIDSECCION_EDIT'),
            'NOMBRESECCION': get('NOMBRESECCION_EDIT'),
            'DESCRIPCIONSECCION': get('DESCRIPCIONSECCIONE_EDIT')
        }
        fetchPost('seccion/Guardar', objetoSeccion, function () {
            socket.send('seccionAgregar' + get('IIDCURSO'));
            document.getElementById('btnCerrarModal').click();
            limpiar();
            Exito('Exito', 'Se modifico la sección');
        });
    } else if (titulo == 'Agregar una clase') {
        if (archivo != undefined) {
            var reader = new FileReader();
            reader.onloadend = function () {
                videoCadena = reader.result;
                var longitud = videoCadena.length;//obtenemos la longitud del video
                nTotalViajes = Math.floor(longitud / bloque) + 1;//vamos a calcular cuentos bloques tendremos
                porcentajePorViaje = 100 / nTotalViajes;
                document.getElementById('BARRA_PROGRESO').max = nTotalViajes;
                document.getElementById('porcentaje').innerHTML = porcentajeActual + '%';
                var objetoSeccionVideo = {
                    'NOMBRE': get('TITULO'),
                    'IIDSECCION': get('IIDSECCION_EDIT'),
                    'VIDEO': 0
                }
                viajeActual = 1;
                insertarDatos(objetoSeccionVideo);
            }
            reader.readAsDataURL(archivo);
        } else {
            var objetoSeccionVideo = {
                'NOMBRE': get('TITULO'),
                'IIDSECCION': get('IIDSECCION_EDIT'),
                'VIDEO': 'i'
            }
            fetchPost('seccion/guardarSeccionVideo', objetoSeccionVideo, function (rpt) {
                document.getElementById('btnCerrarModal').click();
                limpiar();
                Exito('Exito', 'Registro guardado');
                socket.send('agregarVideo' + get('IIDCURSO'));
            });
        }
    } else if (titulo == 'Editar Video') {
        if (archivo != undefined) {//hay video
            var reader = new FileReader();
            reader.onloadend = function () {
                videoCadena = reader.result;
                var longitud = videoCadena.length;//obtenemos la longitud del video
                nTotalViajes = Math.floor(longitud / bloque) + 1;//vamos a calcular cuentos bloques tendremos
                porcentajePorViaje = 100 / nTotalViajes;
                document.getElementById('BARRA_PROGRESO').max = nTotalViajes;
                document.getElementById('porcentaje').innerHTML = porcentajeActual + '%';
                var objetoSeccionVideo = {
                    'IIDVIDEOS': get('VIDEO_EDIT'),
                    'NOMBRE': get('TITULO'),
                    'IIDSECCION': get('IIDSECCION_EDIT'),
                    'VIDEO': 0
                }
                viajeActual = 1;
                insertarDatos(objetoSeccionVideo);
            }
            reader.readAsDataURL(archivo);
        } else {//no hay video
            var objetoSeccionVideo = {
                'IIDVIDEOS': get('VIDEO_EDIT'),
                'NOMBRE': get('TITULO'),
                'IIDSECCION': get('IIDSECCION_EDIT'),
                'VIDEO': 'i'
            }
            fetchPost('seccion/guardarSeccionVideo', objetoSeccionVideo, function (rpt) {
                document.getElementById('btnCerrarModal').click();
                limpiar();
                Exito('Exito', 'Registro guardado');
                socket.send('editarVideo' + get('IIDCURSO'));
            });
        }
    }
}
function insertarDatos(obj) {
    var caracter;
    if (nTotalViajes >= 0) {
        //cuando viaje actual sea 1 
        //1 * 1 500 000 - 1 500 000;
        var inicio = viajeActual * bloque - bloque;
        if (viajeActual == 1) {
            caracter='i'
        }else if (viajeActual == nTotalViajes) {
            caracter = 'f';
        } else {
            caracter = 'e';
        }
        //guardamos el video
        obj.VIDEO = caracter + videoCadena.substr(inicio, bloque);
        fetchPostMasivo('seccion/guardarSeccionVideo', obj, function (rpt) {
            if (viajeActual == nTotalViajes) {
                document.getElementById('btnCerrarModal').click();
                limpiar();
                Exito('Exito', 'Video guardado');
                socket.send('agregarVideo' + get('IIDCURSO'));
            } else {
                viajeActual++;
                document.getElementById('BARRA_PROGRESO').value = viajeActual;
                porcentajeActual = (porcentajeActual + porcentajePorViaje) * 1;
                document.getElementById('porcentaje').innerHTML = porcentajeActual.toFixed() + ' %';
                obj.IIDVIDEOS = rpt;
                insertarDatos(obj);
            }
        });
    }
}
function CerrarVideo() {
    let videoControl = document.getElementById('videoDatos');
    videoControl.pause();
    videoControl.src = '';

}