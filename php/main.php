<?php

// On "inclut" les fichiers BDDManager.php et globals.php.
include ('BDDManager.php');
include ('globals.php');

// Ici, on récupère le JSON "posté" lors de la requête faite par l'ajax.
// Le JSON est décodé (devient un tableau), on peut alors rentrer
// chacune de ses données dans une variable.
$data = json_decode($_POST['data']);
$dataBaseOperation = $data[0];
$dataScore = $data[1];

// Grâce à notre dépendance définie plus haut, on accède à la classe BDDManager
// on peut donc créer un objet (une instance de classe) : $db
// $db est donc un objet de "type" : BDDManager
$db = new BDDManager();

// Le language Php contient nativement des outils (classes) de connections aux bases de données (pdo, mysqli...)
// On peut créé un objet $connection de "type" : mysqli, sans préciser de dépendance
// Paramètres : les paramètres demandées par mysqli sont enregistrés dans un fichier à part (globals.php)
// afin d'être accessible partout dans l'application
$connection = new mysqli($servername, $username, $password, $dbname);
// connect_error est une fonction de la classe mysqli qui vérifie la connection
if ($connection->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// On reçoit un ordre stocké dans la variable $dataBaseOperation.
// Celui-ci nous permet de re-diriger le fil d'exécution du code.

// Dans le cas d'un 'insert', on créé une requête permettant d'insérer
// dans la table "score", la valeur contenue dans $dataScore
// On appelle ensuite la méthode 'insert' de l'objet $db, en lui passant
// par référence l'objet $connection et la requête que l'on vient de créer
// Lorsque l'opération est terminée, on ferme la connection pour éviter
// de conserver une multitude de connections ouvertes
if($dataBaseOperation == 'insert'){
  $req = "INSERT INTO score (resultat) VALUES ($dataScore)";
  $res = $db->insert( $connection, $req);
  $connection->close();
}

// Dans le cas d'un 'read', on créé une requête permettant de récupérer
// les résultats contenus dans la table "score".
// On appelle la méthode 'select' de l'objet $db, en lui passant
// par référence l'objet $connection et la requête créée au-dessus.
// Lorsque l'opération est terminée, on ferme la connection.
// La boucle while itère sur le résultat de la requête SQL et extrait chaque
// ligne de résultat en une ligne de tableau associatif (grâce à la fonction mysqli_fetch_assoc)
// qui est ajoutée au tableau "$scores".
// Ce tableau est encodé en JSON puis renvoyé côté client (navigateur).
// On retrouve ce paquet de données (JSON) dans le paramètre 'success' de notre fonction
// 'ajax' qui a émis la requête.
if($dataBaseOperation == 'read'){
  $req = "SELECT $dataScore FROM score";
  $res = $db->select( $connection, $req);
  $connection->close();
  while ($row = mysqli_fetch_assoc($res)) {
    $scores[] = $row;
  }
  echo json_encode($scores);
}

?>
