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
class AddNewRawMaterial extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            types: [],
            values: [],
            pageLoading: false
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount(){
        this.getNewRawMaterialTypes();
    }

    getNewRawMaterialTypes = () => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {};
        Axios.post(API.GetNewMaterialTypes, params, headers)
        .then(result => {
            let types = result.data.Items.map(item => ({value: item.key, label: item.key}));
            this.setState({types: types});
        });
    }

    getValues = (type) => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {
            type: type
        };
        Axios.post(API.GetNewMaterialValues, params, headers)
        .then(result => {
            let values = result.data.Items.map(item => ({value: item.key, label: item.value}));
            this.setState({values: values});
        });
    }
    changeType = (val) => {
        this.setState({selectedType: val})
        this.getValues(val.value)
    }
    changeValue = (val) => {
        this.setState({selectedValue: val})
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
            'username': Auth.getUserName(),
            'nwartid': Number(this.props.itemDetailId),
            'type': data.type,
            'rawmaterialid': Number(data.value)
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostNewRawMaterial, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.Success){
                    this.setState({pageLoading: false});
                    this.onHide();
                }
            }
        });
    }

    onHide = () => {
        this.props.onHide();
        this.props.getRawMaterials();
        this.setState({
            types: [],
            values: []
        })
    }

    render(){
        const { pageLoading, types, selectedType, values, selectedValue } = this.state;
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
                    {trls('Create_new_raw_material')}
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
                            <Select
                                name="value"
                                placeholder={trls('Select')}
                                options={values}
                                onChange={val => this.changeValue(val)}
                                value = {selectedValue}
                            />
                            <label className="placeholder-label">{trls('Value')}</label>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddNewRawMaterial);