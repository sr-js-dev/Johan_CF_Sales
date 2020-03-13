import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as Auth from '../../components/auth'
import DatePicker from "react-datepicker";
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class Updatetask  extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            orderdate: '', 
            val1: '',
            taskType: [],
            customer: [],
            employee: [],
            updateTask: [],
            taskRemarkComments: [],
            remarkFlag: false,
            remarkData: '',
            selectCustomer: [], 
            selectEmployee: [],
            status: []
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount() {
        this.setState({taskId: this.props.taskId})
        this.getCustomer();
        this.getEmployee();
        this.getStatus();
    }
    getCustomer = () => {
        this.props.detailmode()
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {
            customerId: Auth.getUserName()
        }
        Axios.post(API.GetCustomer, params, headers)
        .then(result => {
            this.setState({customer: result.data.Items});
        });
    }

    getEmployee = () => {
        this.props.detailmode()
        let updateTask=this.props.updateTask;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetEmployee, headers)
        .then(result => {
            this.setState({employee: result.data.Items});
        });
        this.setState({orderdate:new Date(updateTask[0].Deadline)})
        this.setState({subject:updateTask[0].subject})
    }

    getStatus = () => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetTaskStatusses, headers)
        .then(result => {
            let status = [];
            if(result.data.Items.length){
                status = result.data.Items.map( s => ({value:s.key,label:s.value}));
            }
            
            this.setState({status: status});
        });
    }

    changeCustomer = (val) => {
        this.setState({selectCustomer:val});
    }

    changeEmployee = (val) => {
        this.setState({selectEmployee:val});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            taskid: parseInt(this.state.taskId),
            customerid: parseInt(data.customer),
            employeeid: parseInt(data.employee),
            deadline: data.deadline,
            subject: data.subject,
            status: data.status
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PutTask , params, headers)
        .then(result => {
        });
    }

    createRemark = () =>{
        const {remarkData} = this.state;
        let commentParams = {
            "taskid": this.state.taskId,
            "username": Auth.getUserName(),
            "remark": remarkData
        }
        let params = {
            taskid: this.state.taskId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostTaskComments, commentParams, headers)
        .then(result => {
            Axios.post(API.GetTaskComments, params, headers)
            .then(result => {
                this.setState({taskRemarkComments: result.data.Items, remarkFlag: true})
            })
        })
    }

    onHide = () => {
        this.props.onHide();
        this.props.onGetTaskData();
    }

    render(){
        let customer = [];
        let employee = [];
        let remarkCommnets = [];
        if(this.state.customer){
            customer = this.state.customer.map( s => ({value:s.key,label:s.value}));
        }
        if(this.state.employee){
            employee = this.state.employee.map( s => ({value:s.key,label:s.value}));
        }
        const {updateTask} = this.props;
        const {status} = this.state;
        remarkCommnets = this.state.remarkFlag ? this.state.taskRemarkComments : updateTask.remark
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
                    {trls('Edit_Task')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={8}>
                        <Form className="container product-form" onSubmit = { this.handleSubmit }>
                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                <Col className="product-text">
                                    <Select
                                        name="customer"
                                        options={customer}
                                        placeholder={trls('Select')}
                                        defaultValue={{'label': updateTask[0] ? updateTask[0].customername: '', 'value': updateTask[0] ? updateTask[0].customerid: ''}}
                                        onChange={val => this.changeCustomer(val)}
                                    />
                                    <label className="placeholder-label">{trls('Customer')}</label> 
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                <Col className="product-text">
                                    <Select
                                        name="employee"
                                        placeholder={trls('Select')}
                                        options={employee}
                                        defaultValue={{'label': updateTask[0] ? updateTask[0].employeename: '', 'value': updateTask[0] ? updateTask[0].employeeid: ''}}
                                        onChange={val => this.changeEmployee(val)}
                                    />
                                    <label className="placeholder-label">{trls('Employee')}</label> 
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formPlaintextPassword">
                                <Col className="product-text">
                                    {!this.state.orderdate ? (
                                        <DatePicker name="deadline" className="myDatePicker" selected={new Date()} onChange={date =>this.setState({orderdate:date})} />
                                    ) : <DatePicker name="deadline" className="myDatePicker" selected={this.state.orderdate} onChange={date =>this.setState({orderdate:date})} />
                                    } 
                                    <label className="placeholder-label">{trls('Deadline')}</label> 
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formPlaintextPassword">
                                <Col className="product-text">
                                    <Form.Control type="text" name="subject" defaultValue={this.state.subject} required placeholder={trls('Subject')} />
                                    <label className="placeholder-label">{trls('Subject')}</label>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                <Col className="product-text">
                                    <Select
                                        name="status"
                                        options={status}
                                        placeholder={trls('Select')}
                                        // defaultValue={{'label': updateTask[0] ? updateTask[0].customername: '', 'value': updateTask[0] ? updateTask[0].customerid: ''}}
                                        onChange={val => this.changeCustomer(val)}
                                    />
                                    <label className="placeholder-label">{trls('Status')}</label> 
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
                                <Button style={{ marginTop: 10}} onClick={()=>this.createRemark()}>{trls('Create')}</Button>
                            </div>
                            {remarkCommnets &&(
                                remarkCommnets.map((data,i) =>(
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
            </Modal.Body>
        </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Updatetask);