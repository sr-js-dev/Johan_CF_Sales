import React, { Component } from "react";
import { connect } from 'react-redux';
import $ from 'jquery';
import { createUltimatePagination } from "react-ultimate-pagination";
import { trls } from './translate';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});

function PAGE(props) {
  return (
    <div
      className={!props.isActive ? "pagination-botton " : "pagination-botton active "}
      onClick={props.onClick}
      disabled={props.isActive}
    >
      {props.value}
    </div>
  );
}
 
function Ellipsis(props) {
  return (
    <div
      className={!props.isActive ? "pagination-botton " : "pagination-botton active "}
      onClick={props.onClick}
      disabled={props.isActive}
    >
      ...
    </div>
  )
}
 
function FirstPageLink(props) {
  return null;
}
 
function PreviousPageLink(props) {
  return (
    <div
      className="pagination-botton previous"
      onClick={props.onClick}
      disabled={props.isActive}
    >
      {trls('Previous')}
    </div>
  )
}
 
function NextPageLink(props) {
  return (
    <div
      className="pagination-botton next"
      onClick={props.onClick}
      disabled={props.isActive}
    >
      {trls('Next')}
    </div>
  )
}
 
function LastPageLink(props) {
  return null;
}
 
const PaginatedPage = createUltimatePagination({
  itemTypeToComponent: {
    PAGE: PAGE,
    ELLIPSIS: Ellipsis,
    FIRST_PAGE_LINK: FirstPageLink,
    PREVIOUS_PAGE_LINK: PreviousPageLink,
    NEXT_PAGE_LINK: NextPageLink,
    LAST_PAGE_LINK: LastPageLink
  }
});

class Pagination extends Component {
  _isMounted = false
	constructor(props) {
		super(props);
		this.state = {  
      page: 1,
      pageSize: 10
    };
    this.onPageChange = this.onPageChange.bind(this);
  }
  
  componentDidMount () {
    $(".pagination-botton.previous").addClass("hiden");
  }

  onPageChange = (page) => {
    const { recordNum } = this.props;
    const { pageSize } = this.state;
    if(page===1){
      $(".pagination-botton.previous").addClass("hiden");
    }else{
      $(".pagination-botton.previous").removeClass("hiden");
    }
    if(page===parseInt(recordNum/pageSize)){
      $(".pagination-botton.next").addClass("hiden");
    }else{
      $(".pagination-botton.next").removeClass("hiden");
    }
    this.setState({page: page},()=>{
      this.getData();
    })
  }

  changePageLength = (evt) => {
    this.setState({pageSize: evt.target.value}, ()=>{
      this.getData();
    })
  }

  getData = () => {
    const { pageSize, page } = this.state;
    this.props.getData(Number(pageSize), page)
  }

  render() {
    const { recordNum } = this.props;
    const { pageSize } = this.state;
    return (
      <div>
        <div className="pagination">
            <select name="project_table_length" aria-controls="project_table" className="" onChange={(evt)=>this.changePageLength(evt)}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <div style={{marginLeft: 'auto'}}>
              <PaginatedPage
                totalPages={parseInt(recordNum/pageSize) ? parseInt(recordNum/pageSize) : 1}
                currentPage={this.state.page}
                onChange={page => this.onPageChange(page)}
              />
            </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Pagination);