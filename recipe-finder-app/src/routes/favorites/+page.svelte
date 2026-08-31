<script lang="ts">
	let favorites = $state<any[]>([]);

	$effect(() => {
		const savedFavorites = localStorage.getItem('favorites');

		favorites = savedFavorites
			? JSON.parse(savedFavorites)
			: [];
	});

	function removeFavorite(id: string) {
		favorites = favorites.filter(
			(recipe) => recipe.idMeal !== id
		);

		localStorage.setItem(
			'favorites',
			JSON.stringify(favorites)
		);
	}
</script>

<svelte:head>
	<title>Favorites</title>
</svelte:head>

<div class="page">
	<a href="/">← Back to Recipes</a>

	<h1>❤️ My Favorites</h1>

	{#if favorites.length === 0}
		<p>No favorite recipes yet.</p>
	{:else}
		<div class="recipe-list">
			{#each favorites as recipe}
				<div class="recipe-card">
					<a href={`/recipes/${recipe.idMeal}`}>
						<img
							src={recipe.strMealThumb}
							alt={recipe.strMeal}
						/>

						<h2>{recipe.strMeal}</h2>
					</a>

					<p>
						{recipe.strArea} • {recipe.strCategory}
					</p>

					<button onclick={() => removeFavorite(recipe.idMeal)}>
						Remove
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 1000px;
		margin: auto;
		padding: 40px 20px;
		font-family: Arial, sans-serif;
	}

	h1 {
		text-align: center;
		margin-bottom: 30px;
	}

	a {
		text-decoration: none;
		color: black;
	}

	.recipe-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	.recipe-card {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 15px;
	}

	.recipe-card img {
		width: 100%;
		border-radius: 8px;
	}

	.recipe-card h2 {
		font-size: 18px;
	}

	button {
		padding: 8px 14px;
		cursor: pointer;
	}
</style>