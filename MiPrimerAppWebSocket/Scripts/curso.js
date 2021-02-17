window.onload = function () {
    llamarTabla(undefined, function () { console.log('') });
    llenarCombo(function () { console.log('websocket') });
}
function llamarTabla(url = 'curso/listarCursos', callback) {
    pintar(url, undefined, ['ID', 'NOMBRE', 'CATEGORIA', 'PRECIO'],
        ['IIDCURSO', 'NOMBRE', 'NOMBRECATEGORIA', 'PRECIO'], undefined, true, true, 'IIDCURSO', true, function () {
            callback();
        });
}
function llenarCombo(callback) {
    pintarCombo('Categoriacurso/listarCategoriacurso', 'IIDCATEGORIACURSO', 'NOMBRE', 'IIDCATEGORIACURSO', true, function () {
        callback();
    });
}
function filtrarCurso() {
    var id = get('IIDCATEGORIACURSO');
    llamarTabla('curso/listarCursos?id=' + id, function () { console.log('websocket') })
}
function Eliminar(id) {
    fetchGetText('curso/eliminarCurso?id=' + id, function () {
        socket.send('eliminarCurso')
    }, undefined);
}
function Editar(id) {
    document.location.href = UrlEnviar('curso/Editar?Id=' + id);
}
//VALIDAMOS LOS CAMBIOS EN EL SOCKET
socket.onmessage = function (e) {
    switch (e.data) {
        case 'guardoCategoriaCurso':
            var valor = get('IIDCATEGORIACURSO');
            llenarCombo(function () {
                set('IIDCATEGORIACURSO', valor);//mantener el valor del filtro
            });
            break;
        case 'eliminarCategoriaCurso':
            var valor = get('IIDCATEGORIACURSO');
            llenarCombo(function () {
                set('IIDCATEGORIACURSO', valor);//mantener el valor del filtro
            });
            break;
        case 'agregarCurso':
            ejecutarDespuesDeonmessege();
            break;
        case 'eliminarCurso':
            ejecutarDespuesDeonmessege();
            break;
        case 'editarCurso':
            ejecutarDespuesDeonmessege();
            break;
    }
}

function ejecutarDespuesDeonmessege() {
    var indiceActual = indiceActualFuncion('TablaGenerica');
    var url = '';
    if (filtro == '') {
        url = 'curso/listarCursos';
    } else {
        url = 'curso/listarCursos?id=' + filtro;
    }
    llamarTabla(url, function () {
        RecuperarPaginaActual('TablaGenerica', indiceActual);
    });
}