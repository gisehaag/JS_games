class Game {
	constructor(config) {
		// const configDefaults = {
		// }

		// this.config = Object.assign(configDefaults, config);
		this.game = document.querySelector('.game');
		this.giseTurn = false;
		this.gameActive = true;

		this.allCells = ['a1', 'b1', 'c1', 'a2', 'b2', 'c2', 'a3', 'b3', 'c3'];

		this.resetScores();
		this.assignElements();
		this.addEvents();
	}

	assignElements() {
		this.board = this.game.querySelector('.board');
		this.message = this.game.querySelector('.message');
		this.resetButton = this.game.querySelector('.reset');
		this.cells = this.board.querySelectorAll('.cell');
	}

	addEvents() {
		this.cells.forEach((cell) => {
			cell.addEventListener('click', this.round.bind(this));
		})

		this.resetButton.addEventListener('click', this.resetGame.bind(this));
	}

	round(e) {
		if (this.gameActive) {
			let cell = e.currentTarget;
			let lastMove = cell.dataset.cellId;
			let lastColumn = lastMove[0];
			let lastRow = lastMove[1];

			if (this.playerMoves.cell.includes(lastMove) || this.myMoves.cell.includes(lastMove)) {
				alert('Ya jugaste ese casillero, elegí otro porfa 😏');
				return;
			}

			this.playerMove(lastMove, lastColumn, lastRow, cell);

			if (this.giseTurn) this.giseMove(lastMove);
		}
	}


	playerMove(lastMove, lastColumn, lastRow, cell) {
		this.giseTurn = false;
		cell.innerHTML = `<i class="icon-star-empty"></i>`;

		this.movesDone.push(lastMove);

		this.playerMoves.cell.push(lastMove);
		this.playerMoves.columns[lastColumn] += 1;
		this.playerMoves.rows[lastRow] += 1;

		if (this.playerMoves.cell.length >= 3) {
			if (!this.isWinningCase()) {
				this.giseTurn = true;
			};
		} else {
			this.giseTurn = true;
		}
	}

	giseMove(lastMove) {
		this.giseTurn = true;
		let posibleMove = [];
		let myMove = '';

		if (!(lastMove == 'b2') && !(this.myMoves.cell.length > 0)) {
			myMove = 'b2';
		} else {
			this.allCells.forEach((posibility) => {
				if (!this.movesDone.includes(posibility)) {
					posibleMove.push(posibility);
				}
			})

			let positionPosibleMove = Math.round(Math.random() * (posibleMove.length - 1));
			myMove = posibleMove[positionPosibleMove];
		}

		let cell = this.board.querySelector(`#${myMove}`);

		cell.innerHTML = `<i class="icon-earth"></i>`;
		this.movesDone.push(myMove);

		this.myMoves.cell.push(myMove);

		this.myMoves.columns[cell.dataset.column] += 1;
		this.myMoves.rows[cell.dataset.row] += 1;

		if (this.myMoves.length >= 3) this.isWinningCase();
	}

	resetBoard() {
		this.cells.forEach((cell) => cell.innerHTML = ``);
	}

	isWinningCase() {
		let winnerMoves = (this.giseTurn) ? this.myMoves : this.playerMoves;
		let cell = winnerMoves.cell;
		let columns = winnerMoves.columns;
		let rows = winnerMoves.rows;

		for (let key in columns) {
			if (columns[key] == 3) {
				this.displayMessage();
				return true;
			}
		}

		for (let key in rows) {
			if (rows[key] == 3) {
				this.displayMessage();
				return true;
			}
		}

		if (cell.includes('a1') && cell.includes('b2') && cell.includes('c3')) {
			this.displayMessage();
			return true;
		}

		if (cell.includes('c1') && cell.includes('b2') && cell.includes('a3')) {
			this.displayMessage();
			return true;
		}
	}

	displayMessage() {
		let winningMessage = !(this.giseTurn) ? 'Felicitaciones! Me ganaste!' : 'No te preocupes, te doy la revancha!';

		this.message.innerHTML = winningMessage;
		this.resetButton.classList.remove('hidden');
		this.gameActive = false;
	}

	resetScores() {
		this.movesDone = [];

		this.myMoves = {
			cell: [],
			columns: {
				"a": 0,
				"b": 0,
				"c": 0,
			},
			rows: {
				"1": 0,
				"2": 0,
				"3": 0,
			}
		};

		this.playerMoves = {
			cell: [],
			columns: {
				"a": 0,
				"b": 0,
				"c": 0,

			},
			rows: {
				"1": 0,
				"2": 0,
				"3": 0,
			}
		};
	}

	resetGame() {
		this.message.innerHTML = '';
		this.resetButton.classList.add('hidden');
		this.gameActive = true;

		this.resetBoard();
		this.resetScores();
	}
}


let game = new Game();




















