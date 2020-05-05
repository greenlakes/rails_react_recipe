import React from "react";
import { Link } from "react-router-dom";


// Like with your Recipes component, in the constructor, we initialized a state object that holds the state of a recipe.
// We also bound an addHtmlEntities method to this so it can be accessible within the component.
// The addHtmlEntities method will be used to replace character entities with HTML entities in the component.
//
// In order to find a particular recipe, our application needs the id of the recipe. This means our Recipe component expects an id param.
// We can access this via the props passed into the component.

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { recipe: { ingredients: "" } };

    this.addHtmlEntities = this.addHtmlEntities.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

// Next, we add a componentDidMount method where you will access the id param from the match key of the props object.
// Once we get the id, you will then make an HTTP request to fetch the recipe.
// Here using object destructuring, we get the id param from the props object, then using the Fetch API,
// we make a HTTP request to fetch the recipe that owns the id and save it to the component state using the setState method.
// If the recipe does not exist, the app redirects the user to the recipes page.

  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    const url = `/api/v1/show/${id}`;

    fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(response => this.setState({ recipe: response }))
        .catch(() => this.props.history.push("/recipes"));
  }

  // add the addHtmlEntities method, which takes a string and replaces all escaped opening and closing brackets with their HTML entities.
  // This will help us convert whatever escaped character was saved in your recipe instruction

  addHtmlEntities(str) {
    return String(str)
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
  }

  // In the deleteRecipe method, we get the id of the recipe to be deleted, then build our url and grab the CSRF token.
  // Next, we make a DELETE request to the Recipes controller to delete the recipe. If the recipe is successfully deleted,
  // the application redirects the user to the recipes page.

  deleteRecipe() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const url = `/api/v1/destroy/${id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(() => this.props.history.push("/recipes"))
        .catch(error => console.log(error.message));
  }


  // add a render method that gets the recipe from the state and renders it on the page.
  // In this render method, we split your comma separated ingredients into an array and mapped over it, creating a list of ingredients.
  // If there are no ingredients, the app displays a message that says No ingredients available.
  // It also displays the recipe image as a hero image, adds a delete recipe button next to the recipe instruction, and adds a button that links back to the recipes page.

  render() {
    const { recipe } = this.state;
    let ingredientList = "No ingredients available";

    if (recipe.ingredients.length > 0) {
      ingredientList = recipe.ingredients
          .split(",")
          .map((ingredient, index) => (
              <li key={index} className="list-group-item">
                {ingredient}
              </li>
          ));
    }
    const recipeInstruction = this.addHtmlEntities(recipe.instruction);

    return (
        <div className="">
          <div className="hero position-relative d-flex align-items-center justify-content-center">
            <img
                src={recipe.image}
                alt={`${recipe.name} image`}
                className="img-fluid position-absolute"
            />
            <div className="overlay bg-dark position-absolute" />
            <h1 className="display-4 position-relative text-white">
              {recipe.name}
            </h1>
          </div>
          <div className="container py-5">
            <div className="row">
              <div className="col-sm-12 col-lg-3">
                <ul className="list-group">
                  <h5 className="mb-2">Ingredients</h5>
                  {ingredientList}
                </ul>
              </div>
              <div className="col-sm-12 col-lg-7">
                <h5 className="mb-2">Preparation Instructions</h5>
                <div
                    dangerouslySetInnerHTML={{
                      __html: `${recipeInstruction}`
                    }}
                />
              </div>
              <div className="col-sm-12 col-lg-2">
                <button type="button" className="btn btn-danger" onClick={this.deleteRecipe}>
                  Delete Recipe
                </button>
              </div>
            </div>
            <Link to="/recipes" className="btn btn-link">
              Back to recipes
            </Link>
          </div>
        </div>
    );
  }
}

// To run the code in the deleteRecipe method whenever the delete button is clicked, pass it as the click event handler to the button.
// Add an onClick event to the delete button in the render method:

export default Recipe;