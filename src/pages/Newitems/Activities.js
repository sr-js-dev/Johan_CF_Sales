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

class Activities extends Component {

    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            activities:[],
            loading:false,
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getActivities();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getActivities = () => {
        this.setState({loading: true});
        this._isMounted = true;
        let params = {
            headerid:  this.props.itemDetailId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetNwActivities, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.Success){
                    console.log("66666", result.data.Items);
                    this.setState({activities: result.data.Items});
                    this.setState({loading:false})
                    $('.filter').on( 'keyup', function () {
                        table.search( this.value ).draw();
                    } );
                    $('#activities_table').dataTable().fnDestroy();
                    var table = $('#activities_table').DataTable(
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
    dateTimeFormat = (changedDate) => {
        let year = new Date(changedDate).getFullYear();
        let month = new Date(changedDate).getMonth();
        let date = new Date(changedDate).getDate();
        let hour = new Date(changedDate).getHours();
        let minute = new Date(changedDate).getMinutes();
        var month_format = 0;
        var date_format = 0;
        var hour_format = 0;
        var minute_format = 0;
        if(month + 1 < 10){
            month_format = '0' + ( month + 1);
        } else {
            month_format = month + 1;
        }
        if(date < 10) {
            date_format = '0'+date;
        } else {
            date_format = date;
        }
        if(hour < 10) {
            hour_format = '0'+hour;
        } else {
            hour_format = hour;
        }
        if(minute < 10) {
            minute_format = '0'+minute;
        } else {
            minute_format = minute;
        }
        return date_format + '-' + month_format + '-' + year  + ' ' + hour_format + ':' + minute_format;
    }
    render () {
        let activities=this.state.activities;
        return (
            <Card className="card-container-col" style={{marginTop: 20, height: 'unset'}}>
                <Card.Header><i className="fas fa-pen-alt" style={{paddingRight:"5px", fontSize:"18px"}}></i>{this.props.title}</Card.Header>
                <Card.Body>
                    <Row>
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
                        <table id="activities_table" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Date')}</th>
                                <th>{trls('Description')}</th>
                                <th>{trls('Changed_by')}</th>
                            </tr>
                        </thead>
                        {activities && !this.state.loading &&(<tbody >
                            {
                                activities.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{this.dateTimeFormat(data.Date)}</td>
                                        <td>{data.Description}</td>
                                        <td>{data.ChangedBy}</td>
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
            </Card>
        )
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Activities);
