var game = require("./game");

module.exports.start = function(pass, fail) {
    game.startGame(function(currentGame){
	currentGame.message = "Pick heads or tails";
	pass(game);
    }, fail);
}

module.exports.play = function(currentGame, pass, fail) {
    var guess = currentGame.guess;

    console.log("The user guessed " + guess);
    if(guess != "heads" && guess != "tails") {
	fail({message : "Invalid guess, try again"});
	return;
    }

    var coinFlip = game.flipCoin();

    console.log("The coin flip was " + coinFlip);
    var winner = coinFlip == guess;
    var message = winner ? "Congratulations, you win!" : "Sorry, you lose.";
    game.endGame(currentGame.gameId, message, function(){
	pass(message);
    }, fail);
}

module.exports.end = function(cb) {
    game.endGame(cb);
}
