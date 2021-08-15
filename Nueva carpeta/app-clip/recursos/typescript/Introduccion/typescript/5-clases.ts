abstract class Personas {
    abstract hola():void;
}

class Alberto extends Personas{
    constructor(){
        super();
    }
    hola() {
        console.log('hola');
        
    }
    
}
class Mateo extends Personas{
    constructor(){
        super();
    }
    hola() {
        console.log('Soy mateo');
        
    }
    
}

let personas : Personas[] = [];

personas.push(new Mateo());

personas.push(new Alberto());

console.log(personas);

personas.forEach(k=>{
    console.log(k.hola());
})