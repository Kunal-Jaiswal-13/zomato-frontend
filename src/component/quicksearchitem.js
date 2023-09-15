import React from "react";
import { withRouter } from "react-router-dom";

class QuickSearchItem extends React.Component {

  constructor(){
    super();
    this.state= {
      image: ""
    }
  }

  handleClick = (mealtypeid) => {
    const locationId = sessionStorage.getItem('locationId');
    if(locationId){
      this.props.history.push(`/filter?mealtypes=${mealtypeid}&location=${locationId}`);
    }else{
    this.props.history.push(`/filter?mealtypes=${mealtypeid}`);}
    
  };

  

  render() {
    const { name, content, image, meal_type } = this.props.quicksearchitemData;

    return (
      <div className="qs-box col-sm-12 col-md-6 col-lg-4" >
        <div className="qs-boxes-container" onClick={()=>{this.handleClick(meal_type)}}>
          <div className="qs-box-contents" >
            <img src={`./${image}`} className="qs-image" alt="" />
            <h4 className="qs-item-heading">{name}</h4>
            <p className="qs-item-description">{content}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(QuickSearchItem);
