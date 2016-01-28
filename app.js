$.fn.puissance4 = function(options){

  this.each(function(){
    var game = $(this);
    var turn = 1;

    var settings = $.extend({
      x: 7,
      y: 6
    }, options);


    /* Création d'un array multidimensionnel.
       Pour chaque clé du tableau parent, un tableau corresponsant à une ligne en valeur.
       0 => Pas de pièce
       1 => Une pièce jaune
       2 => Une pièce rouge
    [
      [0, 1, 0, 0, ...],
      [0, 2, 2, 0, ...],
      [0, 1, 1, 0, ...],
      ...
    ]
    */
    var gameArray=[];
    for(var i=0; i<settings.y; i++){
      var row = [];
      for(var j=0; j<settings.x; j++){
        row.push(0);
      }
      gameArray.push(row)
    }


    var canPlace = function(y, x){
      // Si aucune pièce n'est placée && On pose sur la première ligne || Il y a une pièce sur la ligne du dessous.
      return (gameArray[y][x] == 0) && (y == 0 || gameArray[y-1][x] != 0);
    }

    var horizontalWin = function(){
      var win = false;
      for (var i = 0; i < gameArray.length; i++) {
        for (var j = 0; j < gameArray[i].length; j++) {
          if(
            gameArray[i][j] != 0 && // Une pièce est placée
            gameArray[i].length - j >= 4 // Il y a encore assez de place à droite pour poser 3 autres pièces.
          ){
            player = gameArray[i][j]; // Le joueur à qui appartient la pièce (1 ou 2)
            for (var k = 1; k <= 3; k++) { // Une boucle qui tourne 3 fois
              if(gameArray[i][j+k] != player && k < 3){ // Si l'une des 2 pièces qui suivent n'appartient pas au joueur
                break;
              }
              if(k == 3 && gameArray[i][j+k] == player){ // Si les 2 pièces qui suivent appartiennet au joueur et la 3ème aussi
                win = true;
              }
            }
          }
        }
      }
      return win;
    }

    var verticalWin = function(){
      var win = false
      for (var i = 0; i < gameArray.length; i++) {
        for (var j = 0; j < gameArray[i].length; j++) {
          if(
            gameArray[i][j] != 0 && // Une pièce est placée
            gameArray.length - i >= 4 // Il y a encore assez de place en haut pour poser 3 autre pièces
          ){
            player = gameArray[i][j]; // Le joueur à qui appartient la pièce (1 ou 2)
            for (var k = 1; k <= 3; k++) { // Une boucle qui tourne 3 fois
              if(gameArray[i+k][j] != player && k < 3){ // Si l'une des 2 pièces qui suivent n'appartient pas au joueur
                break;
              }
              if(k == 3 && gameArray[i+k][j] == player){ // Si les 2 pièces qui suivent appartiennet au joueur et la 3ème aussi
                win = true;
              }
            }
          }
        }
      }
      return win;
    }

    var diagonalWin = function(){
      var win = false
      for (var i = 0; i < gameArray.length; i++) {
        for (var j = 0; j < gameArray[i].length; j++) {
          if(
            gameArray[i][j] != 0 && // Une pièce est placée
            gameArray[i].length - j >= 4 // Il y a encore assez de place à droite pour poser 3 autre pièces
          ){
            player = gameArray[i][j]; // Le joueur à qui appartient la pièce (1 ou 2)

            // Premier check pour les diagonal en partant du bas
            for (var k = 1; k <= 3; k++) { // Une boucle qui tourne 3 fois
              if(gameArray[i+k][j+k] != player && k < 3){ // Si l'une des 2 pièces qui suivent n'appartient pas au joueur
                break;
              }
              if(k == 3 && gameArray[i+k][j+k] == player){ // Si les 2 pièces qui suivent appartiennet au joueur et la 3ème aussi
                win = true;
                break;
              }
            }
            // Check pour les diagonales en partant du haut. A ne calculer que s'il y a suffisamment de place en bas.
            if(i>=3){
              for (var k = 1; k <= 3; k++) { // Une boucle qui tourne 3 fois
                if(gameArray[i-k][j+k] != player && k < 3){ // Si l'une des 2 pièces qui suivent n'appartient pas au joueur
                  break;
                }
                if(k == 3 && gameArray[i-k][j+k] == player){ // Si les 2 pièces qui suivent appartiennet au joueur et la 3ème aussi
                  win = true;
                  break;
                }
              }
            }
          }
        }
      }
      return win;
    }

    var generateHTML = function(){
      game.empty();

      for (var i = gameArray.length -1; i >= 0; i--) { // Boucle dans le sens inverse pour que gameArray[0] corresponde à la ligne du bas
        var row = $("<div>", {class: "row"});
        for (var j = 0; j < gameArray[i].length; j++) {
          var className;
          switch(gameArray[i][j]){
            case 0:
              className = "box";
              break;
            case 1:
              className = "box yellow";
              break
            case 2:
              className = "box red";
              break;
            default:
              className = "box";
              break;
          }
          var box = $("<div>", {class: className});
          if(canPlace(i, j)){
            box.addClass("playable");
          }
          row.append(box);
        };
        game.append(row);
      };
    }
    generateHTML();

    // Pour selectionner une div.box avec les index de gameArray
    // Retourne un objet jQuery
    var selectBox = function(x, y){
      var rowIndex = Math.abs(settings.y - 1  - x);
      return $($($(".row")[rowIndex]).find(".box")[y]);
    }

    var updateTurn = function(){
      turn = turn == 1 ? 2 : 1;
    }

    var resetGame = function(){
      // Reset gameArray values
      for (var i = 0; i < settings.y; i++) {
        for (var j = 0; j < settings.x; j++) {
          gameArray[i][j] = 0;
        };
      };

      game.empty();
      generateHTML();
    }

    $(game).on("click", ".box.playable", function(){
      var x = $(this).index();
      var y = Math.abs($(this).parent().index() - settings.y) - 1;
      if(canPlace(y,x)){
        gameArray[y][x] = turn;
      }
      generateHTML()
      if(horizontalWin() || verticalWin() || diagonalWin()){
        alert("Player " + turn + " Wins !");
        resetGame();
      }
      updateTurn();
    });
  }); // end each
}