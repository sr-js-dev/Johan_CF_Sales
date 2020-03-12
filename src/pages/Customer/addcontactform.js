import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class Addcontactform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount() {
        let pathname = window.location.pathname;
        let pathArray = pathname.split('/')
        let customerId = pathArray.pop();
        this.setState({customerId: customerId})
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            customerid: this.state.customerId,
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phonework,
            mobile: data.mobile,
            email: data.email,
        }

        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostContact, params, headers)
        .then(result => {
            this.setState({telvalue:'', value: ''})
            this.props.onHide();
            this.props.onGetContact(this.state.customerId);
        });
    }
    render(){
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Create_Contact')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="firstname" required placeholder={trls('FirstName')} />
                            <label className="placeholder-label">{trls('FirstName')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="text" name="lastname" required placeholder={trls('LastName')} />
                            <label className="placeholder-label">{trls('LastName')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <PhoneInput
                                placeholder="Enter phone number"
                                value={ this.state.telvalue }
                                name="phonework"
                                onChange={ value => this.setState({telvalue: value }) } />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <PhoneInput
                                placeholder="Enter mobile number"
                                value={ this.state.value }
                                name="mobile"
                                onChange={ value => this.setState({value: value }) } />
                            {!this.props.disabled && (
                            <input
                                onChange={val=>console.log()}
                                tabIndex={-1}
                                autoComplete="off"
                                style={{ opacity: 0, height: 0 }}
                                value={this.state.value}
                                required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="email" name="email" required placeholder={trls('Email')} /> 
                            <label className="placeholder-label">{trls('Email')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" style={{width:"100px"}}>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Addcontactform);