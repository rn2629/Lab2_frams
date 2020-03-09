
var bd;

// Tentative d'ouverture de la bd
// Le deuxième paramètre représente le numéro de version
var requete = indexedDB.open("BdRodrigue", 1);

// Créer ou mettre à jour (si le numéro de version change)
requete.onupgradeneeded = function(event){
    var bd = event.target.result;

    // Création du "store" à l'aide des options
    var options = {
        keyPath: "cle", //nom de la clé primaire
        autoIncrement: true //true si la clé primaire peut être générée
    };
    var produit = bd.createObjectStore("MonCommerce", options);

    // Création d'un index, qui permet la recherche
    produit.createIndex("nomIndex", "cle");

    // Ajout de données
    produit.transaction.oncomplete = function(event){
        // Ouverture de la transaction
        var trans = bd.transaction("MonCommerce", "readwrite");
        var MonCommerce = trans.objectStore("MonCommerce");
        console.log(MonCommerce);
        // Ajout
        MonCommerce.add({
            cle: 1,
            quantite : 100,
            nom : "USB_KEY",
            urlImage :"https://shop.westerndigital.com/content/dam/store/en-us/assets/products/usb-flash-drives/extreme-pro-usb-3-1/gallery/extreme-pro-usb-3-1-open-angle2.png",
            prix : 20,
            fournisseur : "RN2629.INC",
            description : "Best Performance Usb Device",
            autre: true
        });

    };
};


const Liste = { template: '#liste' };
const Details = { template: '#produit' };
const Ajout = { template: '#ajout' };
const Modification = { template: '#modification',watch:{$route(to,from){}} };


const routes = [
    { path: '/', component: Liste },
    { path: '/produits/:produitId', component: Details },
    { path: '/ajout', component: Ajout },
    { path: '/produits/produiutId/edition', component: Modification }
];



requete.onsuccess = function(event){
    bd = event.target.result;
    afficherListe();
};

function afficherListe()
{

    app.produits=[];
    var transaction = bd.transaction(["MonCommerce"], "readwrite");
    var MonCommerce = transaction.objectStore("MonCommerce");
    MonCommerce.openCursor().onsuccess = function(event){
        var cursor = event.target.result;
        if(cursor){
            app.produits.push(cursor.value);
            cursor.continue();
        }

    };
    console.log(app.produits);

}

requete.onerror = function(event){
    console.log(event.target.errorCode);
};




const router = new VueRouter({
    routes
});

const app = new Vue({
    router,

    data:{
        produits:[]
    },
    methods: {
        Modifier: function (id) {
            router.push('/produits/'+id+'/edition');

            console.log(this.$route.params.produitId);
            var int = parseInt(this.$route.params.produitId);
            console.log(int);
            var transaction = bd.transaction(["MonCommerce"], "readwrite");
            var MonCommerce = transaction.objectStore("MonCommerce");
            var requete = MonCommerce.get(id);
            requete.onsuccess = function (event) {
                console.log(event.target.result.nom);
                $("#modifId").val(event.target.result.noProduit);
                $("#nomM").val(event.target.result.nom);
                $("#prixM").val(event.target.result.prix);
                $("#modifImg").attr('src', event.target.result.urlImage);
                $("#fournisseurM").val(event.target.result.fournisseur);
                $("#qtiteM").val(event.target.result.quantite);
                $("#descM").val(event.target.result.description);
            };
        },

        Details: function (id) {
            router.push('/produits/' + id);

            var transaction = bd.transaction(["MonCommerce"], "readwrite");
            var MonCommerce = transaction.objectStore("MonCommerce");
            var requete = MonCommerce.get(id);
            requete.onsuccess = function (event) {
                console.log(event.target.result.quantite);
                $("#IdP").val(event.target.result.cle);
                $("#qtiteP").text(event.target.result.quantite);
                $("#nomP").text(event.target.result.nom);
                $("#imgP").attr('src', event.target.result.urlImage);
                $("#prixP").text(event.target.result.prix);
                $("#fournisseurP").text(event.target.result.fournisseur);
                $("#descP").text(event.target.result.description);
            };
        }
    }
}).$mount('#app');


function AjoutProduit()
{
  var Valid = true;

    if(validNom(document.getElementById("txtNom").value)=== false){

        Valid = false;
        document.getElementById("txtNom").style.borderColor = "Red";
    }
    if(validPrix(document.getElementById("prix").value)=== false) {

        Valid = false;
        document.getElementById("prix").style.borderColor = "Red";
    }
    if(validQtite(document.getElementById("qtite").value)=== false) {

        Valid = false;
        document.getElementById("qtite").style.borderColor = "Red";
    }
    if(validFournisseur(document.getElementById("txtFournisseur").value)=== false) {

        Valid = false;
        document.getElementById("txtFournisseur").style.borderColor = "Red";
    }
    if((document.getElementById("AddImg").value)=== "") {

        Valid = false;
        document.getElementById("AddImg").style.borderColor = "Red";
    }

    if(Valid===true){
        router.push("/");
        var transaction = bd.transaction(["MonCommerce"], "readwrite");
        var MonCommerce = transaction.objectStore("MonCommerce");
        MonCommerce.add({
            nom : (document.getElementById("txtNom").value),
            quantite : (document.getElementById("qtite").value),
            urlImage :(document.getElementById("AddImg").value),
            prix : (document.getElementById("prix").value),
            fournisseur : (document.getElementById("txtFournisseur").value),
            description : document.getElementById("txtDescription").value,
            autre: true
        });
        afficherListe();
    }

return Valid;

}

function ModifierProduit(){
}



function validNom(chaine)
{
    return /^[a-zA-Z,.!? ]*$/.test(chaine)
}
function validFournisseur(chaine)
{
    return /^[a-zA-Z,.!? ]*$/.test(chaine)
}
function validPrix(chaine)
{
    return /(\d+\.\d{1,2})|^[0-9]*$/.test(chaine)
}
function validQtite(chaine)
{
    return /(\d+\.\d{1,2})|^[0-9]*$/.test(chaine)
}


function modifImage(){
    $("#imgModif").attr('src',$("#btnImg").val());

}

function addImage(){
    $("#imgAdd").attr('src',$("#AddImg").val());
}


function Inventaire()
{
    router.push("/");
}



/**
const Liste = { template: '#liste' };
const Produit = { template: '#produit' };
const Ajout = { template: '#ajout' };
const Modification = { template: '#modification' };


const routes = [
    { path: '/liste', component: Liste },
    { path: '/produit', component: Produit },
    { path: '/ajout', component: Ajout },
    { path: '/modification', component: Modification },
];

const router = new VueRouter({
    routes
});

const app = new Vue({
    router
}).$mount('#app');
**/

/**
// Creation BD
var bd;
var requete = indexedDB.open("BDRod", 1);

requete.onupgradeneeded = function(event){
    var bd = event.target.result};

var options = {
    keyPath: "cle",
    autoIncrement: true
};

var commerce = bd.createObjectStore("MonCommerce", options);
//Creation de l<index de recherche
commerce.createIndex("produit", "cle");

//Ajout de donnees
commerce.transaction.oncomplete = function(event){

    var trans = bd.transaction("MonCommerce", "readwrite");
    var monCommerce = trans.objectStore("MonCommerce")};
    Console.log(monCommerce);

monCommerce.add({
    noProduit:1,
    nomProduit: "USB_KEY",
    prix: 20,
    quantite:100,
    fournisseur: RN2629.Inc,
    image:"assets/images/usb.jpg",
    description: "Usb Key made by Rn2629.Inc best perfomance"
});

//Gestion des erreurs d'ouverture
requete.onerror = function(event){
    console.log(event.target.errorCode);
};

// En cas de succès, "bd" contient la connexion
requete.onsuccess = function(event) {
    bdRod = event.target.result;
};

function AjoutProduit()
{
    var nom = document.getElementById("txtNom").value;
    var prix = document.getElementById("txtPrix").value;
    var fournisseur = document.getElementById("txtFournisseur").value;
    var description = document.getElementById("txtDescription").value;
    var image = "assets/images/" + document.getElementById("image").files[0].name;
    var quantite = document.getElementById("noQuantite").value;
    var transaction = bd.transaction(["MonCommerce"], "readwrite");
    var monCommerce = transaction.objectStore("MonCommerce");
    monCommerce.add({
        nomProduit: nom,
        prix: prix,
        fournisseur: fournisseur,
        description: description,
        image: image,
        quantite: quantite
    });
    alert("Le produit : " + nom + " à été ajouté avec succès !");
}

function AfficherProduit(produitId)
{
    requete = indexedDB.open("BDRod", 1);
    requete.onsuccess = function(event)
    {
        var transaction = bd.transaction(["MonCommerce"], "readonly");
        var monCommerce = transaction.objectStore("MonCommerce");
        monCommerce.openCursor().onsuccess = function(event){
            var cursor = event.target.result;
            for (i = 1; i < produitId; i++) {
                cursor.continue();
            }
            if(cursor)
            {
                document.getElementById("nomProduit").innerHTML = cursor.value.nomProduit;
                document.getElementById("prixProduit").innerHTML = "$" + cursor.value.prix;
                document.getElementById("fProduit").innerHTML = cursor.value.fournisseur;
                document.getElementById("descProduit").innerHTML = cursor.value.description;
                document.getElementById("imageProduit").src = cursor.value.image;
                document.getElementById("qtiteProduit").innerHTML = cursor.value.quantite;
            }
        }
    };
}

function AfficherListe() {

    var transaction = bd.transaction(["MonCommerce"], "readonly");
    var monCommerce = transaction.objectStore("MonCommerce");
    var requeteObjets = monCommerce.count();
    var nombreObjets;
    requeteObjets.onsuccess = function () {
        nombreObjets = requeteObjets.result;
        console.log(nombreObjets);
    };
}
 **/
