
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
import AddNewRawMaterial from './AddNewRawMaterial';
// import Updatecontact from './updatecontact';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class RawMaterials extends React.Component {
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
        rawMaterialsData: []
    }

    componentDidMount() {
        this._isMounted=true
        this.setState({loading: true});
        this.getRawMaterialsData();
    }
    getRawMaterialsData = () => {
        this._isMounted = true;
        let params = {
            id: this.props.itemDetailId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetRawMaterials, params, headers)
        .then(result => {
            if(this._isMounted){
                console.log("YYYYY", result.data.Items)
                this.setState({rawMaterialsData: result.data.Items});
                this.setState({loading:false})
                // if(this.state.filterDataFlag){
                    $('.filter').on( 'keyup', function () {
                        table.search( this.value ).draw();
                    } );
                    $('#raw_materials').dataTable().fnDestroy();
                    var table = $('#raw_materials').DataTable(
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
                        // "searching": false,
                        "dom": 't<"bottom-datatable" lip>',
                        // "ordering": false
                    },
                    );
                // }
            }
        });
    }

    // componentDidUpdate(){
    //     if(this.props.customerId){
    //         this.getCustomerData()
    //     }
    // }

    
    render () {
        let rawMaterialsData=this.state.rawMaterialsData;
        console.log("PPPPPPP", rawMaterialsData)
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
                <div {...{ className: 'accordion-item__content' }}>
                    <div className="contact-detail-header">
                        <Button type="button" onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}>{trls('Add_new')}</Button>
                        <AddNewRawMaterial
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                            getRawMaterials={this.getRawMaterialsData}
                            itemDetailId={this.props.itemDetailId}
                        />
                    </div>
                    <div className="table-responsive credit-history">
                        <table id="raw_materials" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Id')}</th>
                                <th>{trls('Type')}</th>
                                <th>{trls('Raw_material')}</th>
                            </tr>
                        </thead>
                        {rawMaterialsData && !this.state.loading &&(<tbody >
                            {
                                rawMaterialsData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{data.id}</td>
                                        <td>{data.type}</td>
                                        <td>{data.grondstof}</td>
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
        </div>
        )
    }
    }
    export default connect(mapStateToProps, mapDispatchToProps)(RawMaterials);
