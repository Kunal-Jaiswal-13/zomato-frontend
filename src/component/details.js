import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/details.css";
// import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
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

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "black",
  },
};
class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      content_value: 1,
      galleryModalIsOpen: false,
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
        this.setState({ menuItems: updatedMenuItems });
      })
      .catch((err) => console.log(err));
  }

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

  openOverview = () => {
    this.setState({ content_value: 1 });
  };

  openContact = () => {
    this.setState({ content_value: 2 });
  };

  handleGalleryModal = () => {
    this.setState({ galleryModalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ galleryModalIsOpen: false });
  };
  render() {
    const {
      restaurantData,
      galleryModalIsOpen,
      menuModelIsOpen,
      menuItems,
      subTotal,
    } = this.state;
    return (
      <div>
        <Header />
        <div className="container" style={{}}>
          <img
            src={restaurantData.image}
            className="detail-img"
            alt="restaurant-imag"
            width="100%"
            height="352px"
            style={{ marginTop: "65px" }}
          />
          <button className="gallery-button" onClick={this.handleGalleryModal}>
            Click to see Image Gallery
          </button>
          <div className="restaurant-name">{restaurantData.name}</div>
          <button
            className="order-button"
            onClick={() => this.handleOrder(true)}
          >
            Place Online Order
          </button>
          <div className="btn-box">
            <button
              className="btn-1"
              style={
                this.state.content_value === 1
                  ? { color: "#ce0505" }
                  : { color: "black" }
              }
              onClick={this.openOverview}
            >
              Overview
            </button>
            <button
              className="btn-2"
              style={
                this.state.content_value === 2
                  ? { color: "#ce0505" }
                  : { color: "black" }
              }
              onClick={this.openContact}
            >
              Contact
            </button>
          </div>
          <div className="path"></div>
          <div
            id="content1"
            className="content"
            style={
              this.state.content_value === 1
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <div
              className="restaurant-name2"
              style={{ marginTop: "20px", marginBottom: "30px" }}
            >
              About this place
            </div>
            <div className="cuisine-detail">Cuisine</div>
            <div className="address" style={{ marginBottom: "30px" }}>
              {restaurantData.cuisine_id
                ? restaurantData.cuisine_id.map((item) => `${item.name} `)
                : null}
            </div>
            <div className="cuisine-detail">Average Cost</div>
            <div className="address" style={{ marginBottom: "0px" }}>
              ₹{restaurantData.min_price} for two people (approx)
            </div>
          </div>
          <div
            id="content2"
            className="content"
            style={
              this.state.content_value === 2
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <div className="phone-number" style={{ marginTop: "30px" }}>
              Phone Number
            </div>
            <div className="number" style={{ marginBottom: "30px" }}>
              {restaurantData.contact_number}
            </div>
            <div className="restaurant-name2">{restaurantData.name}</div>
            <div className="address" style={{ marginBottom: "50px" }}>
              {restaurantData.address}
            </div>
          </div>
          <Modal isOpen={galleryModalIsOpen} style={customStyles}>
            <button
              className="carousel-closebutton"
              style={{ float: "right", borderRadius: "50%" }}
              onClick={this.closeModal}
            >
              <span
                style={{ padding: "7px" }}
                className="glyphicon glyphicon-remove"
              ></span>
            </button>
            <div>
              <Carousel showThumbs={false}>
                <div>
                  <img alt="" src="assests/breakfast.jpg" className="carousel-image" />
                </div>
                <div>
                  <img alt=""  src="assests/lunch.jpg" className="carousel-image" />
                </div>
                <div>
                  <img alt=""  src="assests/dinner.jpg" className="carousel-image" />
                </div>
                <div>
                  <img alt="" src="assests/snacks.jpg" className="carousel-image" />
                </div>
                <div>
                  <img alt="" src="assests/drink.jpg" className="carousel-image" />
                </div>
                <div>
                  <img alt="" src="assests/nightlife.jpg" className="carousel-image" />
                </div>
              </Carousel>
            </div>
          </Modal>

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
                <h3>{restaurantData.name}</h3>
                <h3>Subtotal: {subTotal}</h3>
                <button className="btn btn-danger">Pay Now</button>
                {menuItems &&
                  menuItems.map((item, index) => {
                    return (
                      <div key={index}>
                        <div
                          className="row"
                          style={{ borderBottom: "1px solid black" }}
                        >
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
      </div>
    );
  }
}
export default Details;
