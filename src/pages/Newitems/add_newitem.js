import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as Auth from '../../components/auth';
// import history from '../../history';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
// import $ from 'jquery';
// import SweetAlert from 'sweetalert';
import Pageloadspiiner from '../../components/page_load_spinner';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class AddNewItem extends Component {
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
            // selectedCustomer: {},
            customers: [],
            employee: [],
            employeeSelectData: [{'value': 34, 'label': 'Esther Sauer'}],
            taskIds: [],
            remarkData: '',
            pageLoding: false
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount(){
        this.setState({updateTask: this.props.updateTask, taskId: this.props.taskId})
        this.getCustomers();
        this.getEmployee();
    }

    getCustomers = () => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {};
        Axios.post(API.GetNewItemsCustomer, params, headers)
        .then(result => {
            let customers = result.data.Items.map(item => ({id: item.key, value: item.key, label: item.value}) );
            this.setState({customers: customers});
        });
    }

    getEmployee = () => {
        if(this.props.customerNewCreate){
            
            this.setState({val2:1})
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetEmployee, headers)
        .then(result => {
            this.setState({employee: result.data.Items});
        });
    }
    getContacts = (customerNumber) => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {
            klantnummer: customerNumber
        };
        Axios.post(API.GetNewItemContact, params, headers)
        .then(result => {
            let contacts = result.data.Items.map(item => ({id: item.key, value: item.key, label: item.value}));
            this.setState({contacts: contacts});
        });
    }
    changeCustomer = (val) => {
        // this.setState({selectCustomerLabel: val.label})
        // this.setState({selectCustomerValue: val.value})
        this.setState({selectedCustomer: val})
        this.getContacts(val.id)
    }
    changeContact = (val) => {
        // this.setState({selectCustomerLabel: val.label})
        // this.setState({selectCustomerValue: val.value})
        this.setState({selectedContact: val})
    }

    // changeEmployee = (val) =>{
    //     this.setState({employeeSelectData:val})
    //     this.setState({val3:1});
    // }

    handleSubmit = (event) => {
        this.setState({pageLoding: true});
        this._isMounted = true;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {};
        params = {          
            'username': Auth.getUserName(),
            'customer': Number(data.customer),
            'contact': Number(data.contact), 
            'description': data.description,
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostNewItem, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.Success){
                    this.setState({pageLoding: false});
                    this.onHide();
                    // history.push({
                    //     pathname: '/new-items/'+result.data.NewId,
                    //     params: { id: Number(result.data.NewId)}
                    // })
                    // SweetAlert({
                    //     title: trls('Success'),
                    //     icon: "success",
                    //     button: "OK",
                    // });
                }
            }
        });
    }

    onHide = () => {
        this.props.onHide();
        this.props.getNewItems();
        this.setState({
            customers: [],
            contacts: []
        })
    }

    render(){
        const { pageLoding, customers, selectedCustomer, contacts, selectedContact } = this.state;
        return (
            <Modal
                show={this.props.show}
                onHide={()=>this.props.onHide()}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Create_new_item')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Col className="product-text" style={{height:"auto"}}>
                            <Select
                                name="customer"
                                placeholder={trls('Select')}
                                options={customers}
                                onChange={val => this.changeCustomer(val)}
                                value={selectedCustomer}
                            />
                            <label className="placeholder-label">{trls('Customer')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Col className="product-text" style={{height:"auto"}}>
                            <Select
                                name="contact"
                                placeholder={trls('Select')}
                                options={contacts}
                                onChange={val => this.changeContact(val)}
                                value = {selectedContact}
                            />
                            <label className="placeholder-label">{trls('Contact')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text" style={{height:"auto"}}>
                            <Form.Control type="text" name="description" required placeholder={trls('Description')} />
                            <label className="placeholder-label">{trls('Description')}</label> 
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" style={{width:"100px"}}>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
                <Pageloadspiiner loading = {pageLoding}/>
            </Modal.Body>
        </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddNewItem);