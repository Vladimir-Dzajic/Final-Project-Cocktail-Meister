const fse = require('fs-extra');
const fetch = require("node-fetch");

let unique = [];
let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

const filePath = 'public/script/drinks.json';

function importCocktails() {
    for(let i = 0; i< alphabet.length; i++) {

        let apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + alphabet[i];

        fetch(apiUrl)
        .then((response) => {
                return response.json();
        })
        .then((cocktails) => {
            filterUniqueCocktails(cocktails.drinks);

            if((i + 1) === alphabet.length) {
                console.log('amount of filtered cocktails is: ' + unique.length);
                fse.outputJsonSync(filePath, unique, {spaces: 2});
            }
        });

        function filterUniqueCocktails(drinks){
            let isCocktailUnique = true;

            for(let i = 0; i < drinks.length; i++) {
                for(let j = 0; j < unique.length; j++) {
                    if( drinks[i].idDrink === unique[j].idDrink) {
                        isCocktailUnique = false;
                    }
                }

                if (isCocktailUnique) {
                    unique.push(drinks[i])
                }

                isCocktailUnique = true;
            } 
        }
    }
}
            
module.exports = importCocktails;