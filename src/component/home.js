import React from "react";
import "../styles/home.css";
import Wallpaper from "./wallpaper";
import QuickSearch from "./quicksearch";
import axios from "axios";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      mealtype:[]
    };
  }

  componentDidMount() {
    sessionStorage.clear();
    axios({
      url: "http://localhost:3003/locationid",
      method: "GET",
      headers: { "content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ locations: response.data.locations });
      })
      .catch((err) => console.log(err));

    axios({
      url: "http://localhost:3003/mealtypedata",
      method: "GET",
      headers: { "content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ mealtype: response.data.mealtype });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { locations, mealtype } = this.state;
    return (
      <div className="myDiv">
        <Wallpaper locationData={locations} />
        <QuickSearch quicksearchData = {mealtype}/>
      </div>
    );
  }
}

export default Home;
