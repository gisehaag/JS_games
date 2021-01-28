class Game {
	constructor() {
		this.game = document.querySelector('.game');
		this.giseTurn = false;
		this.gameActive = true;

		this.cellDefination();
		this.resetScores();
		this.assignElements();
		this.addEvents();
	}

	cellDefination() {
		this.allCells = ['a1', 'b1', 'c1', 'a2', 'b2', 'c2', 'a3', 'b3', 'c3'];
		this.corners = ['a1', 'c1', 'a3', 'c3'];
		this.diagonalA1C3 = ['a1', 'b2', 'c3'];
		this.diagonalA3C1 = ['a3', 'b2', 'c1'];
		this.center = 'b2';
		this.lastMove = '';
	}

	opositeCorner() {
		let oposites = {
			'a1': 'c3',
			'a3': 'c1',
			'c1': 'a3',
			'c3': 'a1',
		}

		return oposites[this.lastMove];
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
			this.lastMove = cell.dataset.cellId;
			let lastColumn = this.lastMove[0];
			let lastRow = this.lastMove[1];

			if (this.playerMoves.cell.includes(this.lastMove) || this.myMoves.cell.includes(this.lastMove)) {
				alert('Ya jugaste ese casillero, elegí otro porfa 😏');
				return;
			}

			this.playerMove(lastColumn, lastRow, cell);

			setTimeout(() => {
				if (this.giseTurn) this.giseMove();
			}, 300)
		}
	}

	playerMove(lastColumn, lastRow, cell) {
		this.giseTurn = false;
		cell.innerHTML = `<i class="icon-star-empty"></i>`;

		this.movesDone.push(this.lastMove);

		if (!this.cornersUsed.includes(this.lastMove)) this.cornersUsed.push(this.lastMove);

		this.playerMoves.cell.push(this.lastMove);
		this.playerMoves.columns[lastColumn] += 1;
		this.playerMoves.rows[lastRow] += 1;

		if (this.playerMoves.cell.length >= 3) {
			if (!this.isWinningCase() && this.gameActive) {
				this.giseTurn = true;
			};
		} else {
			this.giseTurn = true;
		}
	}

	giseMove() {
		this.giseTurn = true;
		let myMove = this.defineMyMove();
		let cell = this.board.querySelector(`#${myMove}`);

		cell.innerHTML = `<i class="icon-earth"></i>`;

		this.movesDone.push(myMove);

		this.myMoves.cell.push(myMove);
		this.myMoves.columns[cell.dataset.cellId[0]] += 1;
		this.myMoves.rows[cell.dataset.cellId[1]] += 1;

		if (this.diagonalA1C3.includes(myMove)) this.myMoves.myDiagonalA1.push(myMove);
		if (this.diagonalA3C1.includes(myMove)) this.myMoves.myDiagonalA3.push(myMove);

		if (this.myMoves.cell.length >= 3) this.isWinningCase();
	}

	defineMyMove() {
		let posibleMove = [];
		let myMove = '';

		this.allCells.forEach((posibility) => {
			if (!this.movesDone.includes(posibility)) {
				posibleMove.push(posibility);
			}
		})

		function filterCell(key) {
			return posibleMove.filter((move) => { return move.indexOf(key) > -1 })
		}

		if (!myMove) {
			if (this.myMoves.myDiagonalA1.length == 2) {
				this.diagonalA1C3.forEach(element => {
					if (!this.myMoves.myDiagonalA1.includes(element) && posibleMove.includes(element)) myMove = element;
				})
			}

			if (this.myMoves.myDiagonalA3.length == 2) {
				this.diagonalA3C1.forEach(element => {
					if (!this.myMoves.myDiagonalA3.includes(element) && posibleMove.includes(element)) myMove = element;
				})
			}
		}

		if (!myMove) {
			for (let key in this.myMoves.columns) {
				if (this.myMoves.columns[key] >= 2) {
					if (!this.movesDone.includes(filterCell(key)[0])) {
						myMove = filterCell(key)[0];
					};
				}
			}
		}

		if (!myMove) {
			for (let key in this.myMoves.rows) {
				if (this.myMoves.rows[key] >= 2) {
					if (!this.movesDone.includes(filterCell(key)[0])) {
						myMove = filterCell(key)[0];
					};
				}
			}
		}

		if (!myMove) {
			if (!(this.lastMove == this.center) && !(this.myMoves.cell.length > 0)) {
				if (!this.movesDone.includes(this.center)) {
					myMove = this.center;
				};
			}
		}

		if (!myMove) {
			for (let key in this.playerMoves.columns) {
				if (this.playerMoves.columns[key] >= 2) {
					if (!this.movesDone.includes(filterCell(key)[0])) {
						myMove = filterCell(key)[0];
					};
				}
			}
		}

		if (!myMove) {
			for (let key in this.playerMoves.rows) {
				if (this.playerMoves.rows[key] >= 2) {
					if (!this.movesDone.includes(filterCell(key)[0])) {
						myMove = filterCell(key)[0];
					};
				}
			}
		}

		if (!myMove) {
			if (this.cornersUsed.includes(this.lastMove)) {
				let opositeCorner = this.opositeCorner();

				if (!this.movesDone.includes(opositeCorner) && this.movesDone.includes(this.center)) {
					myMove = opositeCorner;
				};
			}
		}

		if (!myMove) {
			let myPosibleMove = Math.round(Math.random() * ((posibleMove.length) - 1));
			myMove = posibleMove[myPosibleMove];
		}

		return myMove;
	}

	resetBoard() {
		this.cells.forEach((cell) => cell.innerHTML = ``);
	}

	isWinningCase() {
		if (this.movesDone.length == 9) {
			this.displayMessage();
			this.message.innerHTML = 'Me diste pelea, pero qué hermoso empate! 😆';
			return;
		}

		let winnerMoves = (this.giseTurn) ? this.myMoves : this.playerMoves;
		let { cell, columns, rows } = winnerMoves;

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

		if (this.diagonalA1C3.every(i => cell.includes(i))) {
			this.displayMessage();
			return true;
		}

		if (this.diagonalA3C1.every(i => cell.includes(i))) {
			this.displayMessage();
			return true;
		}
	}

	displayMessage() {
		let winningMessage = !(this.giseTurn) ? 'Felicitaciones! Me ganaste!' : 'No te preocupes, te doy la revancha! 😎';

		this.message.innerHTML = winningMessage;
		this.resetButton.classList.remove('hidden');
		this.gameActive = false;
	}

	resetScores() {
		this.movesDone = [];
		this.cornersUsed = [];

		this.myMoves = {
			cell: [],
			corners: [],
			myDiagonalA1: [],
			myDiagonalA3: [],
			columns: {
				"a": 0,
				"b": 0,
				"c": 0,
			},
			rows: {
				"1": 0,
				"2": 0,
				"3": 0,
			},
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




















