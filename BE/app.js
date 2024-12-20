import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(endpoints);
});

app.get('/roulette-number', (req, res) => {
  const rouletteNumber = Math.floor(Math.random() * 37);
  res.send({ rouletteNumber });
});

app.post('/roulette-bet', (req, res) => {
  const { bet } = req.body; 

  const rouletteNumber = Math.floor(Math.random() * 37);
  const rouletteColor = rouletteNumber === 0 ? 'green' : rouletteNumber % 2 === 0 ? 'black' : 'red';

  let result;
  switch (bet.type) {
    case 'number':
      result = bet.value === rouletteNumber;
      break;
    case 'color':
      result = bet.value === rouletteColor;
      break;
    case 'range':
      result = Array.isArray(bet.value) && bet.value.length === 2 &&
        rouletteNumber >= bet.value[0] && rouletteNumber <= bet.value[1];
      break;
    default:
      return res.status(400).send({ error: 'Invalid bet type' });
  }

  res.send({
    bet,
    rouletteNumber,
    rouletteColor,
    result: result ? 'win' : 'not win',
  });
});

app.listen(9092, () => {
  console.log('Server is running on port 9092');
});
