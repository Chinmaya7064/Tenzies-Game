import { createContext, useEffect, useState } from "react";
import "./App.css";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import ReactSwitch from "react-switch";

export const ThemeContext = createContext(null);

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [start, setStart] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [roll, setRoll] = useState(0);
  const [theme, setTheme] = useState("dark");

//Theme Mode start
const toggleTheme = () => {
  setTheme((curr) => (curr === "light" ? "dark" : "light"));
}
//Theme Mode End


// Timer start
  if (seconds > 59) {
    setSeconds(0)
    setMinutes(minute => minute + 1)
  }
  if (minutes > 59) {
    setMinutes(0)
    setHours(hour => hour + 1)
  }
  if (hours > 23) {
    setSeconds(0)
    setMinutes(0)
    setHours(0)
  }

  useEffect(() => {
    let timer = setInterval(() => {
      if (start) {
        return
      }
      if (tenzies) {
        return
      }
      setSeconds(second => second + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [!start, !tenzies])
// Timer End

// Dice function start
  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld == true);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  });

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (tenzies) {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setStart(false);
      setDice(allNewDice());
      setRoll(0);
    }

    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRoll(x => x + 1)
    } else {
      setTenzies(false);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    // setStart(true)
    if (tenzies){
      return
    }
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElement = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));
// Dice function End


  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
          <div className="main" id={theme}>
          {tenzies && <Confetti />}
        {!start && <h1 className="title">Tenzies</h1>}
          <div className="switch">
            <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
          </div>
          {!start && (
            <p className="instructions">
              Roll until all dice are the same. Click each die to freeze it at its
              current value between rolls.
            </p>
          )}

          {!start && (
            <div className="start-menu">
              <h1 className="timer">
                Time {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </h1>
              <h1 className="count-roll">Count: {roll}</h1>
            </div>
          )}

          {/* <div>
            <ReactSwitch className="switch" />
          </div> */}
          
          <div className="dice-container">{diceElement}</div>
          <button className="roll-dice" onClick={rollDice}>
            {tenzies ? "New Game" : "Roll"}
          </button>
        </div>
    </ThemeContext.Provider>
  );
}

export default App;
