const apiKey = 'b6ce5b27efdc489f9e8553506e01383e';

function searchRecipes() {
    const query = document.getElementById('searchInput').value;
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&addRecipeInformation=true&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.results);
        });
}

function displayRecipes(recipes) {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = '';
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="card-content">
                <h3>${recipe.title}</h3>
                <p><strong>🕒 Preparation Time:</strong> ${recipe.readyInMinutes || 'N/A'} mins</p>
                <p><strong>🍽️ Servings:</strong> ${recipe.servings || 'N/A'}</p>
            </div>
            <div class="card-footer">
                <button class="add-to-favorites" onclick="saveToFavorites(${recipe.id}, '${recipe.title}', '${recipe.image}')">Add to Favorites</button>
            </div>
        `;
        card.onclick = () => {
            window.location.href = `details.html?id=${recipe.id}`;
        };
        grid.appendChild(card);
    });
}

function loadFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(fav => {
        const favCard = document.createElement('div');
        favCard.classList.add('card');
        favCard.innerHTML = `
            <img src="${fav.image}" alt="${fav.title}">
            <h3>${fav.title}</h3>
        `;
        favCard.onclick = () => {
            window.location.href = `details.html?id=${fav.id}`;
        };
        favoritesGrid.appendChild(favCard);
    });
}

function loadRecipeDetails() {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');
    
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(recipe => {
            document.getElementById('recipeTitle').innerText = recipe.title;
            document.getElementById('recipeImage').src = recipe.image;
            document.getElementById('prepTime').innerText = recipe.readyInMinutes;
            document.getElementById('servings').innerText = recipe.servings;
            document.getElementById('healthScore').innerText = recipe.healthScore;

            const ingredientsList = document.getElementById('recipeIngredients');
            ingredientsList.innerHTML = '';
            recipe.extendedIngredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.innerText = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`;
                ingredientsList.appendChild(li);
            });

            const instructionsContainer = document.getElementById('recipeInstructions');
            instructionsContainer.innerHTML = '<ol></ol>';
            const steps = recipe.instructions.split(/(?:\r?\n|\.\s|\n)/);
            steps.forEach(step => {
                if (step.trim()) { 
                    const li = document.createElement('li');
                    li.innerText = step.trim();
                    instructionsContainer.querySelector('ol').appendChild(li);
                }
            });
        })
        .catch(error => {
            document.getElementById('recipeInstructions').innerText = "Error loading recipe details.";
            console.error("Error fetching recipe details:", error);
        });
}

function saveToFavorites(id, title, image) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.find(fav => fav.id === id)) {
        favorites.push({ id, title, image });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}


function autocompleteSuggestions() {
    const query = document.getElementById('searchInput').value;
    if (query.length > 2) {
        fetch(`https://api.spoonacular.com/recipes/autocomplete?number=5&query=${query}&apiKey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                const suggestions = document.getElementById('autocompleteSuggestions');
                suggestions.innerHTML = '';
                data.forEach(item => {
                    const suggestion = document.createElement('div');
                    suggestion.innerText = item.title;
                    suggestion.onclick = () => {
                        document.getElementById('searchInput').value = item.title;
                        suggestions.innerHTML = '';
                        searchRecipes();
                    };
                    suggestions.appendChild(suggestion);
                });
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.contains(document.getElementById('recipeGrid'))) {
        searchRecipes();
    } else if (document.body.contains(document.getElementById('favoritesGrid'))) {
        loadFavorites();
    } else if (document.body.contains(document.getElementById('recipeTitle'))) {
        loadRecipeDetails();
    }

    document.getElementById('searchInput').addEventListener('input', autocompleteSuggestions);
});





