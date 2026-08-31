<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let id = '';
	let name = $state('');
	let category = $state('');
	let ingredients = $state('');
	let instructions = $state('');

	$effect(() => {
		id = page.url.searchParams.get('id') || '';

		let recipes = JSON.parse(
			localStorage.getItem('customRecipes') || '[]'
		);

		let recipe = recipes.find(
			(item: any) => item.idMeal === id
		);

		if (recipe) {
			name = recipe.strMeal;
			category = recipe.strCategory;
			ingredients = recipe.ingredients;
			instructions = recipe.strInstructions;
		}
	});

	function updateRecipe() {
		if (!name || !category || !ingredients || !instructions) {
			alert('Please fill all fields');
			return;
		}

		let recipes = JSON.parse(
			localStorage.getItem('customRecipes') || '[]'
		);

		let recipe = recipes.find(
			(item: any) => item.idMeal === id
		);

		if (recipe) {
			recipe.strMeal = name;
			recipe.strCategory = category;
			recipe.ingredients = ingredients;
			recipe.strInstructions = instructions;
		}

		localStorage.setItem(
			'customRecipes',
			JSON.stringify(recipes)
		);

		alert('Recipe updated');

		goto('/');
	}
</script>

<div class="page">
	<h1>Edit Recipe</h1>

	<label>Recipe Name</label>
	<input bind:value={name} />

	<label>Category</label>
	<input bind:value={category} />

	<label>Ingredients</label>
	<textarea bind:value={ingredients}></textarea>

	<label>Instructions</label>
	<textarea bind:value={instructions}></textarea>

	<button onclick={updateRecipe}>
		Update Recipe
	</button>
</div>

<style>
	.page {
		width: 500px;
		margin: 40px auto;
		font-family: Arial;
	}

	label {
		display: block;
		margin-top: 15px;
	}

	input,
	textarea {
		width: 100%;
		padding: 10px;
		margin-top: 5px;
	}

	textarea {
		height: 80px;
	}

	button {
		margin-top: 20px;
		padding: 10px 20px;
	}
</style>