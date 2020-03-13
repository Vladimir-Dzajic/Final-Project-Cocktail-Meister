const urlParams = new URLSearchParams(window.location.search);
const selectedParameter = urlParams.get('par').toLowerCase();

makeSearchRequestIngredients();

function showSearchResults(cocktailData) {
    for(let i = 0; i < cocktailData.length; i++) {
        const para = document.createElement("p");
        const cocktailLink = document.createElement("a");
        const img = document.createElement("img");
        img.src = cocktailData[i].strDrinkThumb + "/preview";
        let node = document.createTextNode(cocktailData[i].strDrink);
        cocktailLink.href = "cocktail-details.html?par=" + cocktailData[i].idDrink;
        cocktailLink.appendChild(img);
        cocktailLink.appendChild(node);
        para.appendChild(cocktailLink);

        const element = document.querySelector("#category-result");
        element.appendChild(para);
        }
} 

function makeSearchRequestIngredients() {

        fetch('/script/drinks.json')
        .then((response) => {
            return response.json();
        })
        .then((cocktails) => {
            let cocktailData = getFilteredCocktails(cocktails);

            showSearchResults(cocktailData);
        });
    
        function getFilteredCocktails(cocktails) {
            let filteredCocktails = [];
            if(selectedParameter !== 'non alcoholic'){
                for(let i = 0; i < cocktails.length; i++){
                    for (let j = 1; j < 16; j++){
                        let ingredient = cocktails[i]['strIngredient' + j];
                        if(ingredient !==null ){
                            ingredient = ingredient.toLowerCase();

                            if (ingredient.indexOf(selectedParameter) !== -1) {
                                filteredCocktails.push(cocktails[i]);
                            } 
                        }
                    }
                }
            }else {
                for(let i = 0; i < cocktails.length; i++){
                    if(cocktails[i].strAlcoholic.toLowerCase() === selectedParameter) {
                        filteredCocktails.push(cocktails[i]);
                    }
                }
            }
            return filteredCocktails;
        }   
    }       



    
