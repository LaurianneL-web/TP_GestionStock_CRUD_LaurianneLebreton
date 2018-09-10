/*global window */
/*global document */
/*global console */
/*jshint esversion :  6 */
/*jslint multivar, browser: true */
/**
 * @file Gestion du stock
 * @author LaurianneL
 * @copyright bizOnline 2018
 * @version 1.2.1
 */
/**
 * @function app - function IIFE
 */
var app = (function app() {
    "use strict";
    const port = 5555;
    const baseURL = `http://localhost:${port}/api/v1`;

    var form, btn_submit;
    
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

            xhr.send(data);
               
            } catch(err) {
                console.error(err);}
        
    };

    const logger = function logger(e) {
        e.preventDefault();
        const url = baseURL + "/login";
        const pass = document.querySelector("input[type='password']").value;
        const log = document.querySelector("input[type='text']").value;
        doAjax(url, "POST", function (res) {
            var response = JSON.parse(res);
            if(response.loc === `http://localhost:${port}/stock-manager`){
                document.location.href = response.loc;
            } else{
                if(JSON.parse(res).message){
                    alert(JSON.parse(res).message);
                }
            }
        },{
            username: log,
            password: pass
        });
    };

    /**
     * Initialise l'application au loaded du DOM
     */
    var start = function () {
        form = document.querySelector(".login-form form");
        btn_submit = document.querySelector(".login-form form button");
        btn_submit.onclick = logger;
    };
    window.addEventListener("DOMContentLoaded", start);
}());