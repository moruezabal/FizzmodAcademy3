import express from 'express';
import fs from 'fs';
import moment from 'moment';

const app = express();
const port = (process.env.PORT || 8080);

const getMessageHours = () => {
  let currentDate = moment()

  let limitMorning = moment().set({
      hour: '06',
      minute: '00',
      second: '00'
  })

  let limitAfternoon = moment().set({
      hour: '13',
      minute: '00',
      second: '00'
  })

  let limitEvening = moment().set({
      hour: '20',
      minute: '00',
      second: '00'
  })

  if (currentDate.isBefore(limitMorning)) {
      return 'Buenas noches!'
  } else if (currentDate.isBetween(limitMorning, limitAfternoon)) {
      return 'Buenos dias!'
  } else if (currentDate.isBetween(limitAfternoon, limitEvening)) {
      return 'Buenas tardes!'
  } else if (currentDate.isAfter(limitEvening)) {
      return 'Buenas noches!'
  }
}

const randomStadistic = (min, max, iterations) => {
  let resume = {};

  for (let i = 0; i < iterations; i++) {
    let randomKey = Math.round((Math.random() * (max - min) + min));
    if(resume.hasOwnProperty(randomKey)){
      resume[randomKey] += 1;
    }
    else{
      resume[randomKey] = 1;
    }   
  }
  return resume
}

const readFile = async path => {
  let info = {};
  try{
    let content = await fs.promises.readFile(path,'utf-8');
    let statsFile = fs.statSync(path);
    info.contenidoStr = content;
    info.contenidoObj = JSON.parse(content);
    info.size = statsFile.size
    console.log(info); // Consigna: "Mostrar por consola el objeto info luego de leer el archivo"
    await fs.promises.writeFile('info.txt', JSON.stringify(info))
  }
  catch (err){
    console.log('Error en lectura: ' + err);
  }
  return info
}

const solveOperation = params => {
  let calculation = {}
  let result = 0;
  switch (params.operacion) {
    case 'suma':
     result = Number(params.num1) + Number(params.num2);
    break;
    case 'resta':
     result = params.num1 - params.num2
    break;
    case 'multiplicacion':
     result = params.num1 * params.num2
    break;
    case 'division':
     result = params.num1 / params.num2
    break;
  }
  calculation = Object.assign(params);
  calculation.resultado = result;

  return calculation;
}

const validParameters = params => {
  let validOperations = ['suma', 'resta', 'division', 'multiplicacion'];
  if (!validOperations.includes(params.operacion)){
    return false
  }
  if (isNaN(params.num1) || isNaN(params.num2)){
    return false
  }
  return true
}

app.get('/', (req, res) => {
    res.send(getMessageHours())
  })

app.get('/random', (req, res) => {
  res.send(randomStadistic(1,20,10000))
})

app.get('/info', (req, res) => {
  readFile('package.json').then(obj => res.send(obj));
})

app.get('/operaciones', (req, res) => {
  if (validParameters(req.query)){
    res.send(solveOperation(req.query));
  }
  else{
    res.send({"error": {
      "num1": { "valor": req.query.num1, "tipo": typeof(req.query.num1) },
      "num2": { "valor": req.query.num2, "tipo": typeof(req.query.num2) },
      "operacion": { "valor": req.query.operacion, "tipo": typeof(req.query.operacion) }
      } 
    });
  }
})

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
})