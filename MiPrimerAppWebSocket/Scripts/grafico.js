window.onload = function () {
    graficar(0);
    CirculoCarga(false);
}
function graficar(valor) {
    fetchGetJSON('curso/listarDatosReporteGrafico', function (data) {
        var Tipografico;
        if (valor == 0) {
            Tipografico = get('Tipografico');
        } else {
            Tipografico = valor;
        }
        var columnas = data.map(p => p.NOMBRE);
        var valores = data.map(p => p.CANTIDAD);
        var control = document.getElementById('canvas');
        if (document.getElementById('canvaGrafico')) {
            control.removeChild(document.getElementById('canvaGrafico'));
        }
        //creamos un objeto canvas
        var etiquetaCanva = document.createElement('canvas');
        etiquetaCanva.id = 'canvaGrafico';
        var canvaEtiqueta = etiquetaCanva.getContext('2d');
        new Chart(canvaEtiqueta, {
            type: Tipografico,
            data: {
                labels: columnas,
                datasets: [
                    {
                        label: 'Tipo curso',
                        data: valores,
                        backgroundColor:['red','blue','green','yellow','brown','purple']
                    }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        control.appendChild(etiquetaCanva);
    })
}

//VALIDAMOS LOS CAMBIOS EN EL SOCKET
socket.onmessage = function (e) {
    switch (e.data) {
        case 'agregarCurso':
        case 'editarCurso':
        case 'eliminarCurso':
            var idopcionseleccionado = get('Tipografico');
            graficar(idopcionseleccionado);
            break;
    }
}