import React, {Component} from 'react'
import { Col, Row, Form, ProgressBar, Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import AddNewQuestion from './AddNewQuestion';
import AddNewAnswer from './AddNewAnswer';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
import $ from 'jquery';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});

class Questions extends Component {

    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            questions:[],
            loading:false,
            newQuestionFlag: false
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getQuestions();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getQuestions = () => {
        this.setState({loading: true});
        this._isMounted = true;
        let params = {
            headerid:  this.props.itemDetailId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetNwQuestions, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.Success){
                    this.setState({questions: result.data.Items});
                    this.setState({loading:false})
                    $('.filter').on( 'keyup', function () {
                        table.search( this.value ).draw();
                    } );
                    $('#questions').dataTable().fnDestroy();
                    var table = $('#questions').DataTable(
                        {
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
                        "dom": 't<"bottom-datatable" lip>',
                         "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                    },
                    );
                }
                
            }
        });
    }

    render () {
        let questions=this.state.questions;
        return (
            <Card className="card-container-col" style={{marginTop: 20, height: 'unset'}}>
                <Card.Header><i className="fas fa-question" style={{paddingRight:"5px", fontSize:"18px"}}></i>{this.props.title}</Card.Header>
                <Card.Body>
                    <Row>
                        <Col sm={6}>
                            {!this.state.loading?(
                                <Button variant="primary" onClick={()=>this.setState({modalShow:true, mode:"add", newQuestionFlag: true})}><i className="fas fa-plus add-icon"></i>{trls('Add_new')}</Button>
                            ):
                                <Button variant="primary" disabled onClick={()=>this.setState({modalShow:true, mode:"add", newQuestionFlag: true})}><i className="fas fa-plus add-icon"></i>{trls('Add_new')}</Button>
                            }
                        </Col>
                        <Col sm={6} className="has-search">
                            <div style={{display: 'flex', float: 'right'}}>
                                <div style={{marginLeft: 20}}>
                                    <span className="fa fa-search form-control-feedback"></span>
                                    <Form.Control className="form-control filter" type="text" name="number"placeholder={trls("Quick_search")}/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="table-responsive">
                        <table id="questions" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Question')}</th>
                                <th>{trls('Question_by')}</th>
                                <th>{trls('Question_to')}</th>
                                <th>{trls('Answer')}</th>
                            </tr>
                        </thead>
                        {questions && !this.state.loading &&(<tbody >
                            {
                                questions.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{data.Question}</td>
                                        <td>{data.QuestionBy}</td>
                                        <td>{data.QuestionTo}</td>
                                        {data.Answer?(
                                        <td>
                                            {data.Answer}
                                        </td>
                                        ):(
                                            <td>
                                                <i className="fas fa-reply-all add-icon" onClick={()=>this.setState({answerModalShow: true, mode:"edit", questionId: data.id})}></i>
                                            </td>
                                        )}
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
                </Card.Body>
                <AddNewQuestion
                    show={this.state.modalShow}
                    onHide={() => this.setState({modalShow: false})}
                    getQuestions={()=> this.getQuestions()}
                    newQuestionFlag = {this.state.newQuestionFlag}
                    detailMode={() => this.setState({newQuestionFlag: false})}
                    itemDetailId = {this.props.itemDetailId}
                />
                <AddNewAnswer
                    show={this.state.answerModalShow}
                    onHide={() => this.setState({answerModalShow: false})}
                    getQuestions={()=> this.getQuestions()}
                    newQuestionFlag = {this.state.newQuestionFlag}
                    detailMode={() => this.setState({newQuestionFlag: false})}
                    itemDetailId = {this.props.itemDetailId}
                    questionId = {this.state.questionId}
                />
            </Card>
        )
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Questions);
