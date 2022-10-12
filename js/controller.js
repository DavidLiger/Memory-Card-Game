var model
var view
var $this
var returnedCards = []
var firstCardToCompare = {'cardId':'', 'fruit':''}
var secondCartToCompare = {'cardId':'', 'fruit':''}

class Controller {

    // Le controleur recoit un objet model et un objet view 'singleton'
    // cela signifie qu'il ne sont instancié qu'une seule fois et passer en paramètre partout où on en a besoin
    // afin d'économiser des ressources sur de s objets plus lourds (ex : classes qui font du rendu graphique...)
  constructor(modelSingleton, viewSingleton) {
    // la variable $this reçoit l'objet actuel -> le 'this' au niveau de l'objet 'controller'.
    // Ce qui permet d'appeler tous ce que contient l'objet controller sans risque d'erreur. Ainsi il n'y a pas de confusion avec un this qui désigne un autre objet.
    // Exemple : dans la methode returnCardOnClick() l'evenement click concerne la classe 'mem-card' soit tous les éléments portant cette classe, mais le traitement
    // ne concerne que l'élément cliqué =  $(this).css("content","url('/assets/"+fruitToShow+".png')").
    // Le supert-this ($this) qui est appelé 2 lignes plus loin permet de remonter au niveau de l'objet controller.
    // Sans çà le code chercherait une méthode "getCardsToCompare()" dans l'élément cliqué, ce qui n'existe pas !!!
    $this = this
    model = modelSingleton
    view = viewSingleton
  }

    /**
     * Point d'entrée du fil d'exécution, méthode appelée par index.js.
     * Elle appelle deux fonctions de gestion d'evenements (click).
     * */
  init(){
    $this.startOnClick()
    $this.returnCardOnClick()
  }

    /**
     * Méthode qui lance le jeu
     * Cache la fenêtre d'affichage des scores et l'écran opaque
     * Elle appelle la méthode setGameBoard de l'objet model
     * Les méthodes de view démarre le chrono et lance l'animation
     * sur la barre de progression du compte à rebours sous le plateau
     * */
  startOnClick(){
    $('#start').on('click', function(){
      $(".score-display-container").hide()
      $(".opac-screen").hide()
      model.setGameBoard()
      view.setStart(new Date())
      view.animateUpdate()
    })
  }

    /**
     * Méthode de retournement des cartes
     * Elle récupère l'id de la carte cliquée (de 'card0' à 'card19')
     * Avec la méthode substring on récupère le numéro de la carte.
     * Numéro qui nous permet de trouver la bonne carte sur le tableau (gameboard)
     * renvoyé par la méthode getGameBoard() de l'objet model.
     * On peut ensuite modifier son image grâce à la méthode css de jQuery.
     * Lorsqu'on a retourné et comparé les cartes, si elle correspondent,
     * on les ajoute aux tableau "returnedCards" pour éviter une triche simple
     * qui consisterait à ajouter des points en cliquant
     * plusieurs fois sur des cartes déjà retournées !! (petits malins !!)
     * */
  returnCardOnClick(){
    $('.mem-card').on('click', function() {
      let cardId = $(this).attr('id')
      let cardPos = cardId.substring(4)
      let fruitToShow = model.getGameBoard()[cardPos]
      $(this).css("content","url('/assets/"+fruitToShow+".png')")
      // anti-triche -> plusieurs clics sur paire dévoilée
      if(!returnedCards.includes(cardId)){
        $this.getCardsToCompare(cardId, fruitToShow)
      }
    })
  }

    /**
     *  Après les tableaux, voyons les tableaux associatifs (ou objet en JS).
     *  Ils permettent d'associer une clé à une valeur, ainsi on peut stocker
     *  plusieurs valeurs dans un même objet et les retrouver plus facilement.
     *  Cette méthode prend en paramètre l'identifiant de l'élément du DOM (cardId)
     *  et le fruit qui lui correspond (fruitToShow, récupéré dans
     *  la fonction appelante : returnCardOnClick).
     *  Si 'firstCardToCompare' est vide, on peut enregistrer les informations qui la concerne.
     *  Sinon, si la seconde carte est vide (secondCartToCompare), alors on remplit cette
     *  carte et vu qu'on en a deux on peut les comparer, en appelant la fonction 'compareReturnedCards'.
     *  Sinon, c'est que les deux sont déjà remplit, donc une comparaison a eu lieu.
     *  On les vide, et auto-rappelle la méthode pour remplir la première carte !!
     * */
  getCardsToCompare(cardId, fruitToShow){
    if (firstCardToCompare.cardId === ''){
      firstCardToCompare.cardId = cardId
      firstCardToCompare.fruit = fruitToShow
    }else if (secondCartToCompare.cardId === ''){
      secondCartToCompare.cardId = cardId
      secondCartToCompare.fruit = fruitToShow
      $this.compareReturnedCards(firstCardToCompare, secondCartToCompare)
    }else{
      firstCardToCompare.cardId = ''
      firstCardToCompare.fruit = ''
      secondCartToCompare.cardId = ''
      secondCartToCompare.fruit = ''
      $this.getCardsToCompare(cardId, fruitToShow)
    }
  }

    /**
     * Maintenant que deux cartes sont visibles, on peut comparer les valeurs de leur clés 'fruit'.
     * Si elles correspondent, c'estune réussite, on peut donc incrémenter le score de 2 pts (1 paire trouvée).
     * On peut ensuite ajouter leurs 'cardId' au tableau "returnedCards" afin de ne plus opérer de comparaison dessus.
     * Enfin on vérifie le score à chaque paire dévoilée.
     * Sinon, si elles ne correspondent pas on les retournent, côté verso, en modifiant leur css
     * et en leur attribuant l'image de la carte retournée.
     * Ces instructions sont inclus dans un setTimeout qui repousse d'une seconde et demi (1500 ms) leur exécution
     * afin de laisser le temps au joueur de voir les cartes. (C'est plus sympa !!!)
     * */
  compareReturnedCards(firstCardToCompare, secondCartToCompare){
    // empêche un click sur d'autres cartes avant la fin de la comparaison
    $('.mem-card').off('click')
    if(firstCardToCompare.fruit === secondCartToCompare.fruit){
      view.setScore(2)
      returnedCards.push(firstCardToCompare.cardId)
      returnedCards.push(secondCartToCompare.cardId)
      // réactive click sur cartes
      $this.returnCardOnClick()
      view.scoreChecker()
    }else{
      setTimeout(function(){
        $('#'+firstCardToCompare.cardId+'').css("content","url('/assets/card-verso-small.png')")
        $('#'+secondCartToCompare.cardId+'').css("content","url('/assets/card-verso-small.png')")
        // réactive click sur cartes
        $this.returnCardOnClick()
      },1500)
    }
  }

}

export { Controller }
