<script lang="ts">
	import { goto } from '$app/navigation';

	let name = $state('');
	let category = $state('');
	let ingredients = $state('');
	let instructions = $state('');

	function saveRecipe() {
		if (!name || !category || !ingredients || !instructions) {
			alert('Please fill all fields');
			return;
		}

		let recipes = JSON.parse(
			localStorage.getItem('customRecipes') || '[]'
		);

		let newRecipe = {
			idMeal: 'custom-' + Date.now(),
			strMeal: name,
			strCategory: category,
			ingredients: ingredients,
			strInstructions: instructions,
			isCustom: true
		};

		recipes.push(newRecipe);

		localStorage.setItem(
			'customRecipes',
			JSON.stringify(recipes)
		);

		alert('Recipe added');

		goto('/');
	}
</script>

<div class="page">
	<h1>Add Recipe</h1>

	<label>Recipe Name</label>
	<input bind:value={name} />

	<label>Category</label>
	<input bind:value={category} />

	<label>Ingredients</label>
	<textarea bind:value={ingredients}></textarea>

	<label>Instructions</label>
	<textarea bind:value={instructions}></textarea>

	<button onclick={saveRecipe}>
		Save Recipe
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