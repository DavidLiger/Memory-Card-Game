// import = type/module dans l'HTML
import { Model } from './model.js';
import { View } from './view.js';
import { Controller } from './controller.js';

var model, view, controller

/**
*  point d'entrée de l'application
* désigné par <script></script> index.js
**/
$(document).ready(function () {
  model = new Model()
  view = new View(model)
  controller = new Controller(model, view)
  init()
});

/**
* init appelle les méthodes de
* démarrage de model et controller
**/
function init(){
  model.loadHallOfFame()
  controller.init()
}
