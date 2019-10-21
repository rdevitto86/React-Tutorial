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
     * @constructor
     * @description - builds a new Board component with properties
     * @param {Objcet} props - map of properties to set
     */
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true
        }
    }

    /**
     * @function Board#handleClick
     * @description - handles onClick events from a child Square component
     * @param {Number} i - index of a given Square component
     */
    handleClick(i) {
        const squares = this.state.squares.slice(); //creates a mirrored copy of the state

        //check if a player has won the game already OR space has already been filled
        if(calculateWinner(squares) || squares[i]) {
            return; //void current square click
        }
        squares[i] = (this.state.xIsNext) ? 'X' : 'O'; //update the 'new' state

        this.setState({
            squares: squares, xIsNext: !this.state.xIsNext
        });
    }

    /**
     * @function Board#renderSquare
     * @description - renders a new Square component on the UI
     * @param {number} i - index of square
     * @returns {Square} - new square component
     */
    renderSquare(i) {
        return (
            <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />
        );
    }

    /**
     * @function Board#render
     * @description - renders a Board component
     * @returns {JSX}
     * @see calculateWinner
     */
    render() {
        const winner = calculateWinner(this.state.squares);
        const status = (winner) ? 'Winner: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
            <div>
                <div className="status">{status}</div>
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
     * @function Game#render
     * @description - renders a Game component
     * @returns {JSX}
     */
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

//render the Game component on the index/root file
ReactDOM.render( 
    <Game/>, document.getElementById('root') 
);

/**
 * @global
 * @function calculateWinner
 * @description - helper function that determines if a player won the game
 * @param {*} squares 
 * @returns {}
 */
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

  //loop over every scenario to determine if a player won
  for (let i = 0, len = lines.length; i < len; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}