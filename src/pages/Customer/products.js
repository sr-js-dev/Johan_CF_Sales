
import React from 'react';
import '../../assets/css/collapsepanel.scss';
import { trls } from '../../components/translate';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import 'datatables.net';
import {ArcGauge} from '@progress/kendo-react-gauges';
import Productimageform from './productimage_form';
import * as Common from '../../components/common';

const arcCenterRenderer = (currentValue, color) => {
    return;
};

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Productpanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
    };
  }
  render () {
    return (
      <div {...{ className: 'wrapper' }}>
        <ul {...{ className: 'accordion-list' }}>
                <AccordionItem {...this.props} />
        </ul>
      </div>
    )
  }
}

class AccordionItem extends React.Component {

    state = {
        opened: false,
    }

    constructor(props) {
        var date = new Date();
        var curyear = date.getFullYear(); 
        super(props);
        this.state = {  
            lastYear2 : curyear-2,
            lastYear3 : curyear-3,
            imagePath: '',
            productNumber: ''
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.setState({loading:true});
    }

    getCustomerData (value) {
        this._isMounted = true;
        let params = {
            customerid : value
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerProducts, params, headers)
        .then(result => {
            if(this._isMounted){
                var date = new Date();
                var curyear = date.getFullYear(); 
                let modelData=result.data.Items
                let ItemNumber='';
                let itemArray=[];
                let tempArray=[];
                let currentYear=0;
                let lastYear=0;
                let lastYear2=0;
                let lastYear3=0;
                let progress=0;
                modelData.map((data, index) => {
                    if(ItemNumber!==data.ItemNumber){
                        ItemNumber=data.ItemNumber;
                        if(!tempArray.currentYear){
                            tempArray.currentYear=0
                        }
                        if(!tempArray.lastYear){
                            tempArray.lastYear=0
                        }
                        if(!tempArray.lastYear2){
                            tempArray.lastYear2=0
                        }
                        if(!tempArray.lastYear3){
                            tempArray.lastYear3=0
                        }
                        if(!tempArray.progress){
                            tempArray.progress=0
                        }
                        if(!tempArray.gaugepercent){
                            tempArray.gaugepercent=0
                        }
                        tempArray = JSON.parse(JSON.stringify(tempArray))
                        itemArray.push(tempArray);
                    }
                    tempArray.ItemNumber=data.ItemNumber;
                    tempArray.Itemtype=data.Itemtype;
                    tempArray.Color=data.Color;
                    tempArray.Length=data.Length;
                    tempArray.PathDrawing=data.PathDrawing;
                    if(ItemNumber===data.ItemNumber&&curyear===data.Year){
                        currentYear=data.Revenue;
                        tempArray.currentYear=currentYear;
                    }else if(ItemNumber===data.ItemNumber&&curyear-1===data.Year){
                        lastYear=data.Revenue;
                        tempArray.lastYear=lastYear;
                    }else if(ItemNumber===data.ItemNumber&&curyear-2===data.Year){
                        lastYear2=data.Revenue;
                        tempArray.lastYear2=lastYear2;
                    }else if(ItemNumber===data.ItemNumber&&curyear-3===data.Year){
                        lastYear2=data.Revenue;
                        tempArray.lastYear3=lastYear3;
                    }
                    if(currentYear&&lastYear){
                        progress=(currentYear/lastYear)*100;
                        tempArray.gaugepercent=(currentYear/lastYear)/2;
                        tempArray.progress=progress;
                    }
                    return modelData;
                })
                this.setState({customerItems:itemArray})
                this.props.detailmode('product');
                this.setState({loading:false})
                $('#example-product').dataTable().fnDestroy();
                $('#example-product').DataTable(
                    {
                      "language": {
                          "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
                          "zeroRecords": "Nothing found - sorry",
                          "info": trls("Show_page")+" _PAGE_ of _PAGES_",
                          "infoEmpty": "No records available",
                          "infoFiltered": "(filtered from _MAX_ total records)",
                          "search": trls('Search'),
                          "paginate": {
                            "previous": trls('Previous'),
                            "next": trls('Next')
                          }
                      },
                      columnDefs: [
                        { "width": "70px", "targets": [0,1,2,3]},
                        { "width": "200px", "targets": [8] }
                      ]
                    }
                  );
                  $("#example-product_paginate").click(function(){window.dispatchEvent(new Event("resize"))});
            }
        });
    }

    componentDidUpdate(){
        if(this.props.customerId){
            this.getCustomerData(this.props.customerId)
        }
    }
    formatNumber = (num) => {
        if(num){
            var value = num.toFixed(2);
            return  "€" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }else{
            return "€ 0.00" 
        }
       
    }

    formatNumberPercent = (num) => {
        if(num){
            var value = num.toFixed(2);
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }else{
            return "0.00" 
        }
        
    }

    drawingImage = (path, productNumber) =>{
        this.setState({imagePath: API.GetImage+path, productNumber: productNumber, modalShow: true})
        // window.open( 
        //     API.GetImage+path, "_blank"); 
    }

    render () {
        let customerItems=this.state.customerItems;
        const {
        props: {
            title
        },
        state: {
            opened
        }
        } = this
        return (
        <div
            {...{
            className: `accordion-item, ${opened && 'accordion-item--opened'}`,
            }}
        >
            <div {...{ className: 'accordion-item__line', onClick: () => { this.setState({ opened: !opened }) } }}>
            <h3 {...{ className: 'accordion-item__title' }}>
                {title}
            </h3>
            <span {...{ className: 'accordion-item__icon' }}/>
            </div>
            <div {...{ className: 'accordion-item__inner' }} style={{borderTop: "1px solid rgba(0,0,0,.125)"}}>
                <div {...{ className: 'accordion-item__content' }}>
                    <div className="table-responsive credit-history">
                        <table id="example-product" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Articles')}</th>
                                <th>{trls('Item_Type')}</th>
                                <th>{trls('Color')}</th>
                                <th>{trls('Length')}</th>
                                <th>{trls('Turnover_current_year')}</th>
                                <th>{trls('Turnover_last_year')}</th>
                                <th>{trls('Revenue_for_the_year')+" "+this.state.lastYear2}</th>
                                <th>{trls('Revenue_for_the_year')+" "+this.state.lastYear3}</th>
                                <th>{trls('Progress')}</th>
                            </tr>
                        </thead>
                        {customerItems && !this.state.loading &&(<tbody >
                            {
                                customerItems.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>
                                            <div style={{cursor: "pointer", color:'#004388', fontSize:"16px", fontWeight:'bold'}} onClick={()=>this.drawingImage(data.PathDrawing, data.ItemNumber)}>{data.ItemNumber}</div>
                                        </td>
                                        <td>{data.Itemtype}</td>
                                        <td>{data.Color}</td>
                                        <td>{data.Length}</td>
                                        <td>{Common.formatMoney(data.currentYear)}</td>
                                        <td>{Common.formatMoney(data.lastYear)}</td>
                                        <td>{Common.formatMoney(data.lastYear2)}</td>
                                        <td>{Common.formatMoney(data.lastYear3)}</td>
                                        <td>
                                            <Row >
                                                <Col sm={6} style={{textAlign:"center", fontSize:"13px"}}>
                                                    <ArcGauge style={{width:70, height:50}} scale={{rangeSize:10}} value={data.currentYear/data.lastYear/2 ? data.currentYear/data.lastYear/2 : 0} arcCenterRender={arcCenterRenderer}/>
                                                </Col>
                                                <Col sm={3} style={{paddingLeft:"0px"}}>
                                                    <div style={{paddingTop: 10}}>{this.formatNumberPercent((data.currentYear/data.lastYear)*100)+"%"}</div>
                                                </Col>
                                            </Row>
                                        </td>
                                    </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
                    { this.state.loading&& (
                        <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                            <BallBeat
                                color={'#222A42'}
                                loading={this.state.loading}
                            />
                        </div>
                    )}
                    <Productimageform   
                        show={this.state.modalShow}
                        imagePath={this.state.imagePath}
                        onHide={() => this.setState({modalShow: false})}
                        productNumber={this.state.productNumber}
                    />
                    </div>
                </div>
            </div>
        </div>
        )
    }
    }
    export default connect(mapStateToProps, mapDispatchToProps)(Productpanel);
