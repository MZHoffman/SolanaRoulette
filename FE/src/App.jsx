import React, { useState } from 'react';

const RouletteBet = () => {
  const [betType, setBetType] = useState('number');
  const [betValue, setBetValue] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleBetTypeChange = (event) => {
    setBetType(event.target.value);
    setBetValue('');
    setResult(null);
    setError(null);
  };

  const handleBetValueChange = (event) => {
    setBetValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult(null);
    setError(null);

    let parsedValue;

    if (betType === 'number') {
      parsedValue = parseInt(betValue);
      if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 36) {
        setError('Please enter a valid number between 0 and 36.');
        return;
      }
    } else if (betType === 'color') {
      parsedValue = betValue.toLowerCase();
      if (!['red', 'black', 'green'].includes(parsedValue)) {
        setError("Please enter 'red', 'black', or 'green'.");
        return;
      }
    } else if (betType === 'range') {
      const range = betValue.split(',').map((num) => parseInt(num.trim()));
      if (range.length !== 2 || range.some(isNaN) || range[0] >= range[1]) {
        setError(
          'Please enter a valid range as two numbers separated by a comma (e.g., 1,18).'
        );
        return;
      }
      parsedValue = range;
    }

    const bet = { type: betType, value: parsedValue };

    try {
      const response = await fetch('http://localhost:9092/roulette-bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bet }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to place bet. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <h1>Roulette Bet</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='bet-type'>Bet Type:</label>
        <select
          id='bet-type'
          value={betType}
          onChange={handleBetTypeChange}
          style={{ marginLeft: '10px', marginBottom: '10px' }}
        >
          <option value='number'>Number</option>
          <option value='color'>Color</option>
          <option value='range'>Range</option>
        </select>
        <br />

        <label htmlFor='bet-value'>Bet Value:</label>
        <input
          id='bet-value'
          type='text'
          value={betValue}
          onChange={handleBetValueChange}
          placeholder={
            betType === 'number'
              ? 'Enter a number (0-36)'
              : betType === 'color'
              ? "Enter 'red', 'black', or 'green'"
              : 'Enter a range (e.g., 1,18)'
          }
          style={{ marginLeft: '10px', marginBottom: '10px' }}
        />
        <br />

        <button type='submit'>Place Bet</button>
      </form>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <strong>Roulette Result:</strong>
          <br />
          Number: {result.rouletteNumber}
          <br />
          Color: {result.rouletteColor}
          <br />
          <strong>{result.result.toUpperCase()}</strong>
        </div>
      )}
    </div>
  );
};

export default RouletteBet;
