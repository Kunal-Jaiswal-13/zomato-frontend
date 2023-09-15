import React from "react";
import QuickSearchItem from "./quicksearchitem";

class QuickSearch extends React.Component {
  
  render() {
    const {quicksearchData} = this.props

    return (
      <>
        <div className="bottomSection container">
          <h1 className="qs-heading">Quick searches</h1>
          <h3 className="qs-subheading">Discover restaurents by type of meal</h3>
          {
            quicksearchData.map((item,index)=>{
              return <QuickSearchItem key={index} quicksearchitemData= {item}/>
            })
          }
        </div>
      </>
    );
  }
}

export default QuickSearch;
