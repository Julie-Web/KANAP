// Crée un nouvel objet à partir de l’URLSearchParams
// location.search renvois la partie chaîne de requête d’une URL
let url = new URLSearchParams(document.location.search);

// Renvoie la première valeur associée au paramètre de recherche donnée 
let id = url.get("id");

// Variable
const orderId = id;

// Affichage de l'id du produit

// Sélectionne
const idConfirmation = document.querySelector("#orderId");

// Affiche en HTML
idConfirmation.innerHTML = `<span id="orderId"><strong>${orderId}</strong><br>Merci pour votre commande !</span>`;
  
// Nettoyage du localstorage
localStorage.clear();