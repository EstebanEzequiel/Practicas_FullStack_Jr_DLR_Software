let dinero =150;

interface Preferencia{
    gusto : string,
    precio : number,
    //emulado
    cantidad?:number,
}



//{item.usuarioCreacion?.username}

let comprar = (cantidad,gusto) =>{
    console.log('usted compro :' + cantidad + ' del gusto :'+ gusto);
    
}
let mipref : Preferencia = {
    gusto : 'cocacola',
    precio : 30,
    
}

let comprarGaseosa = (cantidad,gusto,precio) =>{
   comprar(cantidad,gusto);
   console.log(precio);
}

let comprarGaseosav2 = (preferencia : Preferencia) =>{
    comprar(preferencia.cantidad,preferencia.gusto);
    console.log(preferencia.precio);//undefined
    preferencia.cantidad=+1;
    
}


comprarGaseosav2(30,'cola')
//no es el mismo ?
let alberto ;
alberto?.toLowerCase();

console.log(alberto?.toLowerCase());

