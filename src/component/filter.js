import React from "react";
import "../styles/filter.css";
import Header from "./header";
import axios from "axios";
import queryString from "query-string";

class Filter extends React.Component {
  constructor() {
    super();
    this.state = {
      FilterItem: [],
      mealtypes: undefined,
      locations: [],
      location: undefined,
      cuisine: [],
      hCost: undefined,
      lCost: undefined,
      sort: undefined,
    };
  }

  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    const { mealtypes, location } = qs;
    const mealtype_id = Number(mealtypes);

    const filterObj = {
      mealtypes: mealtype_id,
      location,
    };

    axios({
      method: "GET",
      url: `http://localhost:3003/restaurantdatabymeal/${mealtype_id}`,
      headers: { "Content-Type": "application/json" },
      data: filterObj,
    })
      .then((response) => {
        this.setState({
          FilterItem: response.data.restaurant,
          mealtypes: mealtype_id,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axios({
      url: "http://localhost:3003/locationid",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ locations: response.data.locations });
      })
      .catch((err) => console.log(err));
  }

  handleLocationChange = (event) => {
    const location = event.target.value;
    
    axios({
      method: "GET",
      url: `http://localhost:3003/restaurantdata/${location}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({
          FilterItem: response.data.restaurant,
          location,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleCuisineChange = (cuisineId) => {
    const { cuisine } = this.state;
    const updatedCuisine = [...cuisine];
    const index = cuisine.indexOf(cuisineId);

    if (index === -1) {
      updatedCuisine.push(cuisineId);
    } else {
      updatedCuisine.splice(index, 1);
    }
   
    axios({
      method: "GET",
      url: `http://localhost:3003/restaurantcuisine/${updatedCuisine}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({
          FilterItem: response.data.restaurant,
          cuisine: updatedCuisine,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleCostChange = (lCost, hCost) => {
    const filterObj = {
      lCost,
      hCost,
    };

    axios({
      method: "GET",
      url: `http://localhost:3003/restaurantcost/${lCost}/${hCost}`,
      headers: { "Content-Type": "application/json" },
      params: filterObj,
    })
      .then((response) => {
        this.setState({
          FilterItem: response.data.restaurant,
          lCost,
          hCost,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };


  handleSortChange = (event) => {
    const sortType = event.target.value;
    const sortedRestaurants = [...this.state.FilterItem]; 
  
    if (sortType === "lowToHigh") {
      sortedRestaurants.sort((a, b) => a.min_price - b.min_price);
    } else if (sortType === "highToLow") {
      sortedRestaurants.sort((a, b) => b.min_price - a.min_price);
    }
  
    this.setState({
      FilterItem: sortedRestaurants,
      sort: sortType, 
    });
  };

  handleNavigate=(resId)=>{
    this.props.history.push(`/details?restaurant=${resId}`);
  }
  

  render() {
    const { FilterItem, locations } = this.state;
    return (
      <React.Fragment>
        <Header />
        <div className="container">
          <div className="row heading">Breakfast places in Mumbai</div>
          <div className="row">
            <div className="col-3 col-sm-12 col-md-4 col-lg-3">
              <div className="filterPanel">
                <div className="filterPanelHeading">Filters</div>
                <div className="filterPanelSubHeading">Select Location</div>
                <select
                  className="locationSelection"
                  onChange={this.handleLocationChange}
                >
                  <option value="0">Select</option>
                  {locations.map((item, index) => {
                    return (
                      <option
                        value={item.location_id}
                        key={index}
                      >{`${item.name}, ${item.city}`}</option>
                    );
                  })}
                </select>
                <div className="filterPanelSubHeading">Cuisine</div>
                <input
                  type="checkbox"
                  onChange={() => {
                    this.handleCuisineChange(1);
                  }}
                  className="cuisineOption"
                />
                <label>North Indian</label>
                <br />
                <input
                  type="checkbox"
                  onChange={() => {
                    this.handleCuisineChange(2);
                  }}
                  className="cuisineOption"
                />
                <label>South Indian</label>
                <br />
                <input
                  type="checkbox"
                  onChange={() => {
                    this.handleCuisineChange(3);
                  }}
                  className="cuisineOption"
                />
                <label>Chinese</label>
                <br />
                <input
                  type="checkbox"
                  onChange={() => {
                    this.handleCuisineChange(4);
                  }}
                  className="cuisineOption"
                />
                <label>Fast Food</label>
                <br />
                <input
                  type="checkbox"
                  onChange={() => {
                    this.handleCuisineChange(5);
                  }}
                  className="cuisineOption"
                />
                <label>Street Food</label>
                <br />
                <div className="filterPanelSubHeading">Cost for two</div>
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => this.handleCostChange(1, 500)}
                />
                <label>Less than &#8377;500</label>
                <br />
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => this.handleCostChange(500, 1000)}
                />
                <label>&#8377;500 to &#8377;1000</label>
                <br />
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => this.handleCostChange(1000, 1500)}
                />
                <label>&#8377;1000 to &#8377;1500</label>
                <br />
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => this.handleCostChange(1500, 2000)}
                />
                <label>&#8377;1500 to &#8377;2000</label>
                <br />
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => this.handleCostChange(2000, 50000)}
                />
                <label>&#8377;2000+</label>
                <br />
                <div className="filterPanelSubHeading">Sort</div>
                <input
                  type="radio"
                  className="cuisineOption"
                  name="price"
                  value="lowToHigh"
                  onChange={this.handleSortChange}
                />
                <label>Price low to high</label>
                <br />
                <input
                  type="radio"
                  className="cuisineOption"
                  name="price"
                  value="highToLow"
                  onChange={this.handleSortChange}
                />
                <label>Price high to low</label>
              </div>
            </div>
            <div className="col-9 col-sm-12 col-md-8 col-lg-9">
              {FilterItem.length > 0 ? (
                FilterItem.map((data, index) => {
                  return (
                    <div key={index} className="resultsPanel" onClick={()=>this.handleNavigate(data._id)}>
                      <div className="row upperSection">
                        <div className="col-2">
                          <img
                            src={`./${data.image}`}
                            className="resultsImage"
                            alt=""
                          />
                        </div>
                        <div className="col-10">
                          <div className="resultsHeading">{data.name}</div>
                          <div className="resultsSubHeading">
                            {data.locality}
                          </div>
                          <div className="resultsAddress">{data.city}</div>
                        </div>
                      </div>
                      <br />
                      <div className="row lowerSection">
                        <div className="col-2">
                          <div className="resultsAddress">CUISINES:</div>
                          <div className="resultsAddress">COST FOR TWO:</div>
                        </div>
                        <div className="col-10">
                          <div className="resultsSubHeading">
                            {data.cuisine.map((cuisineData) => {
                              return `${cuisineData.name}`;
                            })}
                          </div>
                          <div className="resultsSubHeading">
                            &#8377;{data.min_price}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-records">No Records Found...</div>
              )}
            </div>
            {FilterItem.length > 0 ? (
              <div className="pagination">
                <a href="#" className="paginationButton">
                  1
                </a>
                <a href="#" className="paginationButton">
                  2
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Filter;
