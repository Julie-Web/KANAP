// On crée un nouvel objet à partir de l’URL actuelle dans le navigateur, ensuite nous vérifions s’il existe un paramètre de chaîne de requête et l’enregistrer dans une variable.id
var productId = new URL(location).searchParams.get("id");

async function fonctionPrincipale() {
    // Récupére données api
    await fetch(`http://localhost:3000/api/products/${productId}`)
        // Transforme en json
        .then(convertir => {
            // Si ok, converti
            if (convertir.ok) {
                convertir.json()
                    // Affiche
                    .then(afficherProduits => {
                        ajouterLesProduitsDansLaPage(afficherProduits);
                    })
            // Si non
            } else {
                // Affiche dans la console
                console.log('Retour du serveur : ', convertir.status);
                // Selectionne
                const infoErreur = document.querySelector('.item');
                // Affiche l'erreur en html
                infoErreur.innerHTML = `<h1>Le produit est introuvable...</h1>`;
            }

        })

};

// La fonction a un paramètre qui s'appelle afficherProduits
function ajouterLesProduitsDansLaPage(afficherProduits) {

    // 0. Récupére l'ancre dans la page
    const ancreImage = document.querySelector('.item__img')
    const ancreDuTitre = document.getElementById('title')
    const ancreDeLaDescription = document.getElementById('description')
    const ancreDuPrix = document.getElementById('price')
    const ancreCouleurs = document.getElementById('colors')

  

      // Ajoute image
      const image = document.createElement('img')
      // Ajoute un nouvel attribut ou change la valeur d'un attribut existant pour l'élément spécifié. 
      // Si l'attribut existe déjà, la valeur est mise à jour, sinon, un nouvel attribut est ajouté avec le nom et la valeur spécifiés.
      image.setAttribute('src', afficherProduits.imageUrl)
      image.setAttribute('alt', afficherProduits.altTxt)
      ancreImage.appendChild(image)

      // Ajoute titre
      title.textContent = afficherProduits.name
        
      // Ajoute description
      description.textContent = afficherProduits.description

      // Ajoute prix
      price.textContent = afficherProduits.price

      // Pour les couleurs, afficherProduits = nom de la fonction, .colors = couleurs qui se trouve dans l'api
      for (let color of afficherProduits.colors) {
          // Crée l'élément
          let options = document.createElement('option');
          // Afficher en html la balise <option> avec les couleurs ${colors}
          options.innerHTML = `<option value="${color}">${color}</option>`
          // Ajoute à l'ancre
          ancreCouleurs.appendChild(options);
      };

}

// Execute la fonction
fonctionPrincipale()