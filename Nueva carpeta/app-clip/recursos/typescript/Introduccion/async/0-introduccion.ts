import { idText } from "typescript";

console.log('antes');
let user =buscarUsuario('Alberto')
console.log(user);

console.log('despues');


var buscarUsuario = (params:string) =>{
    setTimeout(() => {
        console.log('Descargando Informacion...');
        return {id : 'a1k12d', usuario : 'Un Usuario'}
    }, 2000);
}

/*
var buscarUsuario2 = (params:string,callback) =>{
    setTimeout(() => {
        console.log('Descargando Informacion...');
        callback({id : 'a1k12d', usuario : 'Un Usuario'})
    }, 2000);
}
*/