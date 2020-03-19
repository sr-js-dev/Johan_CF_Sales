import React, {Component} from 'react'
import { Col, Row, Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Addcustomerform from './addcustomerform';
import Customerdocument from './customerdocument';
import Updatecustomerform from './updatecustomerform';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
import history from '../../history';
import Createtask from '../Tasks/taskform'
import FileUploadForm from '../../components/drag_drop_fileupload';
import Pagination from '../../components/pagination';
import * as Common from '../../components/common';
import Filtercomponent from '../../components/filtercomponent';
import $ from 'jquery';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Userregister extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            customerData:[],
            flag:'',
            userUpdateData:[],
            loading:false,
            arrayFilename: [],
            originFilterData: [],
            filterFlag: false,
            filterData: [],
            filterDataFlag: false
        };
      }
    componentDidMount() {
        this._isMounted=true
        this.getRecordNum();
        this.getCustomerData(10, 1);
        this.getAllCustomerData();
        this.setFilterData();
    }
    componentWillUnmount() {
        this._isMounted = false
    }

    getRecordNum () {
        this._isMounted = true;
        this.setState({loading:true});
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetCustomerRecords, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({recordNum: result.data.Items[0].numCustomers});
                
            }
        });
    }

    getCustomerData (pageSize, page, data, search) {
        this._isMounted = true;
        let params = {
            "page" :page,
            "pagesize": pageSize,
            "search": search ? search : ''
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerData, params, headers)
        .then(result => {
            if(this._isMounted){
                if(!data){
                    this.setState({customerData: result.data.Items.length>0 ? result.data.Items : []});
                }else{
                    this.setState({customerData: data});
                }
                this.setState({loading:false})
                $('#example-task').dataTable().fnDestroy();
                if(this.state.filterDataFlag){
                    $('#example').dataTable().fnDestroy();
                    var table = $('#example').DataTable(
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
                        "searching": false,
                        "dom": 't<"bottom-datatable" lip>',
                        "ordering": false
                    }
                    );
                }
            }
        });
    }

    getAllCustomerData (data) {
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetAllCustomers, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({originFilterData: result.data.Items});
                // $('.fitler').on( 'keyup', function () {
                //     table.search( this.value ).draw();
                // } );
                // $('#example').dataTable().fnDestroy();
                // var table = $('#example').DataTable(
                //     {
                //     "language": {
                //         "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
                //         "zeroRecords": "Nothing found - sorry",
                //         "info": trls("Show_page")+" _PAGE_ of _PAGES_",
                //         "infoEmpty": "No records available",
                //         "infoFiltered": "(filtered from _MAX_ total records)",
                //         "search": trls('Search'),
                //         "paginate": {
                //             "previous": trls('Previous'),
                //             "next": trls('Next')
                //         }
                //     },
                //     "dom": 't<"bottom-datatable" lip>',
                //     "ordering": false
                // }
                // );
            }
        });
    }
    // filter module
    setFilterData = () => {
        let filterData = [
            {"label": trls('CustomerName'), "value": "CustomerName", "type": 'text'},
            {"label": trls('Address'), "value": "Address", "type": 'text'},
            {"label": trls('Postcode'), "value": "Zipcode", "type": 'text'},
            {"label": trls('City'), "value": "City", "type": 'text'},
            {"label": trls('Country'), "value": "Country", "type": 'text'}
        ]
        this.setState({filterData: filterData});
    }

    filterOptionData = (filterOption) =>{
        let dataA = []
        dataA = Common.filterData(filterOption, this.state.originFilterData);
        if(!filterOption.length){
            this.setState({filterDataFlag: false});
            dataA=null;
        }else{
            this.setState({filterDataFlag: true});
        }
       
        $('#example').dataTable().fnDestroy();
        this.getCustomerData(10,1,dataA);
        // this.getAllCustomerData(1dataA);
    }

    quickSeach = (evt) => {
        this.getCustomerData(10, 1, null, evt.target.value)
    }

    changeFilter = () => {
        if(this.state.filterFlag){
            this.setState({filterFlag: false})
        }else{
            this.setState({filterFlag: true})
        }
    }
    // filter module
    viewCustomerDetail = (data) => {
        var string = data.id+","+data.fullrights;
        var b64 = btoa(unescape(encodeURIComponent(string)));
        history.push({
            pathname: '/customer/detail/'+b64,
        })
    }

    customerUpdate = (id) => {
        this._isMounted = true;
        let customerId = id;
        let params = {
            customerid:customerId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerById, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.setState({customerUpdateData: result.data.Items})
                this.setState({modalupdateShow:true, customerId: customerId})
            }
        });
    }
    createTask = (newId) => {
        this.setState({modalcreateTaskShow: true, taskflag: true, customerId: newId})

    }

    onHide = () => {
        this.setState({modalcreateTaskShow: false});
        this.getCustomerData();
    }

    detailmode = () =>{
        this.setState({taskflag: false})
    }
    
    postDocuments = (docuId) => {
        this._isMounted = true;
        let params = {
            customerid: this.state.attachtaskId,
            documentid: docuId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostCustomerDocuments, params, headers)
        .then(result => {
            if(this._isMounted){    
                // SweetAlert({
                //     title: trls('Success'),
                //     icon: "success",
                //     button: "OK",
                //   });
            }
        })
        .catch(err => {
            // SweetAlert({
            //     title: trls('Fail'),
            //     icon: "warning",
            //     button: "OK",
            //   });
        });
    }

    getTaskDocuments = (data) =>{
        this._isMounted = true;
        let taskData = data;
        let arrayData = [];
        arrayData = taskData.split(',');
        let params = {
            customerid:parseInt(arrayData[0])
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerDocuments, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.setState({modaldocumentShow: true})
                this.setState({documentData: result.data.Items})
                this.setState({documentHeader: arrayData})
            }
        });
    }
    // viewUserData = (event) => {
    //     this._isMounted = true;
    //     var headers = SessionManager.shared().getAuthorizationHeader();
    //     Axios.get(API.GetUserDataById+event.currentTarget.id, headers)
    //     .then(result => {
    //         if(this._isMounted){
    //             this.setState({userUpdateData: result.data})
    //             this.setState({modalShow:true, mode:"view", flag:true})
    //         }
    //     });
    // }
    // userDelete = () => {
    //     var headers = SessionManager.shared().getAuthorizationHeader();
    //     Axios.delete("https://cors-anywhere.herokuapp.com/"+API.DeleteUserData+this.state.userId, headers)
    //     .then(result => {
    //         this.setState({loading:true})
    //         this.getUserData();               
    //     });
    // }
    // userDeleteConfirm = (event) => {
    //     this.setState({userId:event.currentTarget.id})
    //     confirmAlert({
    //         title: 'Confirm',
    //         message: 'Are you sure to do this.',
    //         buttons: [
    //           {
    //             label: 'Delete',
    //             onClick: () => {
    //                this.userDelete()
    //             }
    //           },
    //           {
    //             label: 'Cancel',
    //             onClick: () => {}
    //           }
    //         ]
    //       });
    // }
    render () {
        let customerData=this.state.customerData;
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <h2 className="title">{trls('Customer')}</h2>
                </div>
                <div className="orders">
                    <Row>
                        <Col sm={6}>
                            {!this.state.loading?(
                                <Button variant="primary" onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}><i className="fas fa-plus add-icon"></i>{trls('Add_Customer')}</Button>
                            ):
                                <Button variant="primary" disabled onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}><i className="fas fa-plus add-icon"></i>{trls('Add_Customer')}</Button>
                            }
                        </Col>
                        <Col sm={6} className="has-search">
                            <div style={{display: 'flex', float: 'right'}}>
                                <Button variant="light" onClick={()=>this.changeFilter()}><i className="fas fa-filter add-icon"></i>{trls('Filter')}</Button>   
                                <div style={{marginLeft: 20}}>
                                    <span className="fa fa-search form-control-feedback"></span>
                                    <Form.Control className="form-control fitler" type="text" name="number"placeholder={trls("Quick_search")} onChange={(evt)=>this.quickSeach(evt)}/>
                                </div>
                            </div>
                        </Col>
                        {this.state.filterData.length>0&&(
                            <Filtercomponent
                                onHide={()=>this.setState({filterFlag: false})}
                                filterData={this.state.filterData}
                                onFilterData={(filterOption)=>this.filterOptionData(filterOption)}
                                showFlag={this.state.filterFlag}
                            />
                        )}
                    </Row>
                    <div className="table-responsive">
                        <table id="example" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('CustomerName')}</th>
                                <th>{trls('Address')}</th>
                                <th>{trls('Postcode')}</th>
                                <th>{trls('City')}</th>
                                <th>{trls('Country')}</th>
                                {/* <th>{trls('Attachment')}</th> */}
                                <th>{trls('Action')}</th>
                            </tr>
                        </thead>
                        {!this.state.loading &&(<tbody >
                            {
                                customerData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>
                                            <div id={data.id} style={{cursor: "pointer", color:'#004388', fontSize:"15px", fontWeight:'bold'}} onClick={()=>this.viewCustomerDetail(data)}>{data.CustomerName}</div>
                                        </td>
                                        <td>{data.Address}</td>
                                        <td>{data.Zipcode}</td>
                                        <td>{data.City}</td>
                                        <td>{data.Country}</td>
                                        {/* <td width={200}>
                                            <Row style={{justifyContent:"space-around"}}>
                                                <i className="fas fa-file-upload add-icon" onClick={()=>this.setState({fileUploadModalShow: true, attachtaskId: data.id})}><span className="action-title">{trls('Attach')}</span></i>
                                                <i className="fas fa-eye add-icon" onClick={()=>this.getTaskDocuments(data.id+','+data.CustomerName+','+data.Address+','+data.City+','+data.Country)}><span className="action-title">{trls('View')}</span></i>
                                            </Row>
                                        </td> */}
                                        <td>    
                                            <Row style={{justifyContent:"space-around"}}>
                                                <i className="fas fa-pen add-icon" onClick={()=>this.customerUpdate(data.id)}><span className="action-title">{trls('Edit')}</span></i>
                                            </Row>
                                        </td>
                                    </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
                    {!this.state.filterDataFlag&&(
                        <Pagination
                            recordNum={this.state.recordNum}
                            getData={(pageSize, page)=>this.getCustomerData(pageSize, page)}
                        />
                    )}
                    { this.state.loading&& (
                        <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                            <BallBeat
                                color={'#222A42'}
                                loading={this.state.loading}
                            />
                        </div>
                    )}
                    </div>
                </div>
                <Addcustomerform
                    show={this.state.modalShow}
                    onHide={() => this.setState({modalShow: false})}
                    onGetCustomer={()=> this.getCustomerData()}
                    createTask={(newId)=> this.createTask(newId)}
                />
                <Updatecustomerform
                    show={this.state.modalupdateShow}
                    onHide={() => this.setState({modalupdateShow: false})}
                    customerData={this.state.customerUpdateData}
                    customerId={this.state.customerId}
                    onGetCustomer={()=> this.getCustomerData()}
                /> 
                <Createtask
                    show={this.state.modalcreateTaskShow}
                    detailmode={this.detailmode}
                    taskflag={this.state.taskflag}
                    customerId={this.state.customerId}
                    onHide={() => this.onHide()}
                    customerNewCreate={true}
                />  
                <Customerdocument
                    show={this.state.modaldocumentShow}
                    onHide={() => this.setState({modaldocumentShow: false})}
                    documentData = {this.state.documentData}
                    documentHeader = {this.state.documentHeader}
                />
                <FileUploadForm
                    show={this.state.fileUploadModalShow}
                    onHide={() => this.setState({fileUploadModalShow: false})}
                    onPostFileDataById={(fileid)=>this.postDocuments(fileid)}
                />
            </div>
        )
        };
  }
    
  export default connect(mapStateToProps, mapDispatchToProps)(Userregister);
