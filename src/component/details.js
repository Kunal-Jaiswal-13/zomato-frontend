import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/details.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Header from "./header";
import queryString from "query-string";
import axios from "axios";
import Modal from "react-modal";

const menuStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(231, 196, 153)",
    border: "1px solid rgb(239, 136, 136)",
    width: "30vw",
    height: "25vw",
    padding: "0.2em",
  },
};

class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurantData: {},
      menuModelIsOpen: false,
      menuItems: [],
      subTotal: 0,
    };
  }

  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    const { restaurant } = qs;

    axios({
      method: "GET",
      url: `http://localhost:3003/restaurantById/${restaurant}`,
      headers: { "content-Type": "application/json" },
    })
      .then((response) => {
        this.setState({ restaurantData: response.data.restaurant[0] });
      })
      .catch((err) => console.log(err));

    axios({
      method: "GET",
      url: `http://localhost:3003/menuitem/${restaurant}`,
      headers: { "content-Type": "application/json" },
    })
      .then((res) => {
        const menuData = res.data;
        const updatedMenuItems = [];

        menuData.forEach((item) => {
          item.menu_items.forEach((menuItem) => {
            menuItem.qty = 0;
            updatedMenuItems.push(menuItem);
          });
        });
        this.setState({ menuItems: updatedMenuItems })
      })
      .catch((err) => console.log(err));
    };

  handleOrder = (value) => {
    this.setState({
      menuModelIsOpen: value,
    });
  };

  addItems = (index, operationType) => {
    let total = 0;
    const items = [...this.state.menuItems];
    const item = items[index];

    if (operationType === "add") {
      item.qty += 1;
    } else {
      item.qty -= 1;
    }
    items[index] = item;
    items.map((item) => {
      return (total += item.qty * item.price);
    });
    this.setState({ menuItems: items, subTotal: total });
  };

  render() {
    const { restaurantData, menuModelIsOpen, menuItems, subTotal } = this.state;
    return (
      <>
        <Header />
        <div className="details">
          <h1>details page</h1>
          <Carousel className="carousel" autoPlay showThumbs={false}>
            <div>
              <img className="image" alt="" src={`./${restaurantData.image}`} />
            </div>
          </Carousel>
          <h1>{restaurantData.name}</h1>
          <button
            className="buttonForOrder "
            onClick={() => this.handleOrder(true)}
          >
            Place Online Order
          </button>
          <Tabs>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Contact</Tab>
            </TabList>
            <TabPanel>
              <h2>About this place</h2>
              <br />
              <h3>cuisine</h3>
              <p>Bakery Fast Food</p>
              <h3>Average Cost</h3>
              <p>Rs. {restaurantData.min_price} for two people(approx.)</p>
            </TabPanel>
            <TabPanel>
              <h2>contact Number</h2>
              <p>{restaurantData.contact_number}</p>
              <h3>{restaurantData.name}</h3>
              <h3>
                {restaurantData.address
                  ? restaurantData?.address
                  : "shop 1,plot 13,samruddhi complex,Chincholi"}
              </h3>
            </TabPanel>
          </Tabs>
          <Modal isOpen={menuModelIsOpen} style={menuStyles}>
            <div>
              <div
                style={{ float: "right", marginBottom: "10px" }}
                onClick={() => this.handleOrder(false)}
              >
                <i className="bi bi-x"></i>
              </div>
              <br />

              <div>
                <h3 className="restaurant-name">{restaurantData.name}</h3>
                <h3 className="item-total">Subtotal: {subTotal}</h3>
                <button className="btn btn-danger order-button">Pay Now</button>
                {menuItems &&
                  menuItems.map((item, index) => {
                    return (
                      <div key={index}>
                        <div className="row" style={{borderBottom:"1px solid black" }}>
                          <div className="col-8">
                            <h5>{item.name}</h5>
                            <h5>&#8377;{item.price}</h5>
                            <p style={{ fontSize: "10px" }}>
                              {item.description}
                            </p>
                          </div>
                          <div className="col-4" style={{ marginTop: "5px" }}>
                            <img
                              src={item.image_url}
                              alt=""
                              style={{
                                height: "50px",
                                width: "50px",
                                borderRadius: "10px",
                              }}
                            />
                            <br />
                            {item.qty === 0 ? (
                              <div
                                className="add-button"
                                onClick={() => this.addItems(index, "add")}
                                style={{
                                  height: "20px",
                                  width: "50px",
                                  fontSize: "15px",
                                  backgroundColor: "white",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  color: "black",
                                  marginTop: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                Add
                              </div>
                            ) : (
                              <div>
                                <span
                                  style={{
                                    fontSize: "15px",
                                    color: "grey",
                                    fontWeight: "600",
                                    marginRight: "15px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    this.addItems(index, "subtract")
                                  }
                                >
                                  -
                                </span>
                                <span
                                  style={{
                                    fontSize: "15px",
                                    color: "#61b246",
                                    fontWeight: "600",
                                    marginRight: "15px",
                                  }}
                                >
                                  {item.qty}
                                </span>
                                <span
                                  style={{
                                    fontSize: "15px",
                                    color: "#61b246",
                                    fontWeight: "600",
                                    marginRight: "15px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => this.addItems(index, "add")}
                                >
                                  +
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}
export default Details;
