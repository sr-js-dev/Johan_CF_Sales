import React, {Component} from 'react'
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from './translate';
import API from './api'
import FileDrop from 'react-file-drop';
import Axios from 'axios';
import * as Auth from './auth'
import SweetAlert from 'sweetalert';
import $ from 'jquery';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
});

class Dragdropfileupload extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            files: []
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
    }

    componentDidUpdate(){

    }

    openUploadFile = () =>{
        $('#inputFile').show();
        $('#inputFile').focus();
        $('#inputFile').click();
        $('#inputFile').hide();
    }

    onChange = (e) => {
        let fileData = this.state.files;
        fileData.push(e.target.files[0]);
        this.setState({files: fileData});
    }

    handleDrop = (files, event) => {
        let fileData = this.state.files;
        for(var i=0; i<files.length; i++){
            fileData.push(files[i]);
        }
        this.setState({files: fileData});
    }

    fileUpload = () => {
        var formData = new FormData();
        let fileData = this.state.files;
        
        var headers = {
            "headers": {
                "Authorization": "Bearer "+Auth.getUserToken(),
            }
        }
        let fileLength = fileData.length;
        fileData.map((file, key)=>{
            formData.append('file', file);// file from input
            Axios.post(API.PostFileUpload, formData, headers)
            .then(result => {
                if(result.data.Id){
                    this.props.onPostFileDataById(result.data.Id);
                    if(fileLength-1===key){
                        this.props.onHide();
                        SweetAlert({
                            title: trls('Success'),
                            icon: "success",
                            button: "OK",
                        });
                        this.setState({files: []});
                    }
                }
            })
            .catch(err => {
            });
            return file;
        })
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
                    {trls("FileUpload")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FileDrop className="drag-file-upload" onDrop={this.handleDrop}>
                    <div className = "drag-file-upload__title" onClick={()=>this.openUploadFile()}>
                        <i className="fas fa-upload" style={{fontSize: 40}}></i>
                        <p>{trls("Choose_a_file")}</p>
                        {this.state.files.length>0&&(
                            this.state.files.map((data,i) =>(
                                <div id={i} key={i} style={{fontSize: 14, fontWeight: 100}}>
                                    {data.name}
                                </div>
                                ))
                            )
                        }
                    </div> 
                    <input id="inputFile" name="file" type="file" accept="*.*"  onChange={this.onChange} style={{display: "none"}} />   
                </FileDrop>
                <div style={{textAlign: "center", paddingTop: 20}}>
                    <Button variant="primary" onClick={()=>this.fileUpload()}>{trls('Upload')}</Button>   
                </div>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dragdropfileupload);