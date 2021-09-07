import Citas from './classes/Citas.js';
import UI from './classes/UI.js';
import {
    mascotaInput, 
    propietarioInput, 
    telefonoInput, 
    fechaInput, 
    horaInput, 
    sintomasInput, 
    formulario} 
from './Selectores.js';

const ui = new UI();
const administrarCitas = new Citas();

let editando = false;

export let DB;

//Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}

//Agregar datos al objeto de la cita
export function datosCita(e) {
    // Obtener el Input
    citaObj[e.target.name] = e.target.value;
}

export function nuevaCita(e) {
    e.preventDefault();
    
    //Destructuring objeto cita
    const {mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')

        return;
    }

    if(editando) {
        // NUEVO: 
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        // console.log(objectStore);
        const peticion = objectStore.put(citaObj);

        transaction.oncomplete = () => {

            console.log('Editado Correctamente.')
            
            // Mover el código aqui..
            // Estamos editando
            administrarCitas.editarCita( {...citaObj} );

            ui.imprimirAlerta('Guardado Correctamente');

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

            editando = false;
        }

        transaction.onerror = () => {
            console.log('Hubo un errorr.')
        }


    } else {
        // Nuevo Registrando

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});


        // NUEVO: 
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        // console.log(objectStore);
        const peticion = objectStore.add(citaObj);

        transaction.oncomplete = () => {
            console.log('Cita agregada!');

            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente')

        }

        transaction.onerror = () => {
            console.log('Hubo un error!');
        }
    }


        // Imprimir el HTML de citas
        ui.imprimirCitas();

        // Reinicia el objeto para evitar futuros problemas de validación
        reiniciarObjeto();

        // Reiniciar Formulario
        formulario.reset();
}

// Reiniciar el objeto
export function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

export function eliminarCita(id) {
    // NUEVO:
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    
    const resultado =  objectStore.delete(id);

    // console.log( objectStore);
    // console.log( resultado);


    transaction.oncomplete = () => {
        console.log(`Cita  ${id} fue eliminado`);
        administrarCitas.eliminarCita(id);
        ui.imprimirCitas()
    }


    transaction.onerror = () => {
        console.log('Hubo un error!');
    }
    ui.imprimirAlerta('La cita se eliminó correctamente');
}

export function cargarEdicion(cita) {

    const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

// Código de IndexedDB
 export function crearDB() {
    // crear base de datos con la versión 1
    const crearDB = window.indexedDB.open('citas', 1);

    // si hay un error, lanzarlo
    crearDB.onerror = function() {
        console.log('Hubo un error');
    }

    // si todo esta bien, asignar a database el resultado
    crearDB.onsuccess = function() {
        console.log('Citas Listo!');

        // guardamos el resultado
        DB = crearDB.result;

        // mostrar citas al cargar
        ui.imprimirCitas()
    }

    // este método solo corre una vez
    crearDB.onupgradeneeded = function(e) {
        // el evento que se va a correr tomamos la base de datos
        const db = e.target.result;

        
        // definir el objectstore, primer parametro el nombre de la BD, segundo las opciones
        // keypath es de donde se van a obtener los indices
        const objectStore = db.createObjectStore('citas', { keyPath: 'id',  autoIncrement: true } );

        //createindex, nombre y keypath, 3ro los parametros
        objectStore.createIndex('mascota', 'mascota', { unique: false } );
        objectStore.createIndex('cliente', 'cliente', { unique: false } );
        objectStore.createIndex('telefono', 'telefono', { unique: false } );
        objectStore.createIndex('fecha', 'fecha', { unique: false } );
        objectStore.createIndex('hora', 'hora', { unique: false } );
        objectStore.createIndex('sintomas', 'sintomas', { unique: false } );
        objectStore.createIndex('id', 'id', { unique: true } );

        

        console.log('Database creada y lista');
    }
}