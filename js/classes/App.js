import {datosCita, nuevaCita} from '../Funciones.js';
import {
    mascotaInput, 
    propietarioInput, 
    telefonoInput, 
    fechaInput, 
    horaInput, 
    sintomasInput, 
    formulario} 
from '../Selectores.js';

class App {
    constructor(){
        this.initApp();
    }
    initApp(){
        mascotaInput.addEventListener('change', datosCita);
        propietarioInput.addEventListener('change', datosCita);
        telefonoInput.addEventListener('change', datosCita);
        fechaInput.addEventListener('change', datosCita);
        horaInput.addEventListener('change', datosCita);
        sintomasInput.addEventListener('change', datosCita);

        //Formulario para nuevas citas
        formulario.addEventListener('submit', nuevaCita);
    }
}

export default App;