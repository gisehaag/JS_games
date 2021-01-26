class Game {
	constructor(config) {
		// const configDefaults = {
		// }

		// this.config = Object.assign(configDefaults, config);
		this.game = document.querySelector('.game');
		this.board = this.game.querySelector('.board');
		this.message = this.game.querySelector('.message');
		this.resetButton = this.game.querySelector('.reset');
		this.cells = this.board.querySelectorAll('.cell');

		this.giseTurn = false;
		this.moves = [];
		this.myMoves = [];
		this.playerMoves = [];
		this.playerColumns = [];
		this.myColumns = [];
		this.playerRows = [];
		this.myRows = [];

		this.allCells = ['a1', 'b1', 'c1', 'a2', 'b2', 'c2', 'a3', 'b3', 'c3'];

		// this.displayTemplate();
		this.addEvents();

	}

	addEvents() {
		this.cells.forEach((cell) => {
			cell.addEventListener('click', this.round.bind(this))
		})
	}

	round(e) {
		let cell = e.currentTarget;
		let lastMove = cell.dataset.cellid;

		if (this.playerMoves.includes(lastMove) || this.myMoves.includes(lastMove)) {
			alert('Ya jugaste ese casillero, elegí otro porfa 😏');
			return;
		}

		this.playerMove(lastMove, cell);
		if (this.giseTurn) this.giseMove(lastMove);
	}


	playerMove(lastMove, cell) {
		this.giseTurn = false;
		cell.innerHTML = `<i class="icon-star-empty"></i>`;
		this.playerMoves.push(lastMove);
		this.playerColumns.push(cell.dataset.column);
		this.playerRows.push(cell.dataset.row);

		this.moves.push(lastMove);

		if (this.playerMoves.length >= 3) {
			if (!this.isWinningCase(this.playerColumns, this.playerRows, this.playerMoves)) {
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

		if (!(lastMove == 'b2') && !(this.myMoves.length > 0)) {
			myMove = 'b2';
		} else {
			this.allCells.forEach((posibility) => {
				if (!this.moves.includes(posibility)) {
					posibleMove.push(posibility);
				}
			})

			let positionPosibleMove = Math.round(Math.random() * (posibleMove.length - 1));
			myMove = posibleMove[positionPosibleMove];
		}

		let cell = this.board.querySelector(`#${myMove}`);

		cell.innerHTML = `<i class="icon-earth"></i>`;
		this.moves.push(myMove);
		this.myMoves.push(myMove);
		this.myColumns.push(cell.dataset.column);
		this.myRows.push(cell.dataset.row);

		if (this.myMoves.length >= 3) {
			console.log(this.isWinningCase(this.myColumns, this.myRows, this.myMoves));
		}
	}

	resetBoard() {
		this.cells.forEach((cell) => cell.innerHTML = ``);
	}

	isWinningCase(columns, rows, moves) {

		let columnA = 0;
		let columnB = 0;
		let columnC = 0;
		let row1 = 0;
		let row2 = 0;
		let row3 = 0;

		columns.forEach(column => {
			if ('a' == column) columnA += 1;
			if ('b' == column) columnB += 1;
			if ('c' == column) columnC += 1;
		})

		rows.forEach(row => {
			if ('1' == row) row1 += 1;
			if ('2' == row) row2 += 1;
			if ('3' == row) row3 += 1;
		})

		if (columnA >= 3 ||
			columnB >= 3 ||
			columnC >= 3 ||
			row1 >= 3 ||
			row2 >= 3 ||
			row3 >= 3) {

			this.displayMessage();
			return true;
		}

		if (moves.includes('a1') && moves.includes('b2') && moves.includes('c3')) {
			this.displayMessage();
			return true;
		}

		if (moves.includes('c1') && moves.includes('b2') && moves.includes('a3')) {
			this.displayMessage();
			return true;
		}
	}

	displayMessage() {
		let winningMessage = !(this.giseTurn) ? 'Felicitaciones! Me ganaste!' : 'No te preocupes, te doy la revancha!';

		this.message.innerHTML = winningMessage;
		console.log(this.resetButton.classList);
		this.resetButton.classList.remove('hidden');
	}
}


let game = new Game();




















