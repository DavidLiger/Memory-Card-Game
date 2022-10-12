<?php

/**
 * Dans cette classe, on exécute les requêtes transmises par paramètres
 * en utlisant l'objet $connection transmis également par paramètre.
 * On exécute ici les opérations du CRUD (Create, Read, Update, Delete).
 */
class BDDManager {

  public function __construct(){}

  /**
  * Cette méthode exécute des requêtes SQL de type "SELECT".
  * Elle retourne un résultat.
  */
  public function select( $connection, $req ){
      try{
        $res = $connection->query($req);
        return $res;
      }catch(Exception $e){
          throw New Exception( $e->getMessage() );
      }
      return false;
  }

  /**
  * Cette méthode exécute des requêtes SQL de type "INSERT".
  * Elle ne retourne pas un résultat.
  */
  public function insert( $connection, $req ){
      try{
        $connection->query($req);
      }catch(Exception $e){
          throw New Exception( $e->getMessage() );
      }
      return false;
  }

}


 ?>
