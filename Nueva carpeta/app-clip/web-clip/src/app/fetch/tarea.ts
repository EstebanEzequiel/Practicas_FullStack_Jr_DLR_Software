var contenido = document.querySelector('.contenido') 

function consultar() {
    fetch('http://dummy.restapiexample.com/api/v1/employees')
    .then(res => res.json)
    .then(data => {
        console.log(data)
    })
    
}