import React from "react";
import Routes from "../routes/Index";

export default props => <>{Routes}</>;

// In the App.jsx file, you imported React and the route files you just created. You then exported a component that renders the routes within fragments.
// This component will be rendered at the entry point of the aplication, thereby making the routes available whenever the application is loaded.