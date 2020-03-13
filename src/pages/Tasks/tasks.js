import React, {Component} from 'react'
import { connect } from 'react-redux';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import { Button, Col, Row } from 'react-bootstrap';
import  Taskform  from './taskform'
import { trls } from '../../components/translate';
import 'datatables.net';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import Updatetask from './updatetask.js'
import Taskhistory from './taskhistory.js'
import Taskdocument from './taskdocument'
import FileUploadForm from '../../components/drag_drop_fileupload';

const mapStateToProps = state => ({
     ...state.auth,
});

const mapDispatchToProps = dispatch => ({

}); 
class Tasks extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading:true,
            tasksData:[],
            currentDate: new Date(),
            search_flag: true,
            arrayFilename: [],
            modalupdateShow: false
        };
      }
componentDidMount() {
    this.setState({search_flag: true})
    this.getTasksData();
}

getTasksData = () => {
    this.setState({loading:true})
    var header = SessionManager.shared().getAuthorizationHeader();
    Axios.get(API.GetTasksData, header)
    .then(result => {
        this.setState({tasksData:result.data.Items})
        this.setState({loading:false})
        // if(this.state.search_flag){
        //     $('#example-task thead tr').clone(true).appendTo( '#example-task thead' );
        //     $('#example-task thead tr:eq(1) th').each( function (i) {
        //         var title = $(this).text();
        //         var id = $(this).attr('id')
        //         $(this).removeAttr('class');
        //         if(id==="Status" || id==="Employee" || id==="CreateBy" || id==="Task_Type"){
        //             $(this).html( '<input type="text" style="width:100%" placeholder="'+title+'" />' );
        //         }
        //         else{
        //             $(this).html( '<div />' );
        //         }
        //         $(this).addClass("sort-style");
        //         $( 'input', this ).on( 'keyup change', function () {
        //             if ( table.column(i).search() !== this.value ) {
        //                 table
        //                     .column(i)
        //                     .search( this.value )
        //                     .draw();
        //             }
        //         } );
        //     } );
        // }
        this.setState({search_flag: false})
        $('#example-task').dataTable().fnDestroy();
        $('#example-task').DataTable(
            {
                orderCellsTop: true,
                fixedHeader: true,
                "language": {
                    "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
                    "zeroRecords": "Nothing found - sorry",
                    "info": trls("Show_page")+" _PAGE_ of _PAGES_",
                    "infoEmpty": "No records available",
                    "infoFiltered": "(filtered from _MAX_ total records)",
                    "search": trls('Search'),
                    "paginate": {
                        "previous": trls('Previous'),
                        "next": trls('Next')
                    },
                },
                "searching": false,
                "dom": 't<"bottom-datatable" lip>'
                }
          );
    });
}

formatDate = (startdate) =>{
        
    var dd = new Date(startdate).getDate();
    var mm = new Date(startdate).getMonth()+1; 
    var yyyy = new Date(startdate).getFullYear();
    var formatDate = '';
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    formatDate = yyyy+'-'+mm+'-'+dd;
    return formatDate;
}
componentWillUnmount() {
}

taskUpdate = (id) => {
    this._isMounted = true;
    let taskid=id;
    let params = {
        taskid:taskid
    }
    let updateData = [];
    var headers = SessionManager.shared().getAuthorizationHeader();
    Axios.post(API.GetTask, params, headers)
    .then(result => {
        if(this._isMounted){
            updateData = result.data.Items
        }
        Axios.post(API.GetTaskComments, params, headers)
        .then(result => {
            if(this._isMounted){    
                if(result.data.Items[0]){
                    updateData.remark = result.data.Items;
                }
                this.setState({updateTask: updateData, modalupdateShow:true, taskId: taskid})
            }
        })
    });
}

viewHistory = (id) => {
    this._isMounted = true;
    let taskid = id;
    let params = {
        taskid:taskid
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
    Axios.post(API.GetTaskHistory, params, headers)
    .then(result => {
        if(this._isMounted){    
            this.setState({modalViewShow: true})
            this.setState({viewHistoryData: result.data.Items})
        }
    });
}

detailmode = () =>{
    this.setState({taskId: ""})
    this.setState({taskflag: false})
}


postTaskDocuments = (docuId) => {
    this._isMounted = true;
    let params = {
        taskid: this.state.attachtaskId,
        documentid: docuId
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
    Axios.post(API.PostTaskDocuments, params, headers)
    .then(result => {
        if(this._isMounted){    
            // SweetAlert({
            //     title: trls('Success'),
            //     icon: "success",
            //     button: "OK",
            //   });
        }
    })
    .catch(err => {
        // SweetAlert({
        //     title: trls('Fail'),
        //     icon: "warning",
        //     button: "OK",
        //   });
    });
}

getAttachFileName = (id) =>{
    let tempArray = [];
    let filemane = '';
    tempArray = this.state.arrayFilename;
    tempArray.map((data, index) => {
        if(data.key===String(id)){
            filemane = data.name;
        }
        return tempArray;
    })
    return filemane;
}

getTaskDocuments = (data) =>{
    this._isMounted = true;
    let taskData=data;
    let arrayTaskData = [];
    arrayTaskData = taskData.split(',');
    let params = {
        taskid:parseInt(arrayTaskData[0])
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
    Axios.post(API.GetTaskDocuments, params, headers)
    .then(result => {
        if(this._isMounted){    
            this.setState({modaldocumentShow: true})
            this.setState({documentData: result.data.Items})
            this.setState({documentHeader: arrayTaskData})
        }
    });
}

render () {
    let tasksData = this.state.tasksData
    if(tasksData){
        tasksData.sort(function(a, b) {
            return a.id - b.id;
        });
    }
    let currentDate = this.formatDate(this.state.currentDate)
    return (
        <div className="order_div">
            <div className="content__header content__header--with-line">
                <h2 className="title">{trls('Tasks')}</h2>
            </div>
            <div className="orders">
                <Row>
                    <Col sm={6}>
                        <Button variant="primary" onClick={()=>this.setState({modalShow:true, taskflag:true})}><i className="fas fa-plus add-icon"></i>{trls('Add_Tasks')}</Button>   
                    </Col>
                </Row>
                <div className="table-responsive">
                    <table id="example-task" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th id="CustomerName">{trls('CustomerName')}</th>
                                <th id="DateCreated">{trls('DateCreated')}</th>
                                <th id="Deadline">{trls('Deadline')}</th>
                                <th id="Employee">{trls('Employee')}</th>
                                <th id="Task_Type">{trls('Task_Type')}</th>
                                <th id="Subject">{trls('Subject')}</th>
                                <th id="CreateBy">{trls('CreateBy')}</th>
                                <th id="Status">{trls('Status')}</th>
                                <th id="Attachment">{trls('Attachment')}</th>
                                <th id="Action">{trls('Action')}</th>
                            </tr>
                        </thead>
                        {tasksData && !this.state.loading &&(<tbody >
                            {
                                tasksData.map((data,i) =>(
                                <tr className={new Date(currentDate) > new Date(this.formatDate(data.deadline)) ? 'task-table-tr-past' : 'task-table-tr'} id={data.Id} key={i}>
                                    <td>{data.CustomerName}</td>
                                    <td>{this.formatDate(data.DateCreated)}</td>
                                    <td>{this.formatDate(data.deadline)}</td>
                                    <td>{data.employee}</td>
                                    <td>{data.taskType}</td>
                                    <td>{data.Subject}</td>
                                    <td>{data.createdby}</td>
                                    <td>{data.taskStatus}</td>
                                    <td width={200}>
                                        <Row style={{justifyContent:"space-around"}}>
                                            <i className="fas fa-file-upload add-icon" onClick={()=>this.setState({fileUploadModalShow: true, attachtaskId: data.Id})}><span className="action-title">{trls('Attach')}</span></i>
                                            <i className="fas fa-eye add-icon" onClick={()=>this.getTaskDocuments(data.Id+','+data.CustomerName+','+data.employee+','+data.Subject)}><span className="action-title">{trls('View')}</span></i>
                                        </Row>
                                    </td>
                                    <td width={200}>
                                        <Row style={{justifyContent:"space-around"}}>
                                            <i className="fas fa-pen add-icon" onClick={()=>this.taskUpdate(data.Id)}><span className="action-title">{trls('Edit')}</span></i>
                                            <i className="fas fa-eye add-icon" onClick={()=>this.viewHistory(data.Id)}><span className="action-title">{trls('View')}</span></i>
                                        </Row>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
                    { this.state.loading&& (
                        <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                            <BallBeat
                                color={'#222A42'}
                                loading={this.state.loading}
                            />
                        </div>
                    )}
                </div>
            </div>
            <Taskform
                show={this.state.modalShow}
                onHide={() => this.setState({modalShow: false})}
                taskflag={this.state.taskflag}
                onGetTask={()=> this.getTasksData()}
                detailmode={this.detailmode}
            />
            {this.state.modalupdateShow && (
                <Updatetask
                    show={this.state.modalupdateShow}
                    onHide={() => this.setState({modalupdateShow: false})}
                    updateTask={this.state.updateTask}
                    taskId={this.state.taskId}
                    onGetTaskData={()=> this.getTasksData()}
                    detailmode={this.detailmode}
                /> 
            )}
            <Taskhistory
                show={this.state.modalViewShow}
                onHide={() => this.setState({modalViewShow: false})}
                viewHistoryData = {this.state.viewHistoryData}
            />
            <Taskdocument
                show={this.state.modaldocumentShow}
                onHide={() => this.setState({modaldocumentShow: false})}
                documentData = {this.state.documentData}
                documentHeader = {this.state.documentHeader}
            />
            <FileUploadForm
                show={this.state.fileUploadModalShow}
                onHide={() => this.setState({fileUploadModalShow: false})}
                onPostFileDataById={(fileid)=>this.postTaskDocuments(fileid)}
            />
        </div>
    )
};
}
export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
