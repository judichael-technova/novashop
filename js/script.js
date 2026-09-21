

// 1. MENU MOBILE

const btnMenu = document.getElementById("btn_menu");
const menuPrincipal = document.getElementById("menu_principal");

if (btnMenu && menuPrincipal) {

    btnMenu.addEventListener("click", function () {

        if (menuPrincipal.style.display === "block") {
            menuPrincipal.style.display = "none";
        } else {
            menuPrincipal.style.display = "block";
        }

    });

}



// 2. PANIER

let panier = JSON.parse(
    localStorage.getItem("novashop_panier")
) || [];



// 3. AJOUTER AU PANIER


function initialiserBoutonsPanier() {

    const boutonsPanier =
        document.querySelectorAll(".btn_panier");

    boutonsPanier.forEach(function (bouton) {

        bouton.addEventListener("click", function () {

            // Trouver le bloc du produit
            const produit =
                bouton.closest(".produit");

            if (!produit) {
                return;
            }


            // Dans ton HTML, le nom est dans <h2>
            const nomElement =
                produit.querySelector("h2");

            // Le prix est dans .prix
            const prixElement =
                produit.querySelector(".prix");


            if (!nomElement || !prixElement) {
                return;
            }


            const nom =
                nomElement.textContent.trim();


            // Exemple :
            // "750 000 FC" devient 750000
            const prix =
                parseInt(
                    prixElement.textContent.replace(/\D/g, "")
                );


            // Vérifier si le produit existe déjà
            const produitExistant =
                panier.find(function (item) {

                    return item.nom === nom;

                });


            if (produitExistant) {

                produitExistant.quantite++;

            } else {

                panier.push({

                    nom: nom,
                    prix: prix,
                    quantite: 1

                });

            }


            sauvegarderPanier();

            alert(
                "✅ " + nom + " a été ajouté au panier !"
            );

        });

    });

}



// 4. SAUVEGARDER LE PANIER


function sauvegarderPanier() {

    localStorage.setItem(
        "novashop_panier",
        JSON.stringify(panier)
    );

    mettreAJourCompteurPanier();

}



// 5. AFFICHER LE PANIER


function afficherPanier() {

    const tablePanier =
        document.getElementById("table_panier");

    // Si on n'est pas sur la page panier
    if (!tablePanier) {
        return;
    }


    const tbody =
        tablePanier.querySelector("tbody");

    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    let sousTotal = 0;


    // Si le panier est vide
    if (panier.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    🛒 Votre panier est vide.
                </td>
            </tr>
        `;

    }


    panier.forEach(function (item, index) {

        const totalProduit =
            item.prix * item.quantite;


        sousTotal += totalProduit;


        const ligne =
            document.createElement("tr");


        ligne.innerHTML = `

            <td>
                ${item.nom}
            </td>

            <td>
                ${formatPrix(item.prix)} FC
            </td>

            <td>

                <button
                    class="moins"
                    data-index="${index}">
                    −
                </button>

                <span class="quantite">
                    ${item.quantite}
                </span>

                <button
                    class="plus"
                    data-index="${index}">
                    +
                </button>

            </td>

            <td>
                ${formatPrix(totalProduit)} FC
            </td>

            <td>

                <button
                    class="btn_supprimer"
                    data-index="${index}">
                    🗑️ Supprimer
                </button>

            </td>

        `;


        tbody.appendChild(ligne);

    });


    // Sous-total
    const sousTotalElement =
        document.getElementById("sous_total");

    if (sousTotalElement) {

        sousTotalElement.textContent =
            formatPrix(sousTotal) + " FC";

    }


    // Total
    const totalElement =
        document.getElementById("total_panier");

    if (totalElement) {

        totalElement.textContent =
            formatPrix(sousTotal) + " FC";

    }


    // Boutons PLUS
    document.querySelectorAll(".plus")
        .forEach(function (bouton) {

            bouton.addEventListener(
                "click",
                function () {

                    const index =
                        parseInt(bouton.dataset.index);

                    panier[index].quantite++;

                    sauvegarderPanier();

                    afficherPanier();

                }
            );

        });


    // Boutons MOINS
    document.querySelectorAll(".moins")
        .forEach(function (bouton) {

            bouton.addEventListener(
                "click",
                function () {

                    const index =
                        parseInt(bouton.dataset.index);


                    if (panier[index].quantite > 1) {

                        panier[index].quantite--;

                    } else {

                        panier.splice(index, 1);

                    }


                    sauvegarderPanier();

                    afficherPanier();

                }
            );

        });


    // Boutons SUPPRIMER
    document.querySelectorAll(".btn_supprimer")
        .forEach(function (bouton) {

            bouton.addEventListener(
                "click",
                function () {

                    const index =
                        parseInt(bouton.dataset.index);


                    panier.splice(index, 1);


                    sauvegarderPanier();

                    afficherPanier();

                }
            );

        });

}



// 6. FORMAT DES PRIX


function formatPrix(nombre) {

    return Number(nombre).toLocaleString("fr-FR");

}



// 7. COMPTEUR DU PANIER


function mettreAJourCompteurPanier() {

    const liensPanier =
        document.querySelectorAll(
            'a[href="panier.html"]'
        );


    let totalQuantite = 0;


    panier.forEach(function (item) {

        totalQuantite += item.quantite;

    });


    liensPanier.forEach(function (lien) {

        if (totalQuantite > 0) {

            lien.textContent =
                "🛒 Panier (" +
                totalQuantite +
                ")";

        } else {

            lien.textContent =
                "🛒 Panier";

        }

    });

}



// 8. RECHERCHE

const champRecherche =
    document.getElementById("txt_recherche");

const boutonRecherche =
    document.getElementById("btn_recherche");


function lancerRecherche() {

    if (!champRecherche) {
        return;
    }


    const recherche =
        champRecherche.value
            .trim()
            .toLowerCase();


    if (recherche === "") {

        alert(
            "⚠️ Écrivez le nom d'un produit."
        );

        return;

    }


    // Récupérer les produits présents
    // sur la page actuelle
    const produits =
        document.querySelectorAll(".produit");


    // Si les produits sont présents
    if (produits.length > 0) {

        let nombreTrouve = 0;


        produits.forEach(function (produit) {

            // Recherche dans tout le contenu
            // du produit
            const contenu =
                produit.textContent
                    .toLowerCase();


            if (contenu.includes(recherche)) {

                produit.style.display = "";

                nombreTrouve++;

            } else {

                produit.style.display = "none";

            }

        });


        afficherResultatRecherche(
            nombreTrouve
        );


        // Aller vers la zone des produits
        const zoneProduits =
            document.querySelector(".produits_conteneur");


        if (zoneProduits) {

            zoneProduits.scrollIntoView({
                behavior: "smooth"
            });

        }


        return;

    }


    // Si aucun produit n'est présent
    // sur la page actuelle,
    // aller vers boutique.html
    window.location.href =
        "boutique.html?recherche=" +
        encodeURIComponent(recherche);

}


// Bouton 🔍
if (boutonRecherche) {

    boutonRecherche.addEventListener(
        "click",
        lancerRecherche
    );

}


// Touche Entrée
if (champRecherche) {

    champRecherche.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                lancerRecherche();

            }

        }
    );

}


// 9. MESSAGE DE RECHERCHE

function afficherResultatRecherche(nombre) {

    let message =
        document.getElementById(
            "message_recherche"
        );


    if (!message) {

        message =
            document.createElement("p");

        message.id =
            "message_recherche";


        message.style.textAlign =
            "center";

        message.style.fontSize =
            "18px";

        message.style.fontWeight =
            "bold";

        message.style.margin =
            "20px";


        const page =
            document.querySelector(".page");


        if (page) {

            page.insertBefore(
                message,
                page.querySelector(
                    ".titre_categorie"
                )
            );

        }

    }


    if (nombre === 0) {

        message.textContent =
            "❌ Aucun produit trouvé.";

    } else {

        message.textContent =
            "✅ " +
            nombre +
            " produit(s) trouvé(s).";

    }

}


// 10. RECHERCHE AVEC URL

function rechercherDepuisURL() {

    const parametres =
        new URLSearchParams(
            window.location.search
        );


    const recherche =
        parametres.get("recherche");


    if (!recherche) {
        return;
    }


    if (!champRecherche) {
        return;
    }


    champRecherche.value =
        recherche;


    const produits =
        document.querySelectorAll(".produit");


    if (produits.length === 0) {
        return;
    }


    let nombreTrouve = 0;


    produits.forEach(function (produit) {

        const contenu =
            produit.textContent
                .toLowerCase();


        if (
            contenu.includes(
                recherche.toLowerCase()
            )
        ) {

            produit.style.display = "";

            nombreTrouve++;

        } else {

            produit.style.display = "none";

        }

    });


    afficherResultatRecherche(
        nombreTrouve
    );

}


// 11. VIDER LE PANIER

const btnViderPanier =
    document.getElementById(
        "btn_vider_panier"
    );


if (btnViderPanier) {

    btnViderPanier.addEventListener(
        "click",
        function () {

            panier = [];

            sauvegarderPanier();

            afficherPanier();

        }
    );

}


// 12. COMMANDER SUR WHATSAPP

const btnCommander =
    document.getElementById(
        "btn_commander"
    );


if (btnCommander) {

    btnCommander.addEventListener(
        "click",
        function () {

            if (panier.length === 0) {

                alert(
                    "⚠️ Votre panier est vide."
                );

                return;

            }


            const nom =
                document
                    .getElementById(
                        "client_nom"
                    )
                    ?.value.trim();


            const telephone =
                document
                    .getElementById(
                        "client_telephone"
                    )
                    ?.value.trim();


            const adresse =
                document
                    .getElementById(
                        "client_adresse"
                    )
                    ?.value.trim();


            if (
                !nom ||
                !telephone ||
                !adresse
            ) {

                alert(
                    "⚠️ Veuillez remplir toutes les informations du client."
                );

                return;

            }


            let message =
                "Bonjour NOVASHOP 👋\n\n";

            message +=
                "Nouvelle commande\n\n";


            message +=
                "👤 Nom : " +
                nom +
                "\n";


            message +=
                "📱 WhatsApp : " +
                telephone +
                "\n";


            message +=
                "📍 Adresse : " +
                adresse +
                "\n\n";


            message +=
                "Produits commandés :\n";


            let total = 0;


            panier.forEach(function (item) {

                const totalProduit =
                    item.prix *
                    item.quantite;


                total += totalProduit;


                message +=
                    "• " +
                    item.nom +
                    " x" +
                    item.quantite +
                    " = " +
                    formatPrix(
                        totalProduit
                    ) +
                    " FC\n";

            });


            message +=
                "\n💰 Total : " +
                formatPrix(total) +
                " FC";


            // IMPORTANT :
            // Remplace XXXXXXXX par ton vrai
            // numéro WhatsApp.
            const numeroWhatsApp =
                "243984633415";


            const url =
                "https://wa.me/" +
                numeroWhatsApp +
                "?text=" +
                encodeURIComponent(message);


            window.open(
                url,
                "_blank"
            );

        }
    );

}


// 13. FORMULAIRE CONTACT → WHATSAPP

const formulaireContact =
    document.getElementById(
        "contactForm"
    );


if (formulaireContact) {

    formulaireContact.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nom =
                document
                    .getElementById("nom")
                    ?.value.trim();


            const email =
                document
                    .getElementById("email")
                    ?.value.trim();


            const telephone =
                document
                    .getElementById("telephone")
                    ?.value.trim();


            const messageClient =
                document
                    .getElementById("message")
                    ?.value.trim();


            const message =
                "Bonjour NOVASHOP 👋\n\n" +

                "👤 Nom : " +
                nom +
                "\n" +

                "📧 Email : " +
                email +
                "\n" +

                "📱 Téléphone : " +
                telephone +
                "\n\n" +

                "💬 Message : " +
                messageClient;


            // Remplace par ton vrai numéro
            const numeroWhatsApp =
                "243984633415";


            const url =
                "https://wa.me/" +
                numeroWhatsApp +
                "?text=" +
                encodeURIComponent(message);


            window.open(
                url,
                "_blank"
            );

        }
    );

}


// 14. INITIALISATION

initialiserBoutonsPanier();

afficherPanier();

mettreAJourCompteurPanier();

rechercherDepuisURL();
