import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

function Square(props) {
  return (
    <button
      className={(props.isWinner) ? "winning-square square" : "square"}
      onClick={props.onClick}
      style={{
			borderRight: (props.location % 3 == 2) ? "none" : "inherited",
			borderTop: (props.location < 3) ? "none" : "inherited",
			borderBottom: (props.location > 4) ? "none" : "inherited",
			borderLeft: (props.location % 3 == 0) ? "none" : "inherited"
		}}
    >
      {props.value}
    </button>
  );
}

function Board(props) {
  function renderSquare(i, isWinner) {
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
		  location={i}
        isWinner={isWinner}
      />
    );
  }

  const rows = [];
  for(let i=0; i<3; i++) {
    const squares = [];
    for(let j=0; j<3; j++) {
      squares.push(renderSquare(i*3 + j, props.winner.includes(i*3 + j)))
    }
    rows.push(<div className="board-row">{squares}</div>)
  }

  return (
    <div>{rows}</div>
  );
}

function Game(props) {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null)
  }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(newHistory.concat([{
        squares: squares
    }]));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  }

  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  }

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';

    const isHistorySelected = (move == stepNumber && move != history.length - 1) ? "history-selected" : "";
    return (
      <li key={move}>
        <span onClick={() => jumpTo(move)} className={isHistorySelected}>{desc}</span>
      </li>
    );
  });

  let status;
  if (winner) {
    status = 'Winner: ' + current.squares[winner[0]];
  } else if(stepNumber > 8) {
    status = 'Cats game.  No winner.'
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
	 <div>
		<div className="game-header">
		  React-<span className="game-header-middle">Tac</span>-Toe
	   </div>
		 <div className="game">
		   <div className="game-board">
		     <Board
		       squares={current.squares}
		       onClick={(i) => handleClick(i)}
		       winner={(winner === null) ? [] : winner }
		     />
		   </div>
		   <div className="game-info">
		     <div>{status}</div>
		     <ol>{moves}</ol>
		   </div>
		 </div>
 	 </div>
  );
}

// ========================================

ReactDOM.render(
   <Game />,
   document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
