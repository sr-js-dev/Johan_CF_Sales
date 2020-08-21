
import React from 'react';
import '../../assets/css/collapsepanel.scss';
import { trls } from '../../components/translate';
import { Form, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import 'datatables.net';
import { BallBeat } from 'react-pure-loaders';
import AddNewPeriphery from './AddNewPeriphery';
// import Updatecontact from './updatecontact';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Periphery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
        showCheckFlag:''
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
        firstLoad: false,
        peripheryDatas: [],
        newRawMaterialFlag: false
    }

    componentDidMount() {
        this._isMounted=true
        this.setState({loading: true});
        this.getPeripheryDatas();
    }
    
    getPeripheryDatas = () => {
        this.setState({loading: true});
        this._isMounted = true;
        let params = {
            headerid: Number(this.props.itemDetailId)
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetNwPeriphery, params, headers)
        .then(result => {
            if(this._isMounted){
                if(result.data.Success){
                    this.setState({peripheryDatas: result.data.Items});
                    this.setState({loading:false})
                    $('#periphery').dataTable().fnDestroy();
                    $('#periphery').DataTable(
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
                        "searching": false,
                        "dom": 't<"bottom-datatable" lip>',
                        "ordering": false
                    },
                    );
                }
            }
        });
    }

    render () {
        const {
        props: {
            title
        },
        state: {
            opened,
            peripheryDatas
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
                <div {...{ className: 'accordion-item__content' }}>
                    <div className="contact-detail-header">
                        <Button type="button" onClick={()=>this.setState({ modalShow:true, newRawMaterialFlag: true })}>{trls('Add_periphery')}</Button>
                    </div>
                    <div className="table-responsive credit-history">
                        <table id="periphery" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Type')}</th>
                                <th>{trls('Description')}</th>
                                <th>{trls('Post_processing')}</th>
                            </tr>
                        </thead>
                        {peripheryDatas && !this.state.loading &&(<tbody >
                            {
                                peripheryDatas.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{data.type}</td>
                                        <td>{data.description}</td>
                                        <td><Form.Check type="checkbox" name="postProcessing" style={{fontSize:"16px",marginRight:"40px", marginTop:'10px'}} checked={data.postProcessing === '1' ? true : false } readOnly/></td>
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
            </div>
            <AddNewPeriphery
                show={this.state.modalShow}
                onHide={() => this.setState({modalShow: false})}
                getRawMaterials={() => this.getPeripheryDatas()}
                itemDetailId={this.props.itemDetailId}
                newRawMaterialFlag={this.state.newRawMaterialFlag}
                detailMode={() => this.setState({newRawMaterialFlag: false})}
            />
        </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Periphery);

