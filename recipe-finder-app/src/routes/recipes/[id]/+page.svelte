<script lang="ts">
	import { page } from '$app/state';

	let recipe = $state<any>(null);
	let loading = $state(true);

	$effect(() => {
	const id = page.params.id;

if (id) {
	loadRecipe(id);
}
	});

	async function loadRecipe(id: string) {
		loading = true;

		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
		);

		const data = await response.json();

		recipe = data.meals?.[0] || null;
		loading = false;
	}

	function getIngredients() {
		if (!recipe) return [];

		const ingredients = [];

		for (let i = 1; i <= 20; i++) {
			const ingredient = recipe[`strIngredient${i}`];
			const measure = recipe[`strMeasure${i}`];

			if (ingredient && ingredient.trim()) {
				ingredients.push(`${measure || ''} ${ingredient}`.trim());
			}
		}

		return ingredients;
	}

	function addToFavorites() {
		if (!recipe) return;

		const savedFavorites = localStorage.getItem('favorites');

		let favorites = savedFavorites
			? JSON.parse(savedFavorites)
			: [];

		const alreadyExists = favorites.some(
			(item: any) => item.idMeal === recipe.idMeal
		);

		if (!alreadyExists) {
			favorites.push(recipe);

			localStorage.setItem(
				'favorites',
				JSON.stringify(favorites)
			);

			alert('Added to favorites');
		} else {
			alert('Already in favorites');
		}
	}

	function removeFromFavorites() {
		if (!recipe) return;

		const savedFavorites = localStorage.getItem('favorites');

		let favorites = savedFavorites
			? JSON.parse(savedFavorites)
			: [];

		favorites = favorites.filter(
			(item: any) => item.idMeal !== recipe.idMeal
		);

		localStorage.setItem(
			'favorites',
			JSON.stringify(favorites)
		);

		alert('Removed from favorites');
	}
</script>

<svelte:head>
	<title>Recipe Details</title>
</svelte:head>

<div class="page">
	<a href="/">← Back to Recipes</a>

	{#if loading}
		<p>Loading recipe...</p>

	{:else if recipe}
		<h1>{recipe.strMeal}</h1>

		<img
			class="recipe-image"
			src={recipe.strMealThumb}
			alt={recipe.strMeal}
		/>

		<p>
			<strong>Category:</strong> {recipe.strCategory}
		</p>

		<p>
			<strong>Cuisine:</strong> {recipe.strArea}
		</p>

		<div class="buttons">
			<button onclick={addToFavorites}>
				❤️ Add to Favorites
			</button>

			<button onclick={removeFromFavorites}>
				Remove from Favorites
			</button>
		</div>

		<h2>Ingredients</h2>

		<ul>
			{#each getIngredients() as ingredient}
				<li>{ingredient}</li>
			{/each}
		</ul>

		<h2>Instructions</h2>

		<p class="instructions">
			{recipe.strInstructions}
		</p>

	{:else}
		<p>Recipe not found.</p>
	{/if}
</div>

<style>
	.page {
		max-width: 800px;
		margin: auto;
		padding: 40px 20px;
		font-family: Arial, sans-serif;
	}

	a {
		text-decoration: none;
		color: #333;
	}

	h1 {
		margin-top: 30px;
	}

	.recipe-image {
		width: 100%;
		max-width: 500px;
		border-radius: 10px;
		margin: 20px 0;
	}

	.buttons {
		display: flex;
		gap: 10px;
		margin: 20px 0;
	}

	button {
		padding: 10px 16px;
		cursor: pointer;
	}

	li {
		margin-bottom: 8px;
	}

	.instructions {
		line-height: 1.7;
	}
</style>