// This component will contain a form for collecting the required recipe details from the user and
// will make a request to the create action in the Recipe controller to save the recipe data.

import React from "react";
import { Link } from "react-router-dom";

// In the NewRecipe component’s constructor, we initialized your state object with empty name, ingredients, and instruction fields.
// These are the fields you need to create a valid recipe. We also have three methods; onChange, onSubmit, and stripHtmlEntities,
// which we bound to this. These methods will handle updating the state, form submissions, and converting special characters
// (like <) into their escaped/encoded values (like &lt;), respectively.

class NewRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      ingredients: "",
      instruction: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
  }

  // Next, we create the stripHtmlEntities method itself by adding the highlighted lines to the NewRecipe component:
  // In the stripHtmlEntities method, we’re replacing the < and > characters with their escaped value. This way we’re not storing raw HTML in our database.

  stripHtmlEntities(str) {
    return String(str)
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
  }

  // Next add the onChange and onSubmit methods to the NewRecipe component to handle editing and submission of the form:
  // In the onChange method, we used the ES6 computed property names to set the value of every user input to its corresponding key in our state.
  // In the onSubmit method, we checked that none of the required inputs are empty.
  // You then build an object that contains the parameters required by the recipe controller to create a new recipe.
  // Using regular expression, we replace every new line character in the instruction with a break tag, so we can retain the text format entered by the user.

  // To protect against Cross-Site Request Forgery (CSRF) attacks, Rails attaches a CSRF security token to the HTML document.
  // This token is required whenever a non-GET request is made. With the token constant in the preceding code,
  // our application verifies the token on the server and throws an exception if the security token doesn’t match what is expected.
  // In the onSubmit method, the application retrieves the CSRF token embedded in our HTML document by Rails and makes a HTTP request with a JSON string.
  // If the recipe is successfully created, the application redirects the user to the recipe page where they can view their newly created recipe.

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    const url = "/api/v1/recipes/create";
    const { name, ingredients, instruction } = this.state;

    if (name.length == 0 || ingredients.length == 0 || instruction.length == 0)
      return;

    const body = {
      name,
      ingredients,
      instruction: instruction.replace(/\n/g, "<br> <br>")
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(response => this.props.history.push(`/recipe/${response.id}`))
        .catch(error => console.log(error.message));
  }

  // add a render method that renders a form for the user to enter the details for the recipe the user wishes to create:
  render() {
    return (
        <div className="container mt-5">
          <div className="row">
            <div className="col-sm-12 col-lg-6 offset-lg-3">
              <h1 className="font-weight-normal mb-5">
                Add a new recipe to our awesome recipe collection.
              </h1>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="recipeName">Recipe name</label>
                  <input
                      type="text"
                      name="name"
                      id="recipeName"
                      className="form-control"
                      required
                      onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipeIngredients">Ingredients</label>
                  <input
                      type="text"
                      name="ingredients"
                      id="recipeIngredients"
                      className="form-control"
                      required
                      onChange={this.onChange}
                  />
                  <small id="ingredientsHelp" className="form-text text-muted">
                    Separate each ingredient with a comma.
                  </small>
                </div>
                <label htmlFor="instruction">Preparation Instructions</label>
                <textarea
                    className="form-control"
                    id="instruction"
                    name="instruction"
                    rows="5"
                    required
                    onChange={this.onChange}
                />
                <button type="submit" className="btn custom-button mt-3">
                  Create Recipe
                </button>
                <Link to="/recipes" className="btn btn-link mt-3">
                  Back to recipes
                </Link>
              </form>
            </div>
          </div>
        </div>
    );
  }
  // In the render method, you have a form that contains three input fields; one for the recipeName, recipeIngredients,
  // and instruction. Each input field has an onChange event handler that calls the onChange method.
  // Also, there’s an onSubmit event handler on the submit button that calls the onSubmit method which then submits the form data.
}

export default NewRecipe;