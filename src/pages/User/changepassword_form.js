import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import Message from '../../components/message';

const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
    removeState: () =>
        dispatch(authAction.blankdispatch()),
});

class Changepasswordform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
        };
    }

    handleSubmit = (event) => {
        this.props.removeState();
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            OldPassword: data.oldpassword,
            NewPassword: data.newpassword,
            ConfirmPassword: data.confirmpassword
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.ChangePassword, params, headers)
        .then(result => {
            this.props.onHide();
            this.props.removeState();
            this.props.onGetUser()
        })
        .catch(err => {
            if(err.response.data.ModelState[""]){
                this.props.postUserError(err.response.data.ModelState[""])
            }else if(err.response.data.ModelState["model.NewPassword"] && !err.response.data.ModelState["model.ConfirmPassword"]){
                this.props.postUserError(err.response.data.ModelState["model.NewPassword"])
            }else if(err.response.data.ModelState["model.ConfirmPassword"])
                this.props.postUserError(err.response.data.ModelState["model.ConfirmPassword"])
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
                    {trls('Change_password')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Message message={this.props.error} type={"error"}/>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="password" name="oldpassword" required  placeholder={trls('Old_password')} />
                            <label className="placeholder-label">{trls('Old_password')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="password" name="newpassword" required  placeholder={trls('New_password')} />
                            <label className="placeholder-label">{trls('New_password')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Col className="product-text">
                            <Form.Control type="password" name="confirmpassword" required  placeholder={trls('ConfirmPassword')} />
                            <label className="placeholder-label">{trls('ConfirmPassword')}</label>
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
export default connect(mapStateToProps, mapDispatchToProps)(Changepasswordform);