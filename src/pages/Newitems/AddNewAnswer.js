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
class AddNewAnswer extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            pageLoding: false
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
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
            id: this.props.questionId,
            headerid:  this.props.itemDetailId,
            username: Auth.getUserName(),
            answer: data.answer,
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostNwAnswer, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.Success){
                    console.log("7777", result.data.Items)
                    this.setState({pageLoding: false});
                    // this.setState({
                    //     employees: [],
                    //     selectedEmployee: {},
                    // })
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
        const { pageLoding } = this.state;
        return (
            <Modal
                show={this.props.show}
                onHide={()=>this.props.onHide()}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Add_new_answer')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text" style={{height:"auto"}}>
                            <Form.Control type="text" name="answer" required />
                            <label className="placeholder-label">{trls('Answer')}</label> 
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
export default connect(mapStateToProps, mapDispatchToProps)(AddNewAnswer);