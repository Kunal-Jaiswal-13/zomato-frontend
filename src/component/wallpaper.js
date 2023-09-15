import axios from "axios";
import React from "react";
import { withRouter } from 'react-router-dom';
class Wallpaper extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      inputText: "",
      suggestions:[]
    };
  }

  handleLocation = (event) => {
    const locationId = event.target.value;
    axios({
      url: `http://localhost:3003/restaurantdata/${locationId}`,
      method: "GET",
      headers: { "content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ restaurants: response.data.restaurant });
      })
      .catch((err) => console.log(err));
      sessionStorage.setItem('locationId', locationId);
  };

  handleSearch = (event) => {
    let inputText = event.target.value;
    const { restaurants } = this.state;
    const suggestions = restaurants.filter((item) =>
      item.name.toLowerCase().includes(inputText.toLowerCase())
    );
    this.setState({ suggestions, inputText });
  };

  showSuggestion=()=>{
    const { suggestions, inputText} = this.state;

    if(suggestions.length == 0 && inputText == undefined){
      return null;
    }
    if(suggestions.length > 0 && inputText == ''){
      return null;
    }
    if(suggestions.length == 0 && inputText){
      return <ul>
        <li>No Search Results Found</li>
      </ul>
    }
    return(
      <ul>
        {
          suggestions.map((item, index)=>(<li key={index} onClick={()=> this.selectingRestaurant(item)}>{`${item.name} - ${item.locality},${item.city}`}</li>))
        }
      </ul>
    )
  }

  selectingRestaurant=(item)=>{
    this.props.history.push(`/details?restaurant=${item._id}`);
  }

  render(){
    const { locationData } = this.props;
    return (
      <>
        <img
          src="./assests/IMG_20230412_161956.jpg"
          alt=""
          className="homeImage"
        />
        <div className="topSection container">
          <div className="logo">e!</div>
          <div className="headerText">
            Find the best restaurents,cafes ,and bars
          </div>
          <div className="searchOptions">
            <span>
              <select className="locationBox" onChange={this.handleLocation}>
                <option value="0">--select city--</option>
                {locationData.map((item,index) => {
                  return (
                    <option
                      value={item.location_id} key={index}
                    >{`${item.name}, ${item.city}`}</option>
                  );
                })}
              </select>
            </span>
            <span className="searchBox">
              <i className="bi bi-search searchIcon"></i>
              <input 
                type="text"
                className="searchInput"
                placeholder="Search for restaurents"
                onChange={this.handleSearch}
              />
              {this.showSuggestion()}
            </span>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Wallpaper);
