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
class AddNewQuestion extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            orderdate: '', 
            val: '',
            employees: [],
            remarkData: '',
            pageLoding: false
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(){
        if(this.props.newQuestionFlag){
            this.getEmployees();
        }
    }

    getEmployees = () => {
        this.props.detailMode();
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {};
        Axios.post(API.GetEmployeeDropdown, params, headers)
        .then(result => {
            // console.log("asdf", result.data.Items)
            let employees = result.data.Items.map(item => ({ value: item.key, label: item.value }));
            this.setState({employees: employees});
        });
    }

    changeEmployee = (value) => {
        this.setState({selectedEmployee: value})
    }


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
            headerid:  this.props.itemDetailId,
            username: Auth.getUserName(),
            question: data.question,
            questionto: data.employee
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostNwQuestion, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.Success){
                    this.setState({pageLoding: false});
                    this.setState({
                        employees: [],
                        selectedEmployee: {},
                    })
                    this.onHide();
                }
            }
        });
    }

    onHide = () => {
        this.props.onHide();
        this.props.getQuestions();
    }

    render(){
        const { pageLoding, employees, selectedEmployee } = this.state;
        return (
            <Modal
                show={this.props.show}
                onHide={()=>this.props.onHide()}
                size="xs"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Create_new_question')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text" style={{height:"auto"}}>
                            <Form.Control type="text" name="question" required  />
                            <label className="placeholder-label">{trls('Question')}</label> 
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Col className="product-text" style={{height:"auto"}}>
                            <Select
                                name="employee"
                                placeholder={trls('Select')}
                                options={employees}
                                onChange={value => this.changeEmployee(value)}
                                value={selectedEmployee}
                            />
                            <label className="placeholder-label">{trls('Ask_to')}</label>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddNewQuestion);