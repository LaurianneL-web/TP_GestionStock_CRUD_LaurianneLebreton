/*global window */
/*global document */
/*global console */
/*jshint esversion :  6 */
/*jslint multivar, browser: true */
/**
 * @file Gestion du stock
 * @author TEAM : Laurianne Lebreton - Aïcha Ali - Pierre Berthélemy
 * @copyright bizOnline 2018
 * @version 1.2.1
 */
/**
 * @function app - function IIFE
 */
var app_stock = (function app_stock() {
    "use strict";
    const port = 5555;
    const baseURL = `http://localhost:${port}/api/v1`;

    var stock = [];
    var form, body_tbl, nom, brand, prix, descr, create, add, validProd, currentRef;
    
    /**
     * Permet de faire la liaison serveur/client
     * @function doAjax
     * @param  {string} url - L'url de destination de la requete
     * @param  {string} method - Méthode d'envoi de la requete
     * @param  {function} callback - Fonction a executer au retour de réponse de la requete
     * @param  {object} data - Données envoyées
     */
    const doAjax = function doAjax(url, method, callback, data) {
        try { 
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader("Content-Type", "application/json");
            data = data ? JSON.stringify(data) : null; // si y'a data alors data, sinon data = null.
            if (method.toLowerCase() === "post"){
                if (!data) throw new Error("bad call");
            }
            //on attend le retour de l'appel AJAX
            xhr.onload = evt => callback (evt.target.response || evt.srcElement.response);
            // console.log(data);
            xhr.send(data);
               
            } catch(err) {
                console.error(err);}
        
    };

    /**
     * Supprime le produit créé
     * @function deleteProduct
     * @param  {string} ref - La référence du produit
     */
    var deleteProduct = function (ref) {
        const url = baseURL + "/produit";
        const prod_id = this;
        console.log(prod_id);
        doAjax(url, "DELETE", function (res) {
            console.log(JSON.parse(res));
            var tr = document.getElementById(prod_id);
            tr.remove();
        },{id: prod_id});
        create.classList.add("is-active");
        form.style.top = "0px";
        form.style.opacity = "0";
    };
    /**
     * Permet la modification du produit
     * @function changeProduct
     * @param  {number} ref - La référence du produit
     */
    var changeProduct = function (ref) {
        form.style.top = "240px";
        form.style.opacity = "1";
        form.style.height = "130px";
        const id_prod = this;
        const tr_childs = document.getElementById(id_prod).childNodes;
        // var product = getProductByRef(this);
        var product = {
            nom: tr_childs.item(0).innerHTML,
            marque:tr_childs.item(2).innerHTML,
            prix: tr_childs.item(3).innerHTML,
            des: tr_childs.item(4).innerHTML
        };
        nom.value = product.nom;
        document.querySelector(`option[id=${product.marque}]`).selected = true
        prix.value = product.prix;
        descr.value = product.des;
        add.classList.remove("is-active");
        validProd.classList.add("is-active");
        create.classList.add("is-active");
        currentRef = id_prod;
    };
    /**
     * Vérifie les inputs au moment de l'ajout de produit
     * @function verifyInputs
     * @param  {string} nm - La value du nom du produit
     * @param  {number} pr - La value du prix du produit
     * @param  {string} ds - La value de la description du produit
     */
    var verifyInputs = function (nm, br, pr, ds) {
        if (nm === "" || Number(pr) < 0 || ds === "") {
            window.alert("Vous avez oublié de remplir un champ produit");
            return false;
        } else{return true;}
    };
    /**
     * Recupère et affiche les marques dans un select
     * @function getMarque
     * @returns {number} - La quantité du stock
     */
    var getMarque = function () {
        const url = baseURL + "/marque";
        var ul = document.querySelector("#sec_brand ul");
        brand.innerHTML = "";
        ul.innerHTML = "";
        try{
            doAjax(url, "GET", res => {
                var data = JSON.parse(res);
                if(data.length <=0){
                    const div = document.createElement('div');
                    div.style = "z-index:4; position:fixed; top: 50%; left: 50%; width:200px; height:20px; border: 1px solid #ccc; background-color: #f3f3f3;";
                    div.textContent = "Vous n'avez pas de marques. Veuillez en saisir.";
                    document.body.appendChild(div);
                    setTimeout(function(){
                        div.remove();
                    },5000);
                } else{
                    data.forEach(marque => {
                        var op = document.createElement("option");
                        op.value = marque.id_marque;
                        op.innerHTML = marque.nom;
                        op.id = marque.nom;
                        brand.appendChild(op);
                        var li = document.createElement("li");
                        var btn_del = document.createElement("button");
                        var btn_edit = document.createElement("button");
                        // var i_edit = document.createElement("i");
                        // i_edit.classList = "fas fa-edit";
                        // btn_edit.appendChild(i_edit);
                        btn_edit.classList.add("is-active");
                        var i_del = document.createElement("i");
                        i_del.classList = "fas fa-trash-alt";
                        btn_del.appendChild(i_del);
                        btn_del.classList.add("is-active");
                        li.id = 'br_' + marque.id_marque;
                        li.innerHTML = marque.nom;
                        // li.appendChild(btn_edit);
                        li.appendChild(btn_del);
                        // btn_edit.onclick = editMarque.bind(marque.id_marque);
                        btn_del.onclick = delMarque.bind(marque.id_marque);
                        ul.appendChild(li);
                    });
                }
            });
        } catch(err) {
            console.error(err);}
    };
    /**
     * Ajoute une marque
     * @function addMarque
     */
    var addMarque = function () {
        var inp = document.querySelector("#sec_brand input[type='text']");
        const url = baseURL + "/marque";
        doAjax(url,"POST", function (res) {
            console.log(JSON.stringify(res));
            getMarque();
        },{nom: inp.value});
    }
    /**
     * Modifie les marques
     * @function editMarque
     */
    var editMarque = function () {
        var id = this;
        var li = document.getElementById("br_" + id);
        var str = document.getElementById("br_" + id).textContent;
        // doAjax(url, "PATCH", function (res) {
        //     console.log(JSON.parse(res));
        //     getMarque();
        // },{id_marque: id, nom:});
    };
    /**
     * Supprime les marques
     * @function delMarque
     */
    var delMarque = function () {
        var id = this;
        const url = baseURL + "/marque";
        doAjax(url, "DELETE", function (res) {
            console.log(res);
        },{id:id});
        getMarque();
    };
    /**
     * Recupère et affiche le stock de produits
     * @function getProduct
     * @returns {number} - La quantité du stock
     */
    var getProducts = function () {
        const url = baseURL + "/produit";
        body_tbl.innerHTML = "";
        try{
            doAjax(url, "GET", res => {
                var data = JSON.parse(res);
                if(data.length <=0){
                    const div = document.createElement('div');
                    div.style = "z-index:4; position:fixed; top: 50%; left: 50%; width:200px; height:20px; border: 1px solid #ccc; background-color: #f3f3f3;";
                    div.textContent = "Votre stock est vide. Veuillez le remplir.";
                    document.body.appendChild(div);
                    setTimeout(function(){
                        div.remove();
                    },5000);
                } else{
                    data.forEach(product => {
                        var verif = verifyInputs(product.nom, product.brand, product.prix, product.description);
                        if(verif === false){
                            // return verif;
                        } else{
                            createTableLigne(product.id, product.nom, product.brand, product.prix, product.description);
                        }
                    });
                }
            });
        } catch(err) {
            console.error(err);}
    };
    /**
     * Crée des lignes dans le tableau
     * @function createTableLigne
     * @param  {number} ref - La référence du produit
     * @param  {string} nom - Le nom du produit
     * @param  {number} prix - Le prix du produit
     * @param  {string} des - La description du produit
     */
    var createTableLigne = function (ref,nom,brand,prix,des) {
        var tr = document.createElement("tr");
        tr.classList.add("objet");
        tr.setAttribute("id",ref);
        // Creation de cellules du tableau
        var td_n = document.createElement("td");
        var td_ref = document.createElement("td");
        var td_brd = document.createElement("td");
        var td_prix = document.createElement("td");
        var td_desc = document.createElement("td");
        var td_btn = document.createElement("td");
        // Creation des boutons d'action
        var btn_changeProd = document.createElement("button");
        var btn_delProd = document.createElement("button");
        var i_edit = document.createElement("i");
        i_edit.classList = "fas fa-edit";
        btn_changeProd.appendChild(i_edit);
        var i_del = document.createElement("i");
        i_del.classList = "fas fa-trash-alt";
        btn_delProd.appendChild(i_del);
        btn_changeProd.onclick = changeProduct.bind(ref);
        btn_delProd.onclick = deleteProduct.bind(ref);
        // Initialisation des styles des bouttons
        btn_changeProd.classList.add("is-active");
        btn_delProd.classList.add("is-active");
        btn_changeProd.classList.add("stylebtn");
        btn_delProd.classList.add("stylebtn");
        // Ajout des cellules et leur contenu à la ligne
        tr.appendChild(td_n).innerHTML = nom;
        tr.appendChild(td_ref).innerHTML = ref;
        tr.appendChild(td_brd).innerHTML = brand;
        tr.appendChild(td_prix).innerHTML = prix;
        tr.appendChild(td_desc).innerHTML = des;
        td_btn.appendChild(btn_changeProd);
        td_btn.appendChild(btn_delProd);
        tr.appendChild(td_btn);
        // Ajout de la ligne au tableau
        body_tbl.appendChild(tr);
    };
    /**
     * Add product to array & create line after verify
     * @function addProduct
     */
    var addProduct = function () {
        const url = baseURL + "/produit";
        var verif = verifyInputs(nom.value, brand.value, prix.value, descr.value);
        if(verif === false){
            return verif;
        } else{
            doAjax(url, "POST", function (res) {
                console.log(JSON.stringify(res));
                getProducts();
                // Reinitialisation du formulaire
                nom.value = "";
                prix.value = "0";
                descr.value = "";
            }, {
                nom: nom.value,
                id_marque: brand.value,
                prix:prix.value,
                description: descr.value
            });
        }
    };
    /**
     * Valide la modification du produit
     * @function validChangeProduct
     */
    var validChangeProduct = function () {
        const url = baseURL + "/produit";
        var verif = verifyInputs(nom.value, brand.value, prix.value, descr.value);
        if(verif === false){
            return verif;
        } else{
            var product = {
                id: currentRef,
                nom: nom.value,
                id_marque: brand.value,
                prix: prix.value,
                description: descr.value
            };
            doAjax(url, "PATCH", function (res) {
                console.log(JSON.parse(res));
                getProducts();
            },product);
            form.style.top = "0px";
            form.style.opacity = "0";
            return verif;
        }
    };
    /**
     * Ouvre le formulaire
     * @function openForm
     */
    var openForm = function () {
        nom.value = "";
        prix.value = "0";
        descr.value = "";
        create.classList.remove("is-active");
        validProd.classList.remove("is-active");
        add.classList.add("is-active");
        form.style.top = "240px";
        form.style.opacity = "1";
        form.style.height = "130px";
    };
    var endLog = function () {
        const url = baseURL + "/login";
        doAjax(url, "PATCH", function (res) {
            console.log(JSON.parse(res));
        },{win: "closing"});
    };
    /**
     * Initialise l'application au loaded du DOM
     */
    var start = function () {
        const sec_stock = document.getElementById("sec_stock");
        const sec_brand = document.getElementById("sec_brand");
        const btn_stock = document.getElementById("btn_stock");
        const btn_brand = document.getElementById("btn_brand");
        btn_stock.onclick = function () {
            sec_stock.style.display = "block";
            sec_brand.style.display = "none";
            getProducts();
        };
        btn_brand.onclick = function () {
            sec_brand.style.display = "block";
            sec_stock.style.display = "none";
            getMarque();
        };
        const add_brand = document.getElementById("add_brand");
        add_brand.onclick = addMarque;
        form = document.getElementById("formulaire");
        body_tbl = document.getElementById("body_tbl");
        nom = document.getElementById("nom");
        brand = document.getElementById("brand");
        prix = document.getElementById("prix");
        descr = document.getElementById("des");
        create = document.getElementById("createProd");
        add = document.getElementById("addProd");
        validProd = document.getElementById("validProd");
        create.onclick = openForm;
        add.onclick = addProduct;
        validProd.onclick = validChangeProduct;
        getProducts();
        getMarque();
    };
    window.addEventListener("DOMContentLoaded", start);
    window.onbeforeunload  = endLog;
}());