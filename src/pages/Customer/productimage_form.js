import React, {Component} from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../components/translate';
import 'react-phone-number-input/style.css'

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});

class Productimageform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
        };
    }

    render(){
        console.log('555555', this.props.imagePath);
        console.log('6666', this.props.productNumber);
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
                    <span style={{fontWeight: 'bold', color:"#097DBF", fontSize: 21}}>{this.props.productNumber}</span> {trls('Image')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={this.props.imagePath} style={{width: '100%'}} alt={'product'}/>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Productimageform);