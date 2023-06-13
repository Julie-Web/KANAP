// Récupére
addProduct = document.getElementById('addToCart');

// addEventListener = écouter d'événement donc au clic
addProduct.addEventListener("click", function add () {
    // Les navigateurs modernes fournissent URLSearchParams et URL.searchParams pour faciliter l’analyse des paramètres de la chaîne de requête
    // Le constructeur URLSearchParams() crée et renvoie un nouvel objet
    // La propriété search de l’interface Location est une chaîne de recherche, également appelée chaîne de requête, c’est-à-dire qu’une chaîne contenant un suivi des paramètres de l'URL. '?'
    let id = new URLSearchParams(window.location.search).get("id");
    // Récupére et
    // value = renvoie un tableau contenant les valeurs des propriétés d'un objet dans l'ordre
    let quantity = document.getElementById("quantity").value;
    let color = document.getElementById("colors").value;
    
    // Si il y a pas de quantités ou de couleurs
    if (quantity == 0 || color == null) {
        alert("Veuillez remplir tous les champs");
        return;
    }
      
    // Crée un objet
    let product = {
        id: id,
        quantity: quantity,
        color: color,
    };
      
    // Si l'utilisateur sélectionne le même produit avec la même couleur, 
    // Nous ajoutons la quantité au produit existant, 
    // Si non, nous ajoutons le produit au panier

    // Enregistre le résultat dans le localstorage
    let basket = localStorage.getItem("basket");

    // Si le panier existe déjà dans le localstorage
    if (basket != null) {
        // Convertit le contenu du panier en objet JavaScript à partir du JSON du localstorage
        basket = JSON.parse(basket);
        // Parcours tous les éléments du panier
        for (let i = 0; i < basket.length; i++) {
            // Si le produit a ajouter a le même id et la même couleur qu'un produit déjà présent dans le panier
            if (basket[i].id == product.id && basket[i].color == product.color) {
                // Ajoute la quantité du nouveau produit à la quantité du produit existant dans le panier
                basket[i].quantity = parseInt(basket[i].quantity) + parseInt(product.quantity);
                // setItem met à jour le contenu du panier dans le localstorage avec la nouvelle quantité
                localStorage.setItem("basket", JSON.stringify(basket));
                alert("Le produit a bien été ajouté au panier");
                return;
            } else {
                // Si le produit à ajouter n'existe pas déjà dans le panier, il faut l'ajouter à la fin du panier
                basket.push(product);
                // setItem met à jour le contenu du panier dans le localstorage avec le nouveau produit ajoutée
                localStorage.setItem("basket", JSON.stringify(basket));
                alert("Le produit a bien été ajouté au panier");
                return;
            }
        }

    } else {
        // Si le panier n'existe pas encore, crée un nouveau panier vide
        basket = [];
        // Ajoute le produit à ce nouveau panier
        basket.push(product);
        // Mise à jour dans le localstorage
        localStorage.setItem("basket", JSON.stringify(basket));
        alert("Le produit a bien été ajouté au panier");
        return;
    }

})