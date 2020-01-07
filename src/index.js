import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     //게임 상태 필요없음
//     // constructor(props) {
//     //     super(props);
//     //     this.state = {
//     //         value: null,
//     //     };
//     // }
//     render() {
//       return (
//         <button 
//         className="square" 
//         onClick={() => this.props.onClick()}
//         >
//           {this.props.value}
//         </button>
//       );
//     }
//   }
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
  class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // }
    
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
     );
    }
  
    render() {
        //improvements no.3 Use two loops to make the squares
      const boardSize = 3;
      let squares = [];
      for(let i=0; i<boardSize; ++i) {
          let row = [];
          for(let j=0; j<boardSize; ++j) {
              row.push(this.renderSquare(i * boardSize + j));
          }
          squares.push(<div key={i} className="board-row">{row}</div>);
      }
  
      return (
        <div>
            {squares}
         {/* <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div> */}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              history: [{
                  squares: Array(9).fill(null),
              }],
              stepNumber: 0,
              xIsNext:true,
              isAscending: true
          };
      }
      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                //https://github.com/kelanwu/react-tic-tac-toe
                //improvements no.1 Display the location for each move
                latestMoveSquare: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }  
    handleSortToggle() {
        this.setState({
          isAscending: !this.state.isAscending
        });
    }
    render() {
      const history = this.state.history;
      const stepNumber = this.state.stepNumber;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const isAscending = this.state.isAscending;

      let moves = history.map((step, move) => {
          //improvements no.1
          const latestMoveSquare = step.latestMoveSquare;
          const col = 1 + latestMoveSquare % 3;
          const row = 1 + Math.floor(latestMoveSquare / 3);
          const desc = move ?
          `Go to move #${move} (${col}, ${row})` :
          'Go to game start';
      return (

          //improvements no.2 Bold the currently selected item
          <li key={move}>
              {/* <button onClick={() => this.jumpTo(move)}>{desc}</button> */}
              <button
              className={move === stepNumber ? 'move-list-item-selected' : ''}
              onClick={() => this.jumpTo(move)}>{desc}
              </button>
          </li>
        );
      });

      let status;
      if (winner) {
          status = 'Winner 승자: ' + winner;
      } else {
          status = 'Next player 다음 순서 ' + (this.state.xIsNext ? 'X' : 'O');
      }

        //improvements no.4 Add a toggle button for sorting
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.handleSortToggle()}>
                {isAscending ? 'descending' : 'ascending'}
            </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
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
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  