window.onload = function () {
    llamarTabla(undefined, function () { console.log('') });
    CirculoCarga(false);
}
function llamarTabla(url = 'Seccion/listarSeccion', callback) {
    pintar(url, undefined, ['ID', 'NOMBRE', 'CATEGORIA', 'PRECIO', 'IMAGEN'],
        ['IIDCURSO', 'NOMBRE', 'NOMBRECATEGORIA', 'PRECIO', 'IMAGEN'], undefined, false, true, 'IIDCURSO', true, function () {
            callback();
    }, ['IMAGEN']);
}
function Editar(id) {
    document.location.href = UrlEnviar('seccion/seccionagregar?Id=' + id);
}
//VALIDAMOS LOS CAMBIOS EN EL SOCKET
socket.onmessage = function (e) {
    switch (e.data) {
        case 'guardoCategoriaCurso':
        case 'eliminarCategoriaCurso':
        case 'agregarCurso':
        case 'eliminarCurso':
        case 'editarCurso':
            ejecutarDespuesDeonmessege();
            break;
    }
}
function ejecutarDespuesDeonmessege() {
    var indiceActual = indiceActualFuncion('TablaGenerica');
    //var url = '';
    //if (filtro == '') {
    //    url = 'curso/listarCursos';
    //} else {
    //    url = 'curso/listarCursos?id=' + filtro;
    //}
    llamarTabla(undefined, function () {
        RecuperarPaginaActual('TablaGenerica', indiceActual);
    });
}