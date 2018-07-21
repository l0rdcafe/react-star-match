import React from "react";
import ReactDOM from "react-dom";
import { colors, randomSum, diff } from "./utils";
import "./style.css";

class Number extends React.PureComponent {
    clickHandler = () => {
        if (this.props.status !== "used") {
            this.props.onClick(this.props.number)
        }
    }
    render() {
        return (
            <button className="number" onClick={this.clickHandler} style={{ backgroundColor: colors[this.props.status] }}>{this.props.number}</button>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
      super(props);
      const nums = Array.from({length: 9}).map((_, n) => n + 1);
      const stars = Array.from({length: randomSum(nums, 9)});

      this.state = {
          selectedNums: [],
          usedNums: [],
          selectionIsWrong: false,
          score: 0,
          isGameWon: false
      };

      Object.assign(this.state, {nums, stars});
      this.gameOverTimeout();
    }
    numberStatus(num) {
        if (this.state.usedNums.indexOf(num) >= 0) {
            return "used";
        }

        const isSelected = this.state.selectedNums.indexOf(num) >= 0;

        if (isSelected) {
            return this.state.selectionIsWrong ? "wrong" : "selected";
        }

        return "available";
    }
    onNumberClick = (num) => {
        this.setState(prevState => {
            let {
                selectedNums,
                usedNums,
                stars,
                nums,
                score,
                isGameWon
            } = prevState;

            if (selectedNums.indexOf(num) >= 0) {
                selectedNums = selectedNums.filter(n => n !== num);
            } else {
                selectedNums = [...selectedNums, num];
            }

            const selectedSum = selectedNums.reduce((a, b) => a + b, 0);

            if (selectedSum === stars.length) {
                usedNums = [...usedNums, ...selectedNums];
                selectedNums = [];
                stars = Array.from({length: randomSum(diff(nums, usedNums), 9)});
            }

            const gameIsDone = usedNums.length ===  nums.length;

            if (gameIsDone) {
                score += 1;
                isGameWon = true;
            }

            return {
                selectedNums,
                usedNums,
                stars,
                selectionIsWrong: selectedSum > stars.length,
                gameIsDone: usedNums.length === nums.length,
                score,
                isGameWon
            };
        });
    }
    renderStars() {
        return (
            this.state.stars.map((_, n) => <div key={`star_${n}`} className="star" />)
        )
    }
    resetGame = () => {
        this.setState(prevState => {
            const {nums} = prevState;
            const stars = Array.from({length: randomSum(nums, 9)});

            return {
                stars,
                selectedNums: [],
                usedNums: [],
                gameIsDone: false,
                nums
            };
        });
        this.gameOverTimeout();
    }
    gameOverTimeout() {
        setTimeout(() => {
            this.setState({
                gameIsDone: true,
                isGameWon: false
            });
        }, 25000);
    }
    renderLostGame() {
        return (<div className="game-done"><div className="message">Game Over!</div>
        <button onClick={this.resetGame}>Play Again</button></div>);
    }
    renderWonGame() {
        return (<div className="game-done"><div className="message">Nice!</div>
        <button onClick={this.resetGame}>Play Again</button></div>);
    }
    renderPlayAgain = () => {
        return (
            this.state.isGameWon ? this.renderWonGame() : this.renderLostGame()
        );
    }
    render() {
        return (
            <div className="game">
              <div className="help">
                Pick 1 or more numbers that sum to the number of stars
              </div>
              <div className="score">Score: {this.state.score}</div>
              <div className="body">
                <div className="stars">
                  {this.state.gameIsDone ? this.renderPlayAgain() : this.renderStars()}
                </div>
                <div className="play-numbers">
                  {this.state.nums.map(n => {
                    const isUsed = this.state.usedNums.indexOf(n) >= 0;
                    const isSelected = this.state.selectedNums.indexOf(n) >= 0;
                    return <Number key={n} number={n} status={this.numberStatus(n)} isUsed={isUsed} isSelected={isSelected} onClick={this.onNumberClick} selectionIsWrong={this.state.selectionIsWrong} />
                  })}
                </div>
              </div>
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById("root"));