let mymap : Map<number,string> = new Map()
console.log('anda');
let api= async (url: string) => {
  const response=await fetch(url);
if(!response.ok) {
throw new Error(response.statusText);
}
return response.json();

}
api('https://dummy.restapiexample.com/api/v1/employees').then(data=>{
    console.log(data);
}).catch(err=>{
    console.error(err);
})

interface Employees{
id:Number,
employee_name:string,
employee_salary:Number,
employee_age:Number,
profile_image:string
}


