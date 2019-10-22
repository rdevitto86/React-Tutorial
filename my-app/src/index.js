import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * @see https://reactjs.org/tutorial/tutorial.html#setup-option-2-local-development-environment
 */

/**
 * @function Square
 * @description - function componenet tthat renders a Square
 * @param {Object} props - map of object properties
 * @returns {JSX}
 */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/**
 * @class
 * @description - react component that renders the game board
 */
class Board extends React.Component {
    /**
     * @function Board#renderSquare
     * @description - renders a new Square component on the UI
     * @param {number} i - index of square
     * @returns {Square} - new square component
     */
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
      }

    /**
     * @function Board#render
     * @description - renders a Board component
     * @returns {JSX}
     * @see calculateWinner
     */
    render() {
        return (
            <div>
                <div className="board-row">
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
                </div>
            </div>
        );
    }
}

/**
 * @class
 * @description - react component that renders the game
 */
class Game extends React.Component {
    /**
     * @constructor
     * @description - builds a new Game component with properties
     * @param {Objcet} props - map of properties to set
     */
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(9).fill(null) }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    /**
     * @function Game#handleClick
     * @description - handles post-processing of a square. Calculates game state after.
     * @param {Number} i - index of a given Square component
     */
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1); //all game history
        const current = history[history.length - 1]; //get current game state/moves
        const squares = current.squares.slice(); //creates a mirrored copy of the state (immutable var)

        //check if a player has won the game already OR space has already been filled
        if(calculateWinner(squares) || squares[i]) {
            return; //void current square click
        }

        //update posistion where a user clicked (with letter)
        squares[i] = (this.state.xIsNext) ? 'X' : 'O';

        //set the new state (React function)
        this.setState({
            history: history.concat([{ squares: squares }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
          });
    }

    /**
     * @function Game#jumpTo
     * @description - sets a new state after every game history time travel
     * @param {Number} step - the step number to revert to
     */
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    /**
     * @function Game#render
     * @description - renders a Game component
     * @returns {JSX}
     */
    render() {
        const history = this.state.history; //fetch game history (immutable var)
        const current = history[this.state.stepNumber]; //get current game state/moves
        const winner = calculateWinner(current.squares); //determine if a player has won

        //calculates the title text
        const status = (winner) 
            ? 'Winner: ' + winner 
            : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')

        //maps a list of previous game states
        const moves = history.map((step, move) => {
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        { (move) ? 'Go to move #' + move : 'Go to game start' }
                    </button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

/**
 * @global
 * @function calculateWinner
 * @description - helper function that determines if a player won the game
 * @param {Array} squares 
 * @returns {}
 */
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5],
        [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    //loop over every scenario to determine if a player won
    for (let i = 0, len = lines.length; i < len; i++) {
        // parses each sub-array into three variables of the same values 
        // EXAMPLE: [ const [a,b,c] = [1,4,7] ] => const a=1, const b=4, const c=7
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

//render the Game component on the index/root file
ReactDOM.render( 
    <Game/>, document.getElementById('root') 
);