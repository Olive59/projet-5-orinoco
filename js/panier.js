function deleteLine(productId) {

    var panier = JSON.parse(localStorage.getItem('panier'));
    var panierNew = [];
    var total = 0;
    for (let panierItem of panier) {
        console.log(panierItem);
        if (panierItem.id != productId) {
            total += panierItem.qty;             
            panierNew.push(panierItem);
        }
    }
    localStorage.setItem("panier", JSON.stringify(panierNew));
    localStorage.setItem("total", total);
    window.location = "panier.html";

}

var prixTotal = 0;
var panier = localStorage.getItem('panier');
var panierJson = JSON.parse(panier);
for (let i = 0; i < panierJson.length; i++) {
    var id = panierJson[i].id;
    var qty = panierJson[i].qty;

    getFromAPI("http://localhost:3000/api/teddies/" + id)
        .then(function (response) {
            product = JSON.parse(response);

            if (panier != null) {
                var prixEuros = product.price / 100;
                var prixLigne = (prixEuros * panierJson[i].qty);
                prixTotal += prixLigne;

                //afficher le prix Total du panier
                totalPanier = document.getElementById("totalPanier");
                totalPanier.innerHTML = +prixTotal + ".00€";

                // affichage du panier 
                var produitsPanier = document.getElementById("produitsPanier");
                produitsPanier.innerHTML = produitsPanier.innerHTML +
                    "<div class='fichePanier fichePanier" + product._id + "'>" +
                    "<figure><img id='imgPanier' src=" + product.imageUrl + "></figure>" +
                    "<p class='responsiveName'>" + product.name + "</p>" +
                    "<p class='responsivePrice'>" + prixEuros + ".00€</p>" +
                    "<p class='affichage' id='affichage" + product._id + "'>" + panierJson[i].qty + "</p>" +
                    "<p id='priceLine" + product._id + "'>" + prixLigne + ".00€</p>" +
                    "<i onclick='deleteLine(\"" + product._id + "\")' id='close' class='fas fa-times-circle close formItem '></i>"
                // prix Total du panier dans le localStorage
                localStorage.setItem('prixTotal', prixTotal);
            }
        })
        .catch(function (req) {
            console.error("NOK", req);
        })
}

// affichage de la quantité dans le panier
var nombrePanier = document.getElementById('nombrePanier');
var total = localStorage.getItem('total');
nombrePanier.innerHTML = total;


document.getElementById("formulaire").addEventListener("submit", (event) => { // création de la commande et envoi
    event.preventDefault();
    var lastName = document.getElementById('lastName').value;
    var firstName = document.getElementById('firstName').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var city = document.getElementById('city').value;
    let contact = {
        lastName,
        firstName,
        email,
        address,
        city
    };
    lastName = localStorage.setItem('lastName', lastName);
    firstName = localStorage.setItem('firstName', firstName);
    // recuperer le panier en session    
    var panier = localStorage.getItem('panier');
    panierJson = JSON.parse(panier);
    // tableau vide recuperer les ID avec une boucle Array + push JSON.stringify + stocker dans une variable
    var products = [];
    for (let i = 0; i < panierJson.length; i++) {
        products.push(panierJson[i].id);
    };
    var product = {
        contact,
        products
    };

    postToAPI ("http://localhost:3000/api/teddies/order", product)  
    .then(function (response) { 
        console.log(response);
        localStorage.setItem("orderId", response.orderId);
        // window.location.href = "confirmation.html";
    })
    .catch(function(req ) { 
        console.error("requète echouée", req);
    })        
});

// function refreshButtons() { // rend le bouton "commander" utilisable ou non
//     let basketContent = JSON.parse(localStorage.getItem("basketContent"));
//     if (basketContent.length > 0) {
//         document.getElementById("sendOrderButton").setAttribute("enabled", true);
//     } else {
//         document.getElementById("sendOrderButton").setAttribute("disabled", true);
//         document.getElementById("clearBasket").setAttribute("disabled", true);
//     }
// }

// function refreshBasketListDisplay() {
//     document.getElementById("main").innerHTML = "<h2>Votre Panier :</h2>"; // réinitialise le contenu
//     let duePrice = 0;
//     let basketContent = JSON.parse(localStorage.getItem("basketContent"));
//     if (basketContent.length > 0) {
//         for (let product of basketContent) { // affiche chaque produit du panier en html et ajoute son prix au montant à régler
//             duePrice += product.price;
//             let productPositionInArray = basketContent.indexOf(product);
//             document.getElementById("main").innerHTML += `<ul>`;
//             document.getElementById("main").innerHTML += `<li>
//                                         <img src="${product.imageUrl}"/>
//                                         <p>${product.name}</p>
//                                         <p class="ids">${product._id}</p>
//                                         <p>${product.price / 100} €</p>
//                                         <button id="${productPositionInArray}">🗑️</button>
//                                     </li>`;
//         }
//         document.getElementById("main").innerHTML += `</ul><div>Montant total: ${duePrice /100} €</div>`;
//         for (i = 0; i < basketContent.length; i++) { // permet au bouton poubelle de supprimer le produit d'index égal à son id
//             let deleteButton = document.getElementById(i);
//             deleteButton.addEventListener("click", (event) => {
//                 let buttonId = event.currentTarget.getAttribute("id");
//                 basketContent.splice(buttonId, 1);
//                 localStorage.setItem("basketContent", JSON.stringify(basketContent));
//                 refreshButtons();
//                 refreshBasketListDisplay();
//             });
//         }
//     } else {
//         document.getElementById("main").innerHTML += `<p>Aucun article<p>`;
//     }
// }