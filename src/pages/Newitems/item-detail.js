import React, {Component} from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import { trls } from '../../components/translate';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
// import Contactpanel from './contactpanel';
// import Modalpanel from './modalpanel';
// import Products from './products';
// import Orders from './orders';
// import Competitor from './competitor';
// import Priceagree from './price-agree';
// import Quotation from './quotation';
// import Mold from './mold.js'
// import Document from './document.js'
import {ArcGauge} from '@progress/kendo-react-gauges';
import '@progress/kendo-theme-default/dist/all.css';
import * as Common from '../../components/common';
// import { BallBeat } from 'react-pure-loaders';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
const arcCenterRenderer = (currentValue, color) => {
    return (<h3 style={{ color: color }}>{Common.formatPercent(currentValue*2)}</h3>);
};

class ItemDetail extends Component {

    _isMounted = false
    constructor(props) {
        var date = new Date();
        var curyear = date.getFullYear(); 
        // console.log("$$$$$$",params.id)
        // let pathArray = pathname.split('/')
        // var str = decodeURIComponent(escape(window.atob(pathArray.pop())));
        // let styArray = str.split(',');
        // let customerId = styArray[0];
        // let fullRight = styArray[1];
        super(props);
        this.state = {  
            itemDetail: [],
            flag:'',
            customerFinancialData: [],
            loading:true,
            gaugepercent: 0,
            percent: 0,
            currentYear: curyear,
            detailIdData: {contact: false, product: false, modal: false, orders: false, competitor: false, price: false, quotations: false, mold: false, document: false},
            detailShowFlag: false,
            customerId: 0,
            fullRight: "true"
        };
    }

    componentDidMount() {
        this._isMounted=true;
        const { match: { params } } = this.props;
        this.getItemDetail(params.id)
        this.getCustomerFinancialDetails(this.state.customerId);
    }

    componentWillUnmount() {
        this._isMounted = false
    }
    
    getItemDetail = (id) => {
        this._isMounted = true;
        let params = {
            id : id
        }
        // this.setState({customerId: value})
        this.setState({loadingvalue:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetItemDetail, params,  headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.Success) {
                    console.log("^^^^^^^^^^^^^", result.data.Items)
                    this.setState({itemDetail: result.data.Items})
                }
            }
        });
    }

    getCustomerFinancialDetails (value) {
        this._isMounted = true;
        let params = {
            customerid : value
        }
        let currentRevenue=0;
        let lastRevenue=0;
        this.setState({customerId: value})
        this.setState({loadingvalue:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerFinancialDetailData, params,  headers)
        .then(result => {
            var date = new Date();
            var curyear = date.getFullYear();    
            if(this._isMounted){
                let detailData=result.data.Items
                if(detailData){
                    detailData.map((data, index) => {
                        if(data.Year===curyear){
                            this.setState({customerFinancialData4: data})
                            currentRevenue=data.Revenue
                        }else if(data.Year===curyear-1){
                            this.setState({customerFinancialData3: data})
                            lastRevenue=data.Revenue
                        }else if(data.Year===curyear-2){
                            this.setState({customerFinancialData2: data})
                        }else if(data.Year===curyear-3){
                            this.setState({customerFinancialData1: data})
                        }
                        return detailData;
                    })
                }
                if(currentRevenue&&lastRevenue){
                    this.setState({gaugepercent:(lastRevenue/currentRevenue)/2});
                    this.setState({percent:(currentRevenue/lastRevenue)*100})
                }
            }
        });
    }

    userDeleteConfirm = (event) => {
        this.setState({userId:event.currentTarget.id})
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Delete',
                onClick: () => {
                   this.userDelete()
                }
              },
              {
                label: 'Cancel',
                onClick: () => {}
              }
            ]
          });
    }

    formatNumber = (num) => {
        var value = num.toFixed(2);
        return  "€" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    formatNumberPercent = (num) => {
        var value = num.toFixed(2);
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    detailmode = (detailId) =>{
        let detailIdData = this.state.detailIdData;
        detailIdData[detailId] = true;
        this.setState({detailIdData: detailIdData});
        if(detailIdData.contact===true){
            this.setState({detailShowFlag: true})
        }
        this.setState({customerId: ""})
    }
    dateTimeFormat = (year, month, date, hour , minute) => {
        var month_format = 0;
        var date_format = 0;
        var hour_format = 0;
        var minute_format = 0;
        if(month + 1 < 10){
            month_format = '0' + ( month + 1);
        } else {
            month_format = month + 1;
        }
        if(date < 10) {
            date_format = '0'+date;
        } else {
            date_format = date;
        }
        if(hour < 10) {
            hour_format = '0'+hour;
        } else {
            hour_format = hour;
        }
        if(minute < 10) {
            minute_format = '0'+minute;
        } else {
            minute_format = minute;
        }
        return date_format + '-' + month_format + '-' + year  + ' ' + hour_format + ':' + minute_format;
    }
    render () {
        let itemDetail=this.state.itemDetail[0];
        let lastChange = itemDetail&&itemDetail.last_change;
        let year = new Date(lastChange).getFullYear();
        let month = new Date(lastChange).getMonth();
        let date = new Date(lastChange).getDate();
        let hour = new Date(lastChange).getHours();
        let minute = new Date(lastChange).getMinutes();
        lastChange = this.dateTimeFormat(year, month, date, hour, minute);
        // let customerFinancialData4=this.state.customerFinancialData4;
        // let customerFinancialData3=this.state.customerFinancialData3;
        // let customerFinancialData2=this.state.customerFinancialData2;
        // let customerFinancialData1=this.state.customerFinancialData1;
        const {fullRight} = this.state;
        return (
            <Container className="card-container">
                <Row className="customer-detail">
                    <Col sm={3}className="card-container-col">
                        <Card>
                            <Card.Header><i className="fa fa-user" style={{paddingRight:"5px", fontSize:"18px"}}></i>{itemDetail ? itemDetail.customer : ''}</Card.Header>
                                <Card.Body>
                                        <div className="codex-content">
                                            <i className="fas fa-address-card" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                            <div className="codex-address">
                                                <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Address")}:</div>
                                                {itemDetail&&(
                                                    <div>{itemDetail.adress}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="codex-content">
                                            <i className="fas fa-barcode" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                            <div className="codex-address">
                                                <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Zip_code")}:</div>
                                                {itemDetail&&(
                                                    <div>{itemDetail.zipcode}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="codex-content">
                                            <i className="fas fa-location-arrow" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                            <div className="codex-address">
                                                <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Location")}:</div>
                                                {itemDetail&&(
                                                    <div>{itemDetail.city}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="codex-content">
                                            <i className="fas fa-map-marker-alt" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                            <div className="codex-address">
                                                <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Country")}:</div>
                                                {itemDetail&&(
                                                    <div>{itemDetail.country}</div>
                                                )}
                                            </div>
                                        </div>
                                </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={3}className="card-container-col">
                        <Card>
                            <Card.Header><i className="fa fa-info-circle" style={{paddingRight:"5px", fontSize:"18px"}}></i>{trls("Extra_information")}</Card.Header>
                                <Card.Body>
                                    <div className="codex-content">
                                        <i className="fas fa-qrcode" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                        <div className="codex-address">
                                            <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Code")}:</div>
                                            {itemDetail&&(
                                                <div>{itemDetail.code}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="codex-content">
                                        <i className="fas fa-phone" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                        <div className="codex-address">
                                            <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Telephone")}:</div>
                                            {itemDetail&&(
                                                <div>{itemDetail.phone}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="codex-content">
                                        <i className="fas fa-envelope" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                        <div className="codex-address">
                                            <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("E_mail")}:</div>
                                            {itemDetail&&(
                                                <div>{itemDetail.email}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="codex-content">
                                        <i className="fas fa-globe" style={{paddingRight:"5px", fontSize:"18px"}}></i>
                                        <div className="codex-address">
                                            <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Website")}:</div>
                                            {itemDetail&&(
                                                <div>{itemDetail.website}</div>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                        </Card>
                    </Col>
                    {fullRight==="true"&&(
                        <Col sm={6} className="card-container-col-finance">
                        <Card>
                            <Card.Header><i className="fas fa-money-check-alt" style={{paddingRight:"5px", fontSize:"18px"}}></i>{trls("New_product")}</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col sm={6} >
                                            <div className="codex-content">
                                                <div className="codex-address">
                                                    <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Contact")}:</div>
                                                    {itemDetail&&(
                                                        <div>{itemDetail.contact }</div>
                                                    )}  
                                                </div>
                                            </div>
                                            <div className="codex-content">
                                                <div className="codex-address">
                                                    <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Description")}:</div>
                                                    {itemDetail&&(
                                                        <div>{itemDetail.description }</div>
                                                    )} 
                                                </div>
                                            </div>
                                            <div className="codex-content">
                                                <div className="codex-address">
                                                    <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Assigned_to")}:</div>
                                                    {itemDetail&&(
                                                        <div>{itemDetail.assigned_to }</div>
                                                    )} 
                                                </div>
                                            </div>
                                            <div className="codex-content">
                                                <div className="codex-address">
                                                    <div style={{color:"rgba(21, 132, 247, 1)"}}>{trls("Last_change")}:</div>
                                                    {itemDetail&&(
                                                        <div>{lastChange}</div>
                                                    )} 
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={4} style={{textAlign:"center", fontSize:"13px"}}>
                                            <div style={{color:"rgba(21, 132, 247, 1)", paddingBottom:"10px"}}>{trls("Progress")}</div>
                                                <div>
                                                    <ArcGauge
                                                        value={itemDetail&&itemDetail.percentage_finished/2}
                                                        transitions={false}
                                                        scale={{
                                                            rangeSize:25,
                                                        }}
                                                        arcCenterRender={arcCenterRenderer}
                                                    />
                                                </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                        </Card>
                    </Col>
                    )}
                </Row>
                {/* {!this.state.detailShowFlag && (
                    <div className="page-loading-spinner loading" style={{textAlign:"center"}}>
                        <BallBeat
                            color={'#000'}
                            loading={this.state.loading}
                        />
                    </div>
                )}
                <div className="panel-collapse">
                    <Contactpanel
                        title={trls("Contacts")}
                        customerId={this.state.customerId}
                        detailmode={(detail_Id)=>this.detailmode(detail_Id)}
                        contactFlag={this.state.detailIdData.contact}
                    />
                </div>
                {fullRight==="true"&&(
                    <div>
                        <div className="panel-collapse">
                            <Priceagree
                                title={trls("Price_agreements")}
                                customerId={this.state.customerId}
                                detailmode={this.detailmode}
                            />
                        </div>
                        <div className="panel-collapse">
                            <Quotation
                                title={trls("Quotations")}
                                customerId={this.state.customerId}
                                detailmode={this.detailmode}
                            />
                        </div>
                        <div className="panel-collapse">
                            <Modalpanel
                                title={trls("Models")}
                                customerId={this.state.customerId}
                                detailmode={this.detailmode}
                            />
                        </div>
                        <div className="panel-collapse">
                            <Products
                                title={trls("Articles")}
                                customerId={this.state.customerId}
                                detailmode={this.detailmode}
                            />
                        </div>
                        <div className="panel-collapse">
                            <Competitor
                                title={trls("Competitor_models")}
                                customerId={this.state.customerId}
                                detailmode={this.detailmode}
                            />
                        </div>
                        <div className="panel-collapse">
                            <Orders
                                title={trls("Orders")}
                                customerId={this.state.customerId}
                                detailmode={this.detailmode}
                            />
                        </div>
                        <div className="panel-collapse">
                            <Mold
                                title={trls("Mold")}
                                customerId={this.state.customerId}
                                detailmode={this.detailmode}
                            />
                        </div>
                        <div className="panel-collapse">
                            <Document
                                title={trls("Documents")}
                                customerId={this.state.customerId}
                                detailmode={this.detailmode}
                            />
                        </div>
                    </div>
                )} */}
            </Container>
        )
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);
