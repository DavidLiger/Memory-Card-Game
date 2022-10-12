# Memory-Card-Game
A memory game made over a weekend to answer a recruitment test for the O-Clock School.

Memory Card

Fonctionnalités demandées :

- Au commencement du jeu, des cartes sont disposées face cachée à l'écran.

- Le joueur doit cliquer sur deux cartes. Si celles-ci sont identiques, la paire est
validée. Sinon, les cartes sont retournées face cachée, et le joueur doit sélectionner
une nouvelle paire de cartes.

- Une compteur de temps, avec une barre de progression, s’affiche en dessous du
plateau.

- Le joueur gagne s'il arrive à découvrir toutes les paires avant la fin du temps imparti.

- Chaque temps de partie effectuée doit être sauvegardée en base de données.
Avant le début du jeu, les meilleurs temps s’affichent à l’écran.



Côté Front :

	L'application est développé en respectant le design pattern MVC, et en utilisant également un design pattern singleton. 

	Pour le MVC (Modèle, Vue, Contrôleur) le Contrôleur va récupérer tous les événements du navigateur. Ainsi, en JavaScript, 
	on peut récupérer les clics, les entrées dans un  « input », les scrolls…

	La classe Modèle sert à modéliser les données, c'est-à-dire effectuer un traitement sur les données avant de les 
	enregistrer ou lorsqu'elles remontent de la base de données. On fera les échanges entre le côté client et le côté serveur 
	via des requêtes XMLHttpRequest également appelé Ajax en jQuery.

	La classe Vue, va s'occuper de l'ensemble des affichages et des traitements liés à ceux-ci.


Côté Back:

	Le traitement des données se fera en PHP et MySQL.

	La base de données contient une table score avec une clé primaire (« id ») qui s'auto-incremente à chaque nouvelle entrée 
	de ligne et une colonne « résultat » qui enregistre les résultats. Bien sûr on aurait pu ajouter d'autres colonnes, comme 
	«joueur» pour enregistrer le nom du joueur... 

	Au niveau du PHP, on enregistre les informations grâce à une classe « BDDManager » qui est appelé pour exécuter des 
	requêtes personnalisées dans notre main.php, 
	La connexion est créé et fermé à chaque requête 

	Les informations de connexion à la base de données sont enregistrées dans des variables globales afin d'être accessible 
	partout dans le PHP.
	
Support de cours : https://github.com/DavidLiger/Memory-Card-Game/blob/main/assets/support-de-cours-OClock.pdf
