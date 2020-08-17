import React from 'react';
import '../../assets/css/collapsepanel.scss';
import { trls } from '../../components/translate';
import { connect } from 'react-redux';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import 'datatables.net';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});

class Document extends React.Component {
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
        // var date = new Date();
        // var curyear = date.getFullYear(); 
        super(props);
        this.state = {  
            customerId: this.props.customerId
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.setState({loading:true})
    }

    getCustomerData (value) {
        this._isMounted = true;
        let params = {
            customerid : 20435
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetCustomerDocuments, params, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({documentData:result.data.Items})
                this.props.detailmode('document');
                this.setState({loading:false})
                $('#document').dataTable().fnDestroy();
                $('#document').DataTable(
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
                          }
                      },
                        "searching": false,
                        "dom": 't<"bottom-datatable" lip>',
                        "ordering": false
                    }
                  );
            }
        });
    }

    componentDidUpdate(){
        if(this.props.customerId){
            this.getCustomerData(this.props.customerId)
        }
    }

    viewDetail = (event) => {
        this.setState({Number: event.currentTarget.id})
        this.setState({modalShow: true})
    }

    onHiden = () =>{
        this.setState({modalShow:false})
    }

    downlaodDocumant = (filepath) => {
        window.open(filepath, '_blank');
    }

    render () {
        let documentData=this.state.documentData;
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
                    <div className="table-responsive credit-history">
                        <table id="document" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('DocumentName')}</th>
                            </tr>
                        </thead>
                        {documentData && !this.state.loading &&(<tbody >
                            {
                                documentData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>
                                            <div id={data.Number} style={{cursor: "pointer", color:'#004388', fontSize:"16px", fontWeight:'bold'}} onClick={()=>this.downlaodDocumant(data.filepath)}>{data.filename}</div>
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
            </div>
        </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Document);
