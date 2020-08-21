import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as Auth from '../../components/auth';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import Pageloadspiiner from '../../components/page_load_spinner';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});
class AddNewPeriphery extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            types: [],
            pageLoading: false,
            show: props.show,
            postProcessing: false,
            description: ''
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(){
        if(this.props.newRawMaterialFlag){
            this.getNewPeripheryTypes();
        }
    }

    getNewPeripheryTypes = () => {
        this.props.detailMode();
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {};
        Axios.post(API.GetNwPeriferieTypesDropdown, params, headers)
        .then(result => {
            let types = result.data.Items.map(item => ({value: item.key, label: item.value}));
            this.setState({types: types});
        });
    }
    changeType = (val) => {
        this.setState({selectedType: val})
    }

    handleSubmit = (event) => {
        this.setState({pageLoading: true});
        this._isMounted = true;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {};
        params = {          
            'headerid': Number(this.props.itemDetailId),
            'type': Number(data.type),
            'description': data.description,
            'postProcessing': this.state.postProcessing
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.postNwPeriphery, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.Success){
                    this.setState({pageLoading: false});
                    this.onHide();
                }
            }
        });
    }

    changeDescription = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    changeCheckedState = (e) => {
        this.setState({
            postProcessing: e.target.checked
        })
    }

    onHide = () => {
        this.props.onHide();
        this.props.getRawMaterials();
        this.setState({
            types: [],
            description: '',
            postProcessing: false,
            selectedType: null
        })
    }

    render(){
        const { pageLoading, types, selectedType } = this.state;
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
                    {trls('Create_new_periphery')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Col className="product-text" style={{height:"auto"}}>
                            <Select
                                name="type"
                                placeholder={trls('Select')}
                                options={types}
                                onChange={val => this.changeType(val)}
                                value={selectedType}
                            />
                            <label className="placeholder-label">{trls('Type')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Col className="product-text" style={{height:"auto"}}>
                            <Form.Control type="text" name="description" placeholder={trls('Description')} value={this.state.description} onChange={this.changeDescription}/>
                            <label className="placeholder-label">{trls('Description')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="checkbox3" style={{padding:"0 10px"}}>
                        <Col>
                            <Form.Check type="checkbox" name="postProcessing" label={trls("Post_processing")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.postProcessing} onChange={this.changeCheckedState}/>
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" style={{width:"100px"}}>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
                <Pageloadspiiner loading = {pageLoading}/>
            </Modal.Body>
        </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddNewPeriphery);