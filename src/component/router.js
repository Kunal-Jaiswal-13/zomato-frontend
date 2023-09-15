import React from "react";
import {
  Route,
  BrowserRouter
} from "react-router-dom";

import Home from "./home";
import Filter from "./filter";
import Details from "./details";
import Header from "./header";


function Router(){
  return(
    <BrowserRouter>
        <Route path="*" component={Header}></Route>
        <Route exact path='/' component={Home}></Route>
        <Route path='/filter' component={Filter}></Route>
        <Route path='/details' component={Details}></Route>
    </BrowserRouter>
  )
}

export default Router;
