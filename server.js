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

app.get('/', (req, res) => {
    res.send(getMessageHours())
  })

app.get('/random', (req, res) => {
  res.send(getMessageHours())
})

  


app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
})