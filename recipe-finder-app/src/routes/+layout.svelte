<script lang="ts">
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		try {
			const { defineCustomElements } = await import(
				'@aishwarya-vn/recipe-components/loader'
			);

			defineCustomElements(window);
		} catch (error) {
			console.error('Stencil component could not load:', error);
		}
	});
</script>

<nav>
	<a href="/">🍴 Recipe Finder</a>

	<div class="links">
		<a href="/">Home</a>
		<a href="/favorites">❤️ Favorites</a>
		<a href="/meal-plan">📅 Meal Planner</a>
	</div>
</nav>

{@render children()}

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 40px;
		border-bottom: 1px solid #ddd;
		font-family: Arial, sans-serif;
	}

	nav a {
		text-decoration: none;
		color: black;
		font-weight: bold;
	}

	.links {
		display: flex;
		gap: 25px;
	}
</style>