// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.

// In this code snippet, you imported React, the render method from ReactDOM, Bootstrap, jQuery, Popper.js, and your App component.
// Using ReactDOM’s render method, you rendered your App component in a div element, which was appended to the body of the page.
// Whenever the application is loaded, React will render the content of the App component inside the div element on the page.

import React from "react";
import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from "../components/App";

document.addEventListener("DOMContentLoaded", () => {
  render(
      <App />,
      document.body.appendChild(document.createElement("div"))
  );
});
