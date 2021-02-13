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
                    "<div class='iconForm'>" +
                    "<p class='affichage' id='affichage" + product._id + "'>" + panierJson[i].qty + "</p>" +
                    "<p id='priceLine" + product._id + "'>" + prixLigne + ".00€</p>" +
                    "<i id='close' product-id='" + product._id + "' class='fas fa-times-circle close formItem '></i>" +
                    "</div>";

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

    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/api/teddies/order");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(product));
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
            let order = JSON.parse(this.responseText);
            localStorage.setItem("orderId", order.orderId);
            window.location.href = "confirmation.html";
        }
    }
});