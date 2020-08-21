import React from 'react';
import '../../assets/css/collapsepanel.scss';
import { trls } from '../../components/translate';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import 'datatables.net';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});

const inputclass = {
    margin: "20px 0"
}

class Production extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
    };
  }
  render () {
    return (
      <div {...{ className: 'wrapper' }}>
        <ul {...{ className: 'accordion-list' }}>
                <AccordionItem {...this.props} />
        </ul>
      </div>
    )
  }
}

class AccordionItem extends React.Component {

    state = {
        opened: false,
    }

    constructor(props) {
        var date = new Date();
        var curyear = date.getFullYear(); 
        super(props);
        this.state = {  
            lastYear2 : curyear-2,
            lastYear3 : curyear-3,
            checkflag: false,
            item : {}
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.setState({loading:true})
        this.getCustomerData()
    }

    getCustomerData () {
        // this._isMounted = true;
        let params = {
            headerid: Number(this.props.itemDetailId)
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetProduction, params, headers)
        .then(result => {
            this.setState({item: result.data.Items[0]})
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            id: this.state.item.id,
            single: data.single === 'on' ? true : false,
            coex: data.coex === 'on' ? true : false,
            triex: data.triex === 'on' ? true : false,
            weight: data.weight,
            consumption: data.consumption,
            length: data.length,
            tolerancemax: data.tolerancemax,
            tolerancemin: data.tolerancemin,
            speed: data.speed,
            batchsize: data.batchsize,
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PutProduction, params, headers)
        .then(result => {
            if(result.data.Success){
                // this.getCustomerData(); 
                let opened = this.state.opened 
                this.setState({ opened: !opened })  
            }
        });
    }

    changeCheckedState = (e) => {
        let temp = this.state.item;
        temp[e.target.name] = e.target.checked;
        this.setState({
            item: temp
        })
        // this.setState(item => ({
        //     ...item,
        //     [e.target.name]: e.target.name === 'color' ? e.target.value:e.target.checked
        //   }));
    }

    changeValueState = (e) => {
        let temp = this.state.item;
        temp[e.target.name] = e.target.value;
        this.setState({
            item: temp
        })
        // this.setState(item => ({
        //     ...item,
        //     [e.target.name]: e.target.name === 'color' ? e.target.value:e.target.checked
        //   }));
    }

    render () {
        const {
            props: {
                title
            },
            state: {
                opened
            }
        } = this
        return (
        <div
            {...{
            className: `accordion-item, ${opened && 'accordion-item--opened'}`,
            }}
        >
            <div {...{ className: 'accordion-item__line', onClick: () => { this.setState({ opened: !opened }) } }}>
            <h3 {...{ className: 'accordion-item__title' }}>
                {title}
            </h3>
            <span {...{ className: 'accordion-item__icon' }}/>
            </div>
            
            <div {...{ className: 'accordion-item__inner' }} style={{borderTop: "1px solid rgba(0,0,0,.125)"}}>
                <div {...{ className: 'accordion-item__content' }} style={{position:"relative", top: "25px"}}>
                    <div className="table-responsive credit-history" style={{padding: "10px 0"}}>
                    <Form className="container product-form" onSubmit = { this.handleSubmit }>
                        <div style={{display: "flex", flexWrap: "wrap"}}>
                            <Form.Group as={Row} controlId="checkbox1">
                                <Col>
                                    <Form.Check type="checkbox" name="single" label={trls("Single")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.single === "1" ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="checkbox2">
                                <Col>
                                <Form.Check type="checkbox" name="coex" label={trls("Coex")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.coex === "1" ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="checkbox3">
                                <Col>
                                <Form.Check type="checkbox" name="triex" label={trls("Triex")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.triex === '1' ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                        </div>
                        <Form.Group as={Row} controlId="formPlaintextPassword1" style={inputclass}>
                            <Col>
                                <Form.Control type="text" name="weight" defaultValue={this.state.item.weight?this.state.item.weight:''} onChange={this.changeValueState}/>
                                <label className="placeholder-label">{trls('Weight')}</label>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextPassword2" style={inputclass}>
                            <Col>
                                <Form.Control type="text" name="consumption" defaultValue={this.state.item.consumption?this.state.item.consumption:''} onChange={this.changeValueState}/>
                                <label className="placeholder-label">{trls('Yearly_consumption')}</label>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextPassword3" style={inputclass} style={inputclass}>
                            <Col>
                                <Form.Control type="text" name="length" defaultValue={this.state.item.length?this.state.item.length:''} onChange={this.changeValueState}/>
                                <label className="placeholder-label">{trls('Length')}</label>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextPassword4" style={inputclass}>
                            <Col>
                                <Form.Control type="text" name="tolerancemax" defaultValue={this.state.item.toleranceMax?this.state.item.toleranceMax:''} onChange={this.changeValueState}/>
                                <label className="placeholder-label">{trls('Length_tolerance_max')}</label>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextPassword5" style={inputclass}>
                            <Col>
                                <Form.Control type="text" name="tolerancemin" defaultValue={this.state.item.toleranceMin?this.state.item.toleranceMin:''} onChange={this.changeValueState}/>
                                <label className="placeholder-label">{trls('Length_tolerance_min')}</label>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextPassword6" style={inputclass}>
                            <Col>
                                <Form.Control type="text" name="speed" defaultValue={this.state.item.speed?this.state.item.speed:''} onChange={this.changeValueState}/>
                                <label className="placeholder-label">{trls('Speed')}</label>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextPassword7" style={inputclass}>
                            <Col>
                                <Form.Control type="text" name="batchsize" defaultValue={this.state.item.batchsize?this.state.item.batchsize:''} onChange={this.changeCheckedState}/>
                                <label className="placeholder-label">{trls('Batchsize')}</label>
                            </Col>
                        </Form.Group>
                        <Form.Group style={{textAlign:"center"}}>
                            <Button type="submit" style={{width:"100px"}}>{trls('Save')}</Button>
                        </Form.Group>
                    </Form>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Production);
