// Récupère articles du basket dans le localstorage
let basket = JSON.parse(localStorage.getItem("basket"));
 
// Tableau
let products = [];

async function afficherProduitsPanier() {

    // Récupére
    const prixTotalAfficher = document.getElementById('totalPrice');
    const totalQuantityAfficher = document.getElementById('totalQuantity');

    // Transforme les chaînes de caractères en objet
    const produits = JSON.parse(localStorage.getItem("basket"));

    // Variables
    let prixTotal = 0
    let totalQuantity = 0

    // Afficher produits
    // of = on reçois les éléments dans l'ordre
    for (let produit of produits) {
        // Récupére données api
        await fetch(`http://localhost:3000/api/products/${produit.id}`)
            // Transforme en json
            .then(convertir => convertir.json())
            // Affiche
            .then(afficher => {

                // Création tableau pour les produits à envoyer au serveur
                products.push(produit.id);

                // Affiche données des produits ajoutée au panier
                document.querySelector('#cart__items').innerHTML +=
                    `<article class="cart__item" data-id="${afficher.id}" data-color="${afficher.colors}">
                    <div class="cart__item__img">
                        <img src="${afficher.imageUrl}" alt="${afficher.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${afficher.name}</h2>
                            <p>${afficher.description}</p>
                            <p>${afficher.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article> `;
       
                // Prix total et quantités

                // Multiplie à la quantité
                let totalparArticle = produit.quantity * afficher.price

                // Transforme en objet
                totalQuantity += JSON.parse(produit.quantity);

                // Additionne
                prixTotal += totalparArticle
                         
                // Affiche
                prixTotalAfficher.textContent = prixTotal;
                totalQuantityAfficher.textContent = totalQuantity;
                                
                modifQuantity();

            });
    }
    
}

function deleteProducts() {
    // Récupère boutons supprimer qui existent, transforme en tableau grâce à Array.from()
    let deleteBouton = Array.from(document.querySelectorAll('.deleteItem'))

    // Crée tableau vide pour récupérer le basket existant et contrôler les suppressions d'articles
    let basketControlDelete = [];

    for (let i = 0; i < deleteBouton.length; i++) {
        // Au clic
        deleteBouton[i].addEventListener("click", () => {
            // Supprime l'article visuellement sur la page
            deleteBouton[i].parentElement.style.display = "none";

            // Copie du tableau basket dans le tableau basketControlDelete
            basketControlDelete = basket;

            // splice() supprime un élément à chaque index [i] du tableau écouté
            basketControlDelete.splice([i], 1);
            
            // Mise à jour du localstorage grâce à setItem et stringify pour convertir, ils doivent être convertis en chaîne pour les définir
            basket = localStorage.setItem("basket", JSON.stringify(basketControlDelete));

            // Transforme les chaînes de caractères en objet
            let storagebasket = JSON.parse(localStorage.getItem("basket"))

            // Si le tableau est à 0, === : égalité stricte
            if(storagebasket.length === 0) {
                // Vide le localstorage
                localStorage.clear()
            }

            // Rafraîchissement de la page
            window.location.href = "cart.html";
        });

    }
    
}

// Initialiser
async function init() {
    await afficherProduitsPanier();
    deleteProducts();
}

init();

// Transforme les chaînes de caractères en objet
let localStorageProducts = JSON.parse(localStorage.getItem("basket"));  

function modifQuantity () {

    let inputQuantity = Array.from(document.querySelectorAll(".cart__item__content__settings__quantity input"));
    let valeurQuantity = Array.from(document.querySelectorAll('.itemQuantity'));

    // Cherche tout les input dans lequelle on effectue un addEventListener pour changer la valeur des articles
    for (let i = 0; i < inputQuantity.length; i++) {

        inputQuantity[i].addEventListener("change", () => {
     
            // Copie du tableau localStorageProducts dans le tableau tableauMisAjour
            tableauMisAjour = localStorageProducts;
                
            // Création d'une boucle for pour supprimer les valeurs dans le localstorage
            for (let i = 0; i < tableauMisAjour.length; i++) {
                    delete tableauMisAjour[i].altTxt;
                    delete tableauMisAjour[i].imageUrl;
                    delete tableauMisAjour[i].name;
                    delete tableauMisAjour[i].price; 
            }
                
            // Modifie la quantité d'un élément à chaque index [i] du tableau écouté
            // value renvoie un tableau contenant les valeurs dont l'ordre 
            tableauMisAjour[i].quantity = Math.min(valeurQuantity[i].value, 100)

            // Mise à jour du localstorage grâce à setItem et stringify pour convertir en JSON
            localStorage.setItem("basket", JSON.stringify(tableauMisAjour));
            
            // Rafraîchissement de la page
            window.location.reload();

            afficherProduitsPanier();

        });
    }
}

// Récupére bouton commander
let boutonFormulaire = document.querySelector('#order');

// Si le localstorage est null, si sa égale à 0
if (basket == null || basket.length == 0) {
        // Récupére pour dire un message
        document.querySelector('h1').textContent = 'Le panier est vide !';
}

// Si non, valide formulaire avec données utilisateur
else {
    document.querySelector('h1').textContent = 'Voici votre panier';

    // Écoute du bouton commander sur le click pour pouvoir contrôler, valider et ennoyer le formulaire et les produits au back-end
    boutonFormulaire.addEventListener('click', (e) => {
        e.preventDefault();

        // Récupération valeurs formulaire
        const contact = {
            firstName : document.querySelector("#firstName").value,
            lastName : document.querySelector("#lastName").value,
            address : document.querySelector("#address").value,
            city : document.querySelector("#city").value,
            email : document.querySelector("#email").value,
        };

        function firstNameControle () {     
            // Regex pour le contrôle des champs prénom, regex permet de vérifier les caractères
            // contact = nom objet,
            // firstName = nom valeur
            const firstName = contact.firstName;
            // Si c'est correct
            if (/^([A-Za-z\s]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(firstName)) {
                document.querySelector("#firstNameErrorMsg").textContent = "";
                return true;
            } 
            
            // Si non
            else {
                // Message invalide
                document.querySelector("#firstNameErrorMsg").textContent = "Le champ du formulaire est invalide";
                return false;
            }
        
        }

        function lastNameControle () {     
            // Regex pour le contrôle des champs nom
            const lastName = contact.lastName;
            if (/^([A-Za-z\s]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(lastName)) {
                document.querySelector("#lastNameErrorMsg").textContent = "";
                return true;
            } 
                    
            else {
                document.querySelector("#lastNameErrorMsg").textContent = "Le champ du formulaire est invalide";
                return false;
            }
                
        }

        function addressControl () {     
            // Regex pour le contrôle des champs adresse
            const adresse = contact.address;
            if (/^[A-Za-z0-9\s]{5,100}$/.test(adresse)) {
                document.querySelector("#addressErrorMsg").textContent = "";
                return true;
            } 
            
            else {
                document.querySelector("#addressErrorMsg").textContent = "Le champ du formulaire est invalide";
                return false;
            }
            
        }

        function cityControl () {     
            // Regex pour le contrôle des champs ville
            const city = contact.city;
            if (/^([A-Za-z\s]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(city)) {
                document.querySelector("#cityErrorMsg").textContent = "";
                return true;
            } 
            
            else {
                document.querySelector("#cityErrorMsg").textContent = "Le champ du formulaire est invalide";
                return false;
            }
            
        }

        function emailControle () {     
            // Regex pour le contrôle des champs email
            const email = contact.email;  
            if (/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(email)) {
                document.querySelector("#emailErrorMsg").textContent = "";
                return true;
            } 
            
            else {
                document.querySelector("#emailErrorMsg").textContent = "Le champ du formulaire est invalide";
                return false;
            }
            
        }

        // Contrôle validité formulaire avant envois dans le localstorage
        // && est un opérateur qui permet de dire si true
        if (firstNameControle() && lastNameControle() && addressControl() && cityControl() && emailControle()) {
            // Mettre l'objet "contact" dans le localstorage grâce à setItem et stringify pour convertir en JSON
            localStorage.setItem("contact", JSON.stringify(contact));
            envoyerVersleServeur();
        }

        // Variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST
        var orderId = "";

        function envoyerVersleServeur () {
            // Récupére données api
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                // contact = nom objet, 
                // products = nom tableau
                body:JSON.stringify({contact, products}) ,
                // Pour être géré correctement sur internet, un document JSON nécessite un type MIME spécifique
                // Il n'existe qu'un seul type valable et lu correctement par toutes les applications, il s'agit du type application/json
                headers: {
                    "Content-Type": "application/json",
                },
            }) 
            
            // Convertir en json
            .then((response) => {
                return response.json();
            })
            
            // Affiche
            .then((server) => {
                orderId = server.orderId;
                // Si la variable orderId n'est pas une chaîne vide on redirige notre utilisateur sur la page confirmation avec la variable
                if (orderId != "") {
                    alert("Votre commande à bien était prise en compte");
                    location.href = "confirmation.html?id=" + orderId;
                }

            })

        }

    })

}