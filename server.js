import express from 'express';
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

app.get('/', (req, res) => {
    res.send(getMessageHours())
  })

app.get('/random', (req, res) => {
  res.send(randomStadistic(1,20,10000))
})

app.get('/info', (req, res) => {
  res.send()
})

  


app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
})