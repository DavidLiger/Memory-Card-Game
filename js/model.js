var fruits = ['apple','apricot','banana','blueberry','kiwi',
              'pineapple','strawberry','grape','orange','pear',
              'apple','apricot','banana','blueberry','kiwi',
              'pineapple','strawberry','grape','orange','pear']
var gameBoard = []
var scores
var $this

class Model {

  constructor() {
    $this = this
  }

  /**
  * Pour afficher les meilleurs scores on commence par remonter tous les résultats depuis la BDD
  * Les échanges entre navigateur et serveur se font par des paquets de données transmis sous format JSON
  * Le premier élément correspond au type de requête SQL le second est un paramètre utilisé dans la requête SQl
  * On utilise ensuite 'serverRequest'
  **/
  loadHallOfFame(){
    let queryValues = ['read','*']
    var dataJSON = JSON.stringify(queryValues);
    $this.serverRequest(dataJSON)
  }

  /**
  * la fonction serverRequest utilise une fonction 'ajax' de jQuery
  * Elle s'occupe de faire des requêtes vers le serveur
  * On spécifie dans les parametres d'ajax : l'url du fichier ciblé (url), la méthode HTTP (ici, POST)
  * les données préparées en JSON (data) et le type de données attendu en réponse (dataType)
  * Enfin en cas de succès, on récupère la réponse et on peut exécuter du code ou
  * renvoyer le fil d'exécution vers une autre fonction
  **/
  serverRequest(data){
    $.ajax({
        url: '../php/main.php',
        method: 'POST',
        data:'data='+data,
        dataType: 'JSON',
        success: function (response){
            if(response){
              scores = response
              $this.displayHallOfFame()
            }
        }
    })
  }

    /**
     * Affichage des meilleurs scores
     * */
  displayHallOfFame(){
    let allScores = []
    let bestScores = []
    // Le tableau scores contient les résultats et les id remontés depuis la BDD
    // S'il n'est pas vide on stocke les résultats dans le tableau local "allScores"
    if(scores.length > 0){
      scores.forEach((object) => {
        allScores.push(parseInt(object.resultat))
      });
      // Ensuite on boucle 3 fois pour récupérer les trois meilleurs scores (3 + petits temps)
      for (let i = 0; i < 3; i++) {
        // La fonction min de Math nous permet de récupérer le plus petit élément d'un tableau
        let min_of_array = Math.min.apply(Math, allScores)
        // on l'ajoute au tableau bestScores
        bestScores.push(min_of_array)
        // puis on re-boucle sur tout le tableau allScores pour retirer (splice)
        // le meilleur résultat afin de ne pas afficher le même trois fois
        // Le n°1 étant retirer du tableau, au prochain tour,
        // on tombera forcément sur le deuxième meilleur temps
        for (var j = 0; j < allScores.length; j++) {
          if(allScores[j] === min_of_array){
            allScores.splice(j, 1)
          }
        }
      }
      // On vide l'élément du DOM "betterScores" puis on boucle sur bestScores
      // pour ajouter (append) un élément contenant le score en question, transformé en temps lisible
      // grâce à la méthode msToTime
      $('#betterScores').empty()
      for (let score in bestScores) {
        // Ici on vérifie que la cellule du tableau contient bien un chiffre (les millisecondes)
        // afin d'éviter un affichage de Nan (not a number)
        if(Number.isInteger(bestScores[score])){
          $('#betterScores').append('<li>'+$this.msToTime(bestScores[score])+'</li>')
        }
      }
    }
  }

    /**
     * Methode qui transforme une donnée en millisecondes en temps
     * */
  msToTime(millisecondes){
    let ms = millisecondes % 1000;
    millisecondes = (millisecondes - ms) / 1000;
    let secs = millisecondes % 60;
    millisecondes = (millisecondes - secs) / 60;
    let mins = millisecondes % 60;
    return mins + ' mn ' + secs + ' s '
  }

    /**
     * Dans le tableau gameboard on insère des fruits choisis aléatoirement
     * par la méthode getFruitToPlace
     * */
  setGameBoard(){
    for (var i = 0; i < 20; i++) {
      gameBoard.push($this.getFruitToPlace())
    }
  }

    /**
     * Retourne un fruit au hasard dans les 20 du tableau fruits
     * */
  getFruitToPlace(){
    // Appel de la fonction getRandomInt qui retourne un entier choisi au hasard
    let randomInt = $this.getRandomInt(fruits.length)
    // Le fruit à retourner est désigné par notre chiffre tiré au sort dans la tableau "fruits"
    let fruit = fruits[randomInt]
    // On va ensuite le retirer du tableau "fruits", avec la méthode splice, pour éviter de l'afficher deux fois.
    // On risque donc de retomber sur une case vide au prochain tour de boucle.
    // Pour cette raison on teste si la variable fruit contient quelquechose (if(fruit) renvoie "true")
    // et dans ce cas on le retire des fruits du tableau de départ et on le renvoie pour être ajouter au gameBoard
    // sinon (if(fruit) renvoie "false"), on rappelle la fonction getFruitToPlace() (on s'auto-rappelle)
    // pour générer un autre randomInt jusqu'à tomber sur une case contenant un fruit.
    if(fruit){
      fruits.splice(randomInt, 1)
      return fruit
    }else{
      $this.getFruitToPlace()
    }
  }

    /**
     * Math.floor arrondi un nombre donné à l'entier inférieur
     * Le paramètre envoyé à getRandomInt défini l'amplitude max sur laquelle s'exécute la fonction random
     * Ici : fruits.length = 20
     * */
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

    /**
     * Renvoi le tableau de jeu contenant les fruits mélangés
     * */
  getGameBoard(){
    return gameBoard
  }
}

export { Model }
