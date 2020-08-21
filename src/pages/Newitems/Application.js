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

class Application extends React.Component {
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
        Axios.post(API.GetApplication, params, headers)
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
            color: data.color,
            inside: data.inside === 'on' ? true : false,
            cad: data.cad === 'on' ? true : false,
            model: data.model === 'on' ? true : false,
            temp: data.temp === 'on' ? true : false,
            outside: data.outside === 'on' ? true : false,
            uv: data.uv === 'on' ? true : false,
            impact: data.impact === 'on' ? true : false,
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PutApplication, params, headers)
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
            if(e.target.name === 'color'){
                temp[e.target.name] = e.target.value;
            } else {
                temp[e.target.name] = e.target.checked;
            }
            this.setState({
                item: temp
            })
            // this.setState(item => ({
            //     ...item,
            //     [e.target.name]: e.target.name === 'color' ? e.target.value:e.target.checked
            //   }));
        }

    render () {
        let customerPricingData=this.state.customerPricingData;
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
                    {/* <div className="contact-detail-header">
                        <Form.Check type="checkbox" name="ncham" label={trls("Show_rate")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.checkflag} onChange={this.chageViewRate}/>
                    </div> */}
                    <div className="table-responsive credit-history" style={{padding: "10px 0"}}>
                    <Form className="container product-form" onSubmit = { this.handleSubmit }>
                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Col>
                                <Form.Control type="text" name="color" defaultValue={this.state.item.color?this.state.item.color:''} onChange={this.changeCheckedState}/>
                                <label className="placeholder-label">{trls('Color')}</label>
                            </Col>
                        </Form.Group>
                        <div style={{display: "flex", flexWrap: "wrap", margin: "30px 0"}}>
                            <Form.Group as={Row} controlId="1">
                                <Col>
                                    <Form.Check type="checkbox" name="inside" label={trls("Inside")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.inside === "1" ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="2">
                                <Col>
                                <Form.Check type="checkbox" name="cad" label={trls("CAD_available")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.cad === "1" ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="3">
                                <Col>
                                <Form.Check type="checkbox" name="model" label={trls("Model")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.model === '1' ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="4">
                                <Col>
                                <Form.Check type="checkbox" name="temp" label={trls("Temperature_resistant")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.temp === '1' ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="5">
                                <Col>
                                <Form.Check type="checkbox" name="outside" label={trls("Outside")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.outside === '1' ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="6">
                                <Col>
                                <Form.Check type="checkbox" name="uv" label={trls("UV_resistant")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.uv === '1' ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="7">
                                <Col>
                                <Form.Check type="checkbox" name="impact" label={trls("Impact_resistant")} style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={this.state.item.impact === '1' ? true: false} onChange={this.changeCheckedState}/>
                                </Col>
                            </Form.Group>
                        </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Application);
