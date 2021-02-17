window.onload = function () {
    llamarTabla('Categoriacurso/listarCategoriacurso', function () { console.log('websocket') });
}
function llamarTabla(url, callback) {
    pintar(url, undefined, ['ID', 'NOMBRE'],
        ['IIDCATEGORIACURSO', 'NOMBRE'], undefined, true, true, 'IIDCATEGORIACURSO', true, function () {
            callback();
    });
}
function filtrarCategoria() {
    var nombre = get('CBXNOMBRE');
    llamarTabla('Categoriacurso/listarCategoriacurso?nombreCategoria=' + nombre, function () { console.log('websocket:' + nombre) })
}
function guardar() {
    var objeto = {
        'IIDCATEGORIACURSO': get('IIDCATEGORIACURSO') == '' ? '0' : get('IIDCATEGORIACURSO'),
        'NOMBRE': get('NOMBRE')
    }
    fetchPost('Categoriacurso/guardarDatos', objeto, function () {
        Exito(undefined, undefined);
        Limpiar();
        socket.send("guardoCategoriaCurso");
    });
}
function Eliminar(id) {
    fetchGetText('Categoriacurso/EliminarCategoricurso?Id=' + id, function () {
        socket.send('eliminarCategoriaCurso');
    }, undefined);
}
function Editar(id) {
    fetchGetJSON('Categoriacurso/obtenerCategoricurso?Id=' + id, function (objetoJson) {
        set('IIDCATEGORIACURSO', objetoJson.IIDCATEGORIACURSO);
        set('NOMBRE', objetoJson.NOMBRE);
    });
}
function Limpiar() {
    set('IIDCATEGORIACURSO', '');
    set('NOMBRE', '');
}
//VALIDAMOS LOS CAMBIOS EN EL SOCKET
socket.onmessage = function (e) {
    switch (e.data) {
        case 'guardoCategoriaCurso':
            ejecutarDespuesOnmessege();
            break;
        case 'eliminarCategoriaCurso':
            ejecutarDespuesOnmessege();
            break;
    }
}
function ejecutarDespuesOnmessege() {
    var indiceActual = indiceActualFuncion('TablaGenerica');
    var nombre = get('CBXNOMBRE');
    var url = '';
    if (nombre != '') {
        url = 'Categoriacurso/listarCategoriacurso?nombreCategoria=' + nombre;
    } else {
        url = 'Categoriacurso/listarCategoriacurso';
    }
    set('CBXNOMBRE', nombre);
    llamarTabla(url, function () {
        RecuperarPaginaActual('TablaGenerica', indiceActual);
    });
}