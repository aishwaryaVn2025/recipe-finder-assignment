<script lang="ts">
	const days = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	];

	let favorites = $state<any[]>([]);
	let mealPlan = $state<Record<string, any>>({});

	$effect(() => {
		const savedFavorites = localStorage.getItem('favorites');
		const savedPlan = localStorage.getItem('mealPlan');

		favorites = savedFavorites
			? JSON.parse(savedFavorites)
			: [];

		mealPlan = savedPlan
			? JSON.parse(savedPlan)
			: {};
	});

	function assignRecipe(day: string, recipeId: string) {
		const selectedRecipe = favorites.find(
			(recipe) => recipe.idMeal === recipeId
		);

		if (!selectedRecipe) return;

		mealPlan[day] = selectedRecipe;

		localStorage.setItem(
			'mealPlan',
			JSON.stringify(mealPlan)
		);
	}

	function removeRecipe(day: string) {
		delete mealPlan[day];

		mealPlan = { ...mealPlan };

		localStorage.setItem(
			'mealPlan',
			JSON.stringify(mealPlan)
		);
	}
</script>

<svelte:head>
	<title>Meal Planner</title>
</svelte:head>

<div class="page">
	<h1>📅 Weekly Meal Planner</h1>

	<p>Choose a favorite recipe for each day.</p>

	{#if favorites.length === 0}
		<p>
			You don't have any favorite recipes yet.
		</p>

		<a href="/">Go back and add favorites</a>
	{:else}
		<div class="planner">
			{#each days as day}
				<div class="day-card">
					<h2>{day}</h2>

					<select
						onchange={(event) =>
							assignRecipe(
								day,
								event.currentTarget.value
							)}
					>
						<option value="">
							Choose recipe
						</option>

						{#each favorites as recipe}
							<option value={recipe.idMeal}>
								{recipe.strMeal}
							</option>
						{/each}
					</select>

					{#if mealPlan[day]}
						<div class="meal">
							<img
								src={mealPlan[day].strMealThumb}
								alt={mealPlan[day].strMeal}
							/>

							<h3>{mealPlan[day].strMeal}</h3>

							<button onclick={() => removeRecipe(day)}>
								Remove
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 1100px;
		margin: auto;
		padding: 40px 20px;
		font-family: Arial, sans-serif;
	}

	h1 {
		text-align: center;
	}

	.page > p {
		text-align: center;
	}

	.planner {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
		margin-top: 30px;
	}

	.day-card {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 20px;
	}

	select {
		width: 100%;
		padding: 10px;
		margin-bottom: 15px;
	}

	.meal img {
		width: 100%;
		max-width: 250px;
		border-radius: 8px;
		margin-top: 10px;
	}

	button {
		padding: 8px 14px;
		cursor: pointer;
	}
</style>