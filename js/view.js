var $this
var model
var start
var maxTime = 120000 // 2 minutes
var timeoutVal = Math.floor(maxTime/100)
var timeDiff
var victory = false
var gameOver = false
var score = 0

class View {

  constructor(modelSingleton) {
    model = modelSingleton
    $this = this
  }

    /**
    * Cette méthode met à jour continuellement la difference
    * entre le temps actuel et le temps de départ du jeu (timediff).
    * Divisé par le temps maximum donné pour une partie et multiplié par 100
    * cela nous donne un pourcentage qui sert à allonger progressivement la barre
    * qui représente le temps restant sous le plateau de jeu, grace à la
    * méthode updateProgress().
    * Si le pourcentage est inférieur à 100 et que les variable booléenne 'victory'
    * et 'gameOver' sont retournent 'faux' alors on continue d'auto-rappeler
    * la méthode animateUpdate() grace à un setTimeout.
    * Si on atteint les 100 alors le temps est écoulé, le flag 'gameOver' est 'true'
    * et /!\ A CORRIGER : Appel direct de victoryOrDefeat (a renommer)
     * */
  animateUpdate() {
    $(".remaining-time-bar").show()
    let now = new Date()
    timeDiff = now.getTime() - start.getTime()
    let percentage = Math.round((timeDiff/maxTime)*100)
    if (percentage <= 100 && !victory  && !gameOver) {
        $this.updateProgress(percentage)
        setTimeout($this.animateUpdate, timeoutVal)
    }
    if(percentage === 100){
      $this.victoryOrDefeat(false)
    }
  }

  /**
   * Modifie la propriété 'width' de l'élément 'remaining-time-bar'
   * */
  updateProgress(percentage) {
    $('.remaining-time-bar').css("width", percentage + "%")
  }

    /**
    * scoreChecker() étant appelé à chaque comparaison de 2 cartes,
    * on ne valide la victoire que lorsque le score est à 20.
    * On transforme le temps en une string affichable avec la fonction
    * msToTime() de l'objet model. Assigné 'true' à la variable 'victory' a pour effet
    * de stopper la progression de la barre de temps restant.
    * Il ne reste plus qu'à enregistrer le temps effectué par le joueur en BDD.
    * Pour se faire on créé un tableau ayant en premier élément l'ordre 'insert' et
    * le temps réalisé, puis on le transforme en un JSON qu'on peut envoyé vers
    * la méthode serverRequest de l'objet model afin d'être transmis au serveur.
     * */
  scoreChecker(){
    if(score === 20){
      let perf = model.msToTime(timeDiff)
      $this.victoryOrDefeat(true, perf)
      victory = true
      let queryValues = ['insert', timeDiff]
      var dataJSON = JSON.stringify(queryValues);
      model.serverRequest(dataJSON)
    }
  }

    /**
    * Ici on réutilise la fenêtre de chargement qui affiche les meilleurs résultats
    * pour afficher un petit message de félicitations.
    * Si 'winner' est 'vrai', on vide l'élément du DOM 'betteScores'
    * et on le remplit avec une balise <p></p> contenant notre message et le temps
    * réalisé. On cache le titre de la fenêtre le boton 'nouvelle partie' (start)
    * et on montre la fenêtre.
    * Sinon, si 'winner' est faux, on suit les même instructions
    * en remplacant seulement le message adressé au joueur.
     * */
  victoryOrDefeat(winner, perf){
    if(winner){
      $('#betterScores').empty()
      $('#betterScores').html("<p style='font-size:0.7em'>Vous avez gagneee !!! Defi releve en "+perf+"</p>")
      $("#hofTitle").hide()
      $("#start").hide()
      $('.score-display-container').show()
      $(".opac-screen").show()
    }else{
      $('#betterScores').empty()
      $('#betterScores').html("<p style='font-size:0.7em'>Vous avez perduuuu !!!<p>")
      $("#hofTitle").hide()
      $("#start").hide()
      $('.score-display-container').show()
      $(".opac-screen").show()
    }
  }

  setStart(date){
    start = date
  }

  setScore(val){
    score += val
  }
}

export { View }
