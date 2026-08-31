import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'recipe-card',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class RecipeCard {
  @Prop() name: string = '';
  @Prop() image: string = '';
  @Prop() category: string = '';

  @Event() recipeSelected!: EventEmitter<string>;

  selectRecipe() {
    this.recipeSelected.emit(this.name);
  }

  render() {
    return (
      <div class="card">
        <img src={this.image} alt={this.name} />

        <h2>{this.name}</h2>

        <p>{this.category}</p>

        <slot></slot>

        <button onClick={() => this.selectRecipe()}>
          View Recipe
        </button>
      </div>
    );
  }
}