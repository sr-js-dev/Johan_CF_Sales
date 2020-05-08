import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as Auth from '../../components/auth'
import DatePicker from "react-datepicker";
// import DateTimePicker from "react-datetime-picker";
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import $ from 'jquery';
import SweetAlert from 'sweetalert';
import Pageloadspiiner from '../../components/page_load_spinner';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class Taskform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            orderdate: '', 
            val: '',
            val1: '',
            val2: '',
            val3: '',
            val5: '',
            selectCustomerValue: '',
            selectCustomerLabel: '',
            taskType: [],
            customer: [],
            employee: [],
            employeeSelectData: [{'value': 34, 'label': 'Esther Sauer'}],
            taskIds: [],
            remarkData: '',
            taskRemarkComments: [],
            pageLoding: false
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
    }

    componentDidUpdate(){
        if(this.props.taskflag){
            this.setState({updateTask: this.props.updateTask, taskId: this.props.taskId})
            this.getCustomer();
            this.getEmployee();
            this.getTaskType();
        }
    }

    getTaskType = () => {
        this.props.detailmode()
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetTaskType, headers)
        .then(result => {
            this.setState({taskType: result.data.Items});
        });
    }

    getCustomer = () => {
        this.props.detailmode()
        let customerId = this.props.customerId;
        let params = {
            customerId: Auth.getUserName()
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomer, params, headers)
        .then(result => {
            let tempArray = [];
            tempArray = result.data.Items;
            tempArray.map((data, index) => {
                if(data.key===parseInt(customerId)){
                    this.setState({selectCustomerLabel: data.value, selectCustomerValue: data.key})
                }
                return tempArray;
            })
            this.setState({customer: result.data.Items});
        });
    }

    getEmployee = () => {
        this.props.detailmode()
        if(this.props.customerNewCreate){
            
            this.setState({val2:1})
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetEmployee, headers)
        .then(result => {
            this.setState({employee: result.data.Items});
        });
    }

    changeCustomer = (val) => {
        this.setState({selectCustomerLabel: val.label})
        this.setState({selectCustomerValue: val.value})
        this.setState({val5:val.value});
    }

    changeEmployee = (val) =>{
        this.setState({employeeSelectData:val})
        this.setState({val3:1});
    }

    handleSubmit = (event) => {
        this.setState({pageLoding: true});
        this._isMounted = true;
        event.preventDefault();
        const taskIds = this.state.taskIds;
        const clientFormData = new FormData(event.target);
        const data = {};
        let employeeData=this.state.employeeSelectData;
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let tempArray = [];
        let params = [];
        let k=0;
        let employeelength = employeeData.length
        tempArray = employeeData;
        tempArray.map((employee, index) => {
            params = {
                customer: data.customer,
                employee: employee.value,
                deadline: data.deadline,
                subject: data.subject,
                tasktype: data.tasktype,
                username: Auth.getUserName()
            }
            var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.PostTask, params, headers)
            .then(result => {
                taskIds.push(result.data.NewId);
                k++
                if(k===employeelength){
                    if(this._isMounted){
                        if(result.data.Success){
                            this.setState({taskIds: taskIds, selectCustomerLabel:"", selectCustomerValue:"", orderdate: '', pageLoding: false})
                            SweetAlert({
                                title: trls('Success'),
                                icon: "success",
                                button: "OK",
                            });
                        }
                    }
                }
                // var item = this.state.employee.filter(item => item.key===employee.value)
                // if(item[0]){
                //     this.sendToEmployeeEmail(item[0].email);
                // }
            });
            return tempArray;
        })
    }

    onHide = () => {
        this.props.onHide();
        if(!this.props.customerNewCreate){
            this.props.onGetTask();
        }
        this.setState({
            orderdate: '', 
            val1: '',
            val2: '',
            val3: '',
            selectCustomerValue: '',
            selectCustomerLabel: '',
            taskType: [],
            customer: [],
            employee: [],
            employeeSelectData: [],
            taskIds: [],
            remarkData: '',
            taskRemarkComments: []
        })
    }

    // sendToEmployeeEmail = (email) => {
    //     let params = {
    //         To: [email],
    //         Subject: 'Er is een nieuwe taak toegewezen',
    //         Body: 'Er is een nieuwe taak toegewezen in de CF Sales Portal'
    //     }
    //     var headers = SessionManager.shared().getAuthorizationHeader();
    //     Axios.post(API.PostEmail, params, headers)
    //     .then(result => {
    //     });
    // }

    openUploadFile = () =>{
        $('#inputFile').show();
        $('#inputFile').focus();
        $('#inputFile').click();
        $('#inputFile').hide();
    }

    onChangeFileUpload = (e) => {
        this.setState({filename: e.target.files[0].name})
        this.setState({file:e.target.files[0]})
        this.fileUpload(e.target.files[0])
        this.setState({uploadflag:1})
    }

    fileUpload(file){
        var formData = new FormData();
        formData.append('file', file);// file from input
        var headers = {
            "headers": {
                "Authorization": "Bearer "+Auth.getUserToken(),
            }
        }
        Axios.post(API.PostFileUpload, formData, headers)
        .then(result => {
        })
        .catch(err => {
        });
    }

    createRemark = () =>{
        const {taskIds, remarkData} =this.state;
        let commentParams = [];
        let params = {
            taskid:taskIds[0]
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        taskIds.map((newId, key)=>{
            commentParams = {
                "taskid": newId,
                "username": Auth.getUserName(),
                "remark": remarkData
            }
            Axios.post(API.PostTaskComments, commentParams, headers)
            .then(result => {
                Axios.post(API.GetTaskComments, params, headers)
                .then(result => {
                    this.setState({taskRemarkComments: result.data.Items})
                })
            })
            return newId;
        })
        
    }

    render(){
        let taskType = [];
        let customer = [];
        let employee = [];
        if(this.state.taskType){
            taskType = this.state.taskType.map( s => ({value:s.key,label:s.value}) );
        }
        if(this.state.customer){
            customer = this.state.customer.map( s => ({value:s.key,label:s.value}) );
        }
        if(this.state.employee){
            employee = this.state.employee.map( s => ({value:s.key,label:s.value}) );
        }
        const { pageLoding } = this.state;
        return (
            <Modal
                show={this.props.show}
                onHide={()=>this.onHide()}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Creat_Task')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={8}>
                        <Form className="container product-form" onSubmit = { this.handleSubmit }>
                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                <Col className="product-text" style={{height:"auto"}}>
                                    <Select
                                        name="tasktype"
                                        options={taskType}
                                        placeholder={trls('Select')}
                                        onChange={val => this.setState({val1:val})}
                                        defaultValue = {{'value':3, 'label': 'Nieuwe klant'}}
                                    />
                                    <label className="placeholder-label">{trls('Task_Type')}</label>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                <Col className="product-text" style={{height:"auto"}}>
                                    {this.state.selectCustomerValue?(
                                        <Select
                                            name="customer"
                                            placeholder={trls('Select')}
                                            value={{"label":this.state.selectCustomerLabel,"value":this.state.selectCustomerValue}}
                                            options={customer}
                                            onChange={val => this.changeCustomer(val)}
                                        />
                                    ):<Select
                                        name="customer"
                                        placeholder={trls('Select')}
                                        options={customer}
                                        onChange={val => this.changeCustomer(val)}
                                    />}
                                    {!this.props.disabled && (
                                        <input
                                            onChange={val=>console.log()}
                                            tabIndex={-1}
                                            autoComplete="off"
                                            style={{ opacity: 0, height: 0, width: '100%' }}
                                            value={this.state.val5}
                                            required
                                        />
                                    )}
                                    <label className="placeholder-label">{trls('Customer')}</label>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                <Col className="product-text" style={{height:"auto"}}>
                                    <Select
                                        name="employee"
                                        placeholder={trls('Select')}
                                        options={employee}
                                        onChange={val => this.changeEmployee(val)}
                                        defaultValue={{'value': 34, 'label': 'Esther Sauer'}}
                                        isMulti={true}
                                    />
                                    <label className="placeholder-label">{trls('Employee')}</label>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formPlaintextPassword">
                                <Col className="product-text" style={{height:"auto"}}>
                                    {!this.state.orderdate ? (
                                        <DatePicker name="deadline" className="myDatePicker" selected={new Date()} onChange={date =>this.setState({orderdate:date})} />
                                    ) : <DatePicker name="deadline" className="myDatePicker" selected={this.state.orderdate} onChange={date =>this.setState({orderdate:date})} />
                                    }
                                    <label className="placeholder-label">{trls('Deadline')}</label> 
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formPlaintextPassword">
                                <Col className="product-text" style={{height:"auto"}}>
                                    <Form.Control type="text" name="subject" defaultValue="Nieuwe klant" required placeholder={trls('Subject')} />
                                    <label className="placeholder-label">{trls('Subject')}</label> 
                                </Col>
                            </Form.Group>
                            <Form.Group style={{textAlign:"center"}}>
                                <Button type="submit" style={{width:"100px"}}>{trls('Save')}</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col sm={4}>
                        <div className="status-toggle">
                            <h5 style={{float:'left'}}>{trls('Remarks')}</h5>
                                <Form.Control name = "omschrijving" as="textarea" rows="3" style={{marginTop:20}} placeholder={trls('New_note')} onChange={(evt)=>this.setState({remarkData: evt.target.value})}/>
                            <div style={{textAlign: 'right'}}>
                                {this.state.taskIds.length ? (
                                    <Button style={{ marginTop: 10}} onClick={()=>this.createRemark()}>{trls('Create')}</Button>
                                ):
                                    <Button style={{ marginTop: 10}} disabled onClick={()=>this.createRemark()}>{trls('Create')}</Button>
                                }
                                
                            </div>
                            {this.state.taskRemarkComments.length>0&&(
                                this.state.taskRemarkComments.map((data,i) =>(
                                    <div key={i} style={{backgroundColor: "lightgrey", marginTop: 10, padding: 10}}>
                                        <b>{data.username}</b>
                                        <div>
                                            <p>{data.createdon}</p>
                                            {data.remark}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Col>
                </Row>
                <Pageloadspiiner loading = {pageLoding}/>
            </Modal.Body>
        </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Taskform);