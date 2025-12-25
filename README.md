# frontend-person-dashboard

Merge branch 'main' of https://github.com/Itsmimii/frontend-person-dashboard
# Please enter a commit message to explain why this merge is necessary,
# especially if it merges an updated upstream into a topic branch.
#
# Lines starting with '#' will be ignored, and an empty message aborts
# the commit.

- Le frontend envoie des requêtes HTTP (GET, POST, PUT, DELETE) au backend.
- Le backend expose des endpoints REST pour gérer les personnes.
- Les données sont échangées au format JSON.

---

## 3. Technologies utilisées
**Frontend :**
- HTML5, CSS3, JavaScript
- Bootstrap 5 pour le style et les composants UI
- Fetch API pour consommer les services REST

**Backend :**
- JEE / JAX-RS pour exposer les services REST
- Hibernate (JPA) pour gérer la base de données
- Base de données MySQL
- Tomcat comme serveur

---

## 4. Fonctionnalités détaillées

### 4.1 Liste des personnes
- Affichage d’un tableau dynamique avec les colonnes : ID, Nom, Âge, Actions.
- Les actions incluent : modifier ou supprimer une personne.
- Les données sont récupérées via `GET /api/users/affiche`.

### 4.2 Ajouter une personne
- Formulaire pour saisir le nom et l’âge.
- Vérification que les champs sont correctement remplis.
- Envoi via `POST /api/users/add` au backend.
- Mise à jour immédiate du tableau après ajout.

### 4.3 Modifier une personne
- Bouton "Modifier" pour pré-remplir le formulaire avec les informations existantes.
- Modification envoyée via `PUT /api/users/update/{id}`.
- Mise à jour immédiate du tableau et des statistiques.

### 4.4 Supprimer une personne
- Bouton "Supprimer" avec confirmation.
- Suppression envoyée via `DELETE /api/users/remove/{id}`.
- Mise à jour dynamique du tableau et des statistiques.

### 4.5 Recherche
- Recherche par **ID ou nom**.
- Requête envoyée selon le type :
  - ID : `GET /api/users/getid/{id}`
  - Nom : `GET /api/users/getname/{name}`
- Affichage instantané des résultats.
- Si aucune personne n’est trouvée, un message s’affiche dans le tableau.

### 4.6 Statistiques
- Nombre total de personnes
- Nombre de majeures (âge ≥ 18)
- Nombre de mineures (âge < 18)
- Les statistiques sont affichées sous forme de **cartes Bootstrap**.

### 4.7 Notifications
- Utilisation de **Bootstrap Toasts** pour informer l’utilisateur :
  - Succès (ajout, modification, suppression)
  - Erreurs (champ manquant, problème backend)





## 5. Structure du projet frontend

