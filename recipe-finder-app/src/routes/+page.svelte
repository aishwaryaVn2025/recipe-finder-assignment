<script lang="ts">
	let searchText = $state('');
	let cuisine = $state('');
	let category = $state('');
	let recipes = $state<any[]>([]);
	let customRecipes = $state<any[]>([]);
	let message = $state('');

	$effect(() => {
		customRecipes = JSON.parse(
			localStorage.getItem('customRecipes') || '[]'
		);
	});

	async function searchRecipes() {
		message = 'Searching...';
		recipes = [];

		try {
			let meals: any[] = [];

			// If category is selected, start with category
			if (category) {
				const response = await fetch(
					`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`
				);

				const data = await response.json();
				meals = data.meals || [];
			}

			// If only cuisine is selected
			else if (cuisine) {
				const apiCuisine =
					cuisine === 'Indian'
						? 'India'
						: cuisine;

				const response = await fetch(
					`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(apiCuisine)}`
				);

				const data = await response.json();
				meals = data.meals || [];
			}

			// Search text
			else if (searchText.trim()) {
				const text = searchText.trim();

				let response = await fetch(
					`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(text)}`
				);

				let data = await response.json();
				meals = data.meals || [];

				// If recipe-name search gives nothing, try ingredient
				if (meals.length === 0) {
					response = await fetch(
						`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(text)}`
					);

					data = await response.json();
					meals = data.meals || [];
				}
			}

			// Nothing selected
			else {
				const response = await fetch(
					'https://www.themealdb.com/api/json/v1/1/search.php?s='
				);

				const data = await response.json();
				meals = data.meals || [];
			}

			let fullRecipes: any[] = [];

			// Get full details for filtered recipes
			for (let meal of meals) {
				if (meal.strArea && meal.strCategory) {
					fullRecipes.push(meal);
				}
				else {
					const response = await fetch(
						`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
					);

					const data = await response.json();

					if (data.meals) {
						fullRecipes.push(data.meals[0]);
					}
				}
			}

			// Search text filter
			if (searchText.trim()) {
				const text = searchText.trim().toLowerCase();

				fullRecipes = fullRecipes.filter((recipe) => {
					const nameMatches =
						recipe.strMeal
							?.toLowerCase()
							.includes(text);

					let ingredientMatches = false;

					for (let i = 1; i <= 20; i++) {
						const ingredient =
							recipe[`strIngredient${i}`];

						if (
							ingredient &&
							ingredient
								.toLowerCase()
								.includes(text)
						) {
							ingredientMatches = true;
							break;
						}
					}

					return nameMatches || ingredientMatches;
				});
			}

			// Cuisine filter
			if (cuisine) {
				fullRecipes = fullRecipes.filter((recipe) => {
					const area =
						recipe.strArea?.toLowerCase();

					if (cuisine === 'Indian') {
						return (
							area === 'india' ||
							area === 'indian'
						);
					}

					return area === cuisine.toLowerCase();
				});
			}

			// Category filter
			if (category) {
				fullRecipes = fullRecipes.filter(
					(recipe) =>
						recipe.strCategory
							?.toLowerCase() ===
						category.toLowerCase()
				);
			}

			recipes = fullRecipes;

			if (recipes.length === 0) {
				message = 'No recipes found';
			}
			else {
				message = '';
			}
		}
		catch (error) {
			console.error(error);
			message = 'Something went wrong. Please try again.';
		}
	}

	function deleteRecipe(id: string) {
		customRecipes = customRecipes.filter(
			(recipe) => recipe.idMeal !== id
		);

		localStorage.setItem(
			'customRecipes',
			JSON.stringify(customRecipes)
		);
	}
</script>

<svelte:head>
	<title>Recipe Finder</title>
</svelte:head>

<div class="page">

	<div class="hero">
		<h1>🍴 Recipe Finder</h1>
		<p>Search and discover your favourite recipes</p>
	</div>

	<div class="search-box">

		<input
			placeholder="Search recipes..."
			bind:value={searchText}
		/>

		<select bind:value={cuisine}>
			<option value="">All Cuisines</option>
			<option value="Indian">Indian</option>
			<option value="Italian">Italian</option>
			<option value="Chinese">Chinese</option>
			<option value="American">American</option>
			<option value="British">British</option>
		</select>

		<select bind:value={category}>
			<option value="">All Categories</option>
			<option value="Chicken">Chicken</option>
			<option value="Seafood">Seafood</option>
			<option value="Vegetarian">Vegetarian</option>
			<option value="Dessert">Dessert</option>
		</select>

		<button onclick={searchRecipes}>
			Search
		</button>

	</div>

	{#if message}
		<p class="message">{message}</p>
	{/if}

	<!-- API Recipes -->
	{#if recipes.length > 0}

		<div class="recipe-list">

			{#each recipes as recipe}

				<div class="api-card">

					<img
						src={recipe.strMealThumb}
						alt={recipe.strMeal}
					/>

					<div class="api-card-content">

						<h2>{recipe.strMeal}</h2>

						<p>
							{recipe.strArea} • {recipe.strCategory}
						</p>

						<a
							class="view-button"
							href={`/recipes/${recipe.idMeal}`}
						>
							View Recipe
						</a>

					</div>

				</div>

			{/each}

		</div>

	{/if}

	<!-- Custom Recipes -->
	{#if customRecipes.length > 0}

		<h2 class="my-title">
			My Recipes
		</h2>

		<div class="recipe-list">

			{#each customRecipes as recipe}

				<div class="recipe-card">

					<h2>
						{recipe.strMeal}
					</h2>

					<p>
						<strong>Category:</strong>
						{recipe.strCategory}
					</p>

					<p>
						<strong>Ingredients:</strong>
						{recipe.ingredients}
					</p>

					<div class="actions">

						<a href={`/recipes/edit?id=${recipe.idMeal}`}>
							Edit
						</a>

						<button
							onclick={() =>
								deleteRecipe(recipe.idMeal)}
						>
							Delete
						</button>

					</div>

				</div>

			{/each}

		</div>

	{/if}

	<div class="add-section">

		<a
			class="add-button"
			href="/recipes/new"
		>
			+ Add Recipe
		</a>

	</div>

</div>

<style>
	:global(body) {
		margin: 0;
		background: #fffaf5;
	}

	.page {
		max-width: 1200px;
		margin: auto;
		padding: 45px 25px;
		font-family: Arial, sans-serif;
	}

	.hero {
		text-align: center;
		margin-bottom: 30px;
	}

	.hero h1 {
		font-size: 38px;
		margin-bottom: 8px;
		color: #d35400;
	}

	.hero p {
		color: #666;
		font-size: 17px;
		margin: 0;
	}

	.search-box {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin: 30px auto 40px;
		padding: 22px;
		background: #fff3e8;
		border: 1px solid #f3c9a7;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	input {
		width: 350px;
		padding: 12px 15px;
		font-size: 16px;
		border: 1px solid #d9c2af;
		border-radius: 6px;
		background: white;
	}

	select {
		padding: 12px;
		font-size: 16px;
		border: 1px solid #d9c2af;
		border-radius: 6px;
		background: white;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #ea580c;
	}

	button {
		padding: 11px 18px;
		border: 1px solid #ea580c;
		border-radius: 6px;
		background: #ea580c;
		color: white;
		cursor: pointer;
		font-size: 15px;
	}

	button:hover {
		background: #c2410c;
	}

	.message {
		text-align: center;
		font-size: 16px;
		margin: 25px 0;
		color: #666;
	}

	.recipe-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		margin-top: 30px;
	}

	.api-card {
		background: white;
		border: 1px solid #f0d7c2;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: transform 0.2s ease;
	}

	.api-card:hover {
		transform: translateY(-4px);
	}

	.api-card img {
		width: 100%;
		height: 220px;
		object-fit: cover;
		display: block;
	}

	.api-card-content {
		padding: 18px;
	}

	.api-card-content h2 {
		font-size: 19px;
		margin: 0 0 8px;
		color: #d35400;
	}

	.api-card-content p {
		color: #666;
		margin-bottom: 18px;
	}

	.view-button {
		display: inline-block;
		padding: 9px 14px;
		background: #ea580c;
		color: white;
		text-decoration: none;
		border-radius: 6px;
	}

	.view-button:hover {
		background: #c2410c;
	}

	.recipe-card {
		border: 1px solid #f0d7c2;
		border-radius: 10px;
		padding: 18px;
		color: black;
		background: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.recipe-card h2 {
		font-size: 19px;
		margin-top: 5px;
		color: #d35400;
	}

	.recipe-card p {
		color: #555;
		line-height: 1.5;
	}

	.my-title {
		margin-top: 55px;
		padding-bottom: 10px;
		border-bottom: 2px solid #f3c9a7;
		color: #d35400;
	}

	.actions {
		display: flex;
		gap: 10px;
		margin-top: 15px;
	}

	.actions a {
		padding: 9px 14px;
		border: 1px solid #ea580c;
		border-radius: 5px;
		background: white;
		color: #ea580c;
		text-decoration: none;
	}

	.actions a:hover {
		background: #fff3e8;
	}

	.actions button {
		padding: 9px 14px;
	}

	.add-section {
		margin-top: 45px;
		text-align: center;
	}

	.add-button {
		display: inline-block;
		padding: 12px 20px;
		border: 1px solid #ea580c;
		border-radius: 6px;
		text-decoration: none;
		color: white;
		background: #ea580c;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.add-button:hover {
		background: #c2410c;
	}

	@media (max-width: 850px) {
		.search-box {
			flex-direction: column;
		}

		input {
			width: auto;
		}

		.recipe-list {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 550px) {
		.page {
			padding: 30px 15px;
		}

		.hero h1 {
			font-size: 30px;
		}

		.recipe-list {
			grid-template-columns: 1fr;
		}
	}
</style>