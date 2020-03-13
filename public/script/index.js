let apiUrl;
const serachButton = document.querySelector("#button");
const element = document.querySelector("#cocktail-results");
const close = document.querySelector("header div");

close.addEventListener("click", closeDiv);
serachButton.addEventListener("click", makeSearchRequest);

function closeDiv() {
    close.classList.add('closed');
}

function showSuggestions(cocktailData) {   
    document.querySelector("#suggestions").innerHTML = "";
    for(let i = 0; i < cocktailData.length; i++) {
        let drinkNameLowerCase = cocktailData[i].drinkName.toLowerCase();
        if(drinkNameLowerCase.includes(searchFieldValue.toLowerCase())){
            const listElement = document.createElement("li");
            const cocktailLink = document.createElement("a");
            cocktailLink.href = "cocktail-details.html?par=" + cocktailData[i].drinkId;
            let node = document.createTextNode(cocktailData[i].drinkName);
            console.log(node);
            cocktailLink.appendChild(node);
            listElement.appendChild(cocktailLink);

            const element = document.querySelector("#suggestions");
            element.appendChild(listElement);
        }
    }

};

function makeSearchRequest() {
    searchFieldValue = document.querySelector("#search").value;

    if(searchFieldValue.length >= 3) {
        fetch('./script/drinks.json')
        .then((response) => {
            return response.json();
        })
        .then((cocktails) => {
            let cocktailData = getCocktailData(cocktails);
            showSuggestions(cocktailData);
        });
        function getCocktailData(cocktails) {
            let cocktailData = [];
            

            cocktails.forEach(drink => {
                let cocktailObj = {};
                cocktailObj = {drinkName:drink.strDrink, drinkThumb:drink.strDrinkThumb, drinkId:drink.idDrink};
                cocktailData.push(cocktailObj);
            });
            return cocktailData;
        }       
    }
    
}








