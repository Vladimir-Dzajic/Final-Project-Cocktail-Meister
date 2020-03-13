const urlParams = new URLSearchParams(window.location.search);
const selectedParameter = urlParams.get('par');
makeSearchRequest();

let isLikeActive = false;

function addEventListener (cocktailDrinks) {
    const cocktailDrink = cocktailDrinks[0];

    let favCocktailsStr = localStorage.getItem('favCocktails');
    let favCocktails = favCocktailsStr != null ? JSON.parse(favCocktailsStr) : [];

    //to persistently remember liked cocktail even after restarting the browser
    const index = favCocktails.indexOf(cocktailDrink.idDrink);
    if(index > -1) {
        isLikeActive = true;
        document.querySelector("#like").src = "img/like.png";
    }

    document.querySelector("#like").addEventListener("click", function favCocktails() {
        let favCocktailsStr = localStorage.getItem('favCocktails');
        let favCocktails = favCocktailsStr != null ? JSON.parse(favCocktailsStr) : [];
       
        isLikeActive = !isLikeActive;
        if(isLikeActive) {
            favCocktails.push(cocktailDrink.idDrink);
            localStorage.setItem('favCocktails', JSON.stringify(favCocktails));
            document.querySelector("#like").src = "img/like.png";

        } else {
            const index = favCocktails.indexOf(cocktailDrink.idDrink);
            if (index > -1) {
                favCocktails.splice(index, 1);
            }
            localStorage.setItem('favCocktails', JSON.stringify(favCocktails));
            document.querySelector("#like").src = "img/like-disabled.png"; 
        }
    }); 

    //wechselt Sprache der Mixanleitung
    document.querySelector("#british-flag").addEventListener("click", function changeTextEn() {
        document.querySelector("#cocktail-instr").innerHTML = "Instructions: " + cocktailDrink.strInstructions;
    });

    if(cocktailDrink.strInstructionsDE !== null) {
        document.querySelector("#german-flag").addEventListener("click", function changeTextDe() {
            document.querySelector("#cocktail-instr").innerHTML = "Mixanleitung: " + cocktailDrink.strInstructionsDE;
        });
    } else {
        document.querySelector("#german-flag").addEventListener("click", function changeTextDe() {
            document.querySelector("#cocktail-instr").innerHTML = "German version is unfortunately not available for this cocktail.";
        });
    }
}

function showCocktailDetails(response) {
    let cocktailDrink = response[0];
    const element = document.querySelector("#ingredients-result");
    const cocktailInfoDiv = document.createElement("div");
    const ingredintsPictureDiv = document.createElement("div");
    const ingredientsDiv = document.createElement("div");

    const cocktailname = document.createElement("h2");
    const cocktailInstr = document.createElement("p");
    const cocktailCategory = document.createElement("p");
    const cocktailGlass = document.createElement("p");
    const cocktailPara = document.createElement("p");
    const cocktailImg = document.createElement("img");

    ingredientsDiv.id = "ingredients-div"
    cocktailInfoDiv.id = "cocktail-info";
    ingredintsPictureDiv.id = "ingredients-picture-div";
    cocktailname.classList.add("cocktail-name");
    cocktailInstr.id = "cocktail-instr";

    const languageFlags = document.createElement("p");
    const germanFlag = document.createElement("img");
    const britishFlag = document.createElement("img");
    germanFlag.src = "img/british-flag.png";
    germanFlag.id = "british-flag";
    britishFlag.src = "img/german-flag.png";
    britishFlag.id = "german-flag";
    languageFlags.appendChild(germanFlag);
    languageFlags.appendChild(britishFlag);
    languageFlags.id = "language-flags";

    cocktailImg.src = cocktailDrink.strDrinkThumb; 
    cocktailImg.id = "cocktail-photo"; 
   
    const likeDislike = document.createElement("p");
    const like = document.createElement("img");

    like.src = "img/like-disabled.png";
    like.id = "like";

    likeDislike.id = "like-dislike"
    likeDislike.appendChild(like);

    let cocktailGlassNode = document.createTextNode("Glass Type: " + cocktailDrink.strGlass);
    let cocktailCategoryNode = document.createTextNode("Category: " + cocktailDrink.strAlcoholic);
    let cocktailnameNode = document.createTextNode(cocktailDrink.strDrink);
    let cocktailInstrNode = document.createTextNode("Instructions: " + cocktailDrink.strInstructions);

    cocktailPara.appendChild(cocktailImg);
    cocktailGlass.appendChild(cocktailGlassNode);
    cocktailCategory.appendChild(cocktailCategoryNode);
    cocktailname.appendChild(cocktailnameNode);
    cocktailInstr.appendChild(cocktailInstrNode);

    let counter = 1;
    let strIngredient = cocktailDrink['strIngredient' + counter];
    let strMeasure = cocktailDrink['strMeasure' + counter];

    element.appendChild(cocktailname);
    element.appendChild(ingredintsPictureDiv);
    element.appendChild(ingredientsDiv);
    ingredintsPictureDiv.appendChild(cocktailPara);
    ingredintsPictureDiv.appendChild(cocktailInfoDiv);

    //zeige all Zutaten des Coctails an
    while(strIngredient != null && strMeasure != null) {
        const cocktailIngredient = document.createElement("p");
        const ingredientImg = document.createElement("img");
        ingredientImg.src = "https://www.thecocktaildb.com/images/ingredients/" + strIngredient + "-Medium.png";
        let cocktailIngredientNode = document.createTextNode(strMeasure + " " + strIngredient);
        cocktailIngredient.appendChild(ingredientImg);
        cocktailIngredient.appendChild(cocktailIngredientNode);

        ingredientsDiv.appendChild(cocktailIngredient);
        // get next ingredient for this cocktail
        counter = counter + 1;
        strIngredient =  cocktailDrink['strIngredient' + counter];
        strMeasure = cocktailDrink['strMeasure' + counter];
    }
    
    cocktailInfoDiv.appendChild(cocktailGlass);
    cocktailInfoDiv.appendChild(cocktailCategory);
    cocktailInfoDiv.appendChild(languageFlags);
    cocktailInfoDiv.appendChild(cocktailInstr);
    cocktailInfoDiv.appendChild(likeDislike);   
} 

function makeSearchRequest() {
    //erst nach dem die Daten vom Server eingetroffen sind, starte die Anzeige
    fetch('./script/drinks.json')
    .then((response) => {
        return response.json();
    })
    .then((cocktails) => {
        let cocktailData = getCocktailData(cocktails);
        showCocktailDetails(cocktailData);
        addEventListener(cocktailData);
    });

    function getCocktailData(cocktails) {
        let cocktailData = [];
        
        for (let i = 0; i < cocktails.length; i++) {
            if (cocktails[i].idDrink === selectedParameter) {
                cocktailData.push(cocktails[i]); 
            }
        }

        return cocktailData;
    }    
}


