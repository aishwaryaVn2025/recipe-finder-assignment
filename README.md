\# Recipe Finder and Meal Planner



This is a Recipe Finder and Meal Planner application created using SvelteKit, TypeScript and StencilJS.



The application allows users to search for recipes, view recipe details, save favourite recipes and plan meals for the week. Users can also add and manage their own recipes.



\## Features



\- Search recipes by name- Filter recipes by cuisine and category

\- View recipe details

\- Add and remove favourites

\- Add recipes to a weekly meal plan

\- Change or remove recipes from the meal plan

\- Add custom recipes

\- Edit custom recipes

\- Delete custom recipes

\- Store favourites, meal plans and custom recipes using Local Storage



\## Technologies Used



\- SvelteKit

\- Svelte 5

\- TypeScript

\- StencilJS

\- HTML and CSS

\- TheMealDB API

\- Local Storage



\## Project Folders



The project has two main folders.



\### recipe-finder-app



This contains the main SvelteKit application.



\### recipe-components



This contains the reusable recipe card component created using StencilJS.



The Stencil component uses Props, Events, Slots and Shadow DOM.



\## Stencil npm Package



The Stencil component is also published as an npm package.



Package name:



`@aishwarya-vn/recipe-components`



It can be installed using:



```bash

npm install @aishwarya-vn/recipe-components

```



\## How to Run the Project



Clone the repository:



```bash

git clone https://github.com/aishwaryaVn2025/recipe-finder-assignment.git

```



Go to the application folder:



```bash

cd recipe-finder-assignment/recipe-finder-app

```



Install the required packages:



```bash

npm install

```



Start the application:



```bash

npm run dev

```



Open the URL shown in the terminal in a browser.



\## Build



To check the application:



```bash

npm run check

```



To create the production build:



```bash

npm run build

```



\## Stencil Component



To run the Stencil component separately:



```bash

cd recipe-components

npm install

npm start

```



To build the component:



```bash

npm run build

```



\## Storage



Favorites, meal plans and custom recipes are saved in the browser using Local Storage.



Because of this, the saved data will be different for different browsers or devices.



\## API



Recipe data is taken from TheMealDB API.



\## Assumptions



\- Internet connection is required to search API recipes.

\- Local Storage is used instead of a database.

\- User login is not required.

\- Custom recipes are stored locally in the browser.



\## Live Application



https://recipe-finder-assignment-silk.vercel.app



\## GitHub Repository



https://github.com/aishwaryaVn2025/recipe-finder-assignment

