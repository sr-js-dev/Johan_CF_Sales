import React, {Component} from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Adduserform from './adduserform';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { getUserToken } from '../../components/auth';
import { trls } from '../../components/translate';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import Filtercomponent from '../../components/filtercomponent';
import * as Common from '../../components/common';
// import {ArcGauge} from '@progress/kendo-react-gauges';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
	blankdispatch: () =>
	dispatch(authAction.blankdispatch()),
});

class Userregister extends Component {
	_isMounted = false
	constructor(props) {
		super(props);
		this.state = {  
			userData:[],
			flag:'',
			userUpdateData:[],
			loading:true,
			originFilterData: [],
            filterFlag: false,
            filterData: [],
		};
	}

	componentDidMount() {
		this._isMounted = true;
		this.getUserData();
		this.setFilterData();
	}

	getUserData (data) {
		this._isMounted = true;
		this.setState({loading:true})
		var headers = SessionManager.shared().getAuthorizationHeader();
		Axios.get(API.GetUserData, headers)
		.then(result => {
			if(this._isMounted){
				if(!data){
                    this.setState({userData: result.data, originFilterData: result.data});
                }else{
                    this.setState({userData: data});
                }
				this.setState({loading:false})
				$('.fitler').on( 'keyup', function () {
					table.search( this.value ).draw();
				} );
				$('#example').dataTable().fnDestroy();
				var table = $('#example').DataTable(
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
					"dom": 't<"bottom-datatable" lip>',
					"ordering": false
				}
				);
			}
		});
	}
	// filter module
	setFilterData = () => {
		let filterData = [
			{"label": trls('UserName'), "value": "UserName", "type": 'text'},
			{"label": trls('Email'), "value": "Email", "type": 'text'}
		]
		this.setState({filterData: filterData});
	}

	filterOptionData = (filterOption) =>{
		let dataA = []
		dataA = Common.filterData(filterOption, this.state.originFilterData);
		if(!filterOption.length){
			dataA=null;
		}
		$('#example').dataTable().fnDestroy();
		this.getUserData(dataA);
	}

	changeFilter = () => {
		if(this.state.filterFlag){
			this.setState({filterFlag: false})
		}else{
			this.setState({filterFlag: true})
		}
	}
	// filter module
	userUpdate = (id) => {
		var settings = {
			"url": API.GetUserDataById+id,
			"method": "GET",
			"headers": {
				"Content-Type": "application/json",
				"Authorization": "Bearer "+getUserToken(),
			}
		}
		$.ajax(settings).done(function (response) {
		})
		.then(response => {
			this.setState({userUpdateData: response})
			this.setState({modalShow:true, mode:"update", updateflag: true, userID: id, flag:true})
		});
	}
	viewUserData = (id) => {
		this._isMounted = true;
		var headers = SessionManager.shared().getAuthorizationHeader();
		Axios.get(API.GetUserDataById+id, headers)
		.then(result => {
			if(this._isMounted){
				this.setState({userUpdateData: result.data})
				this.setState({modalShow:true, mode:"view", flag:true})
			}
		});
	}
	userDelete = () => {
		var headers = SessionManager.shared().getAuthorizationHeader();
		Axios.delete(API.DeleteUserData+this.state.userId, headers)
		.then(result => {
			this.setState({loading:true})
			this.getUserData();               
		});
	}

	removeDetail = () => {
		this.setState({updateflag: false})
	}
	userDeleteConfirm = (id) => {
		this.setState({userId: id})
		confirmAlert({
			title: 'Confirm',
			message: 'Are you sure to do this.',
			buttons: [
			{
				label: 'Delete',
				onClick: () => {
					this.userDelete()
				}
			},
			{
				label: 'Cancel',
				onClick: () => {}
			}
			]
		});
	}
	onAddformHide = () => {
		this.setState({modalShow: false})
		this.props.blankdispatch()
	}
	render () {
		let userData=this.state.userData;
		let optionarray = [];
		if(userData){
			userData.map((data, index) => {
				if(data.IsActive){
					optionarray.push(data);
				}
				return userData;
			})
		}
		return (
			<div className="order_div">
				<div className="content__header content__header--with-line">
					<h2 className="title">{trls('User')}</h2>
				</div>
				<div className="orders">
					<Row>
						<Col sm={6}>
							<Button variant="primary" onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}><i className="fas fa-plus add-icon"></i>{trls('Add_User')}</Button> 
						</Col>
						<Col sm={6} className="has-search">
							<div style={{display: 'flex', float: 'right'}}>
								<Button variant="light" onClick={()=>this.changeFilter()}><i className="fas fa-filter add-icon"></i>{trls('Filter')}</Button>   
								<div style={{marginLeft: 20}}>
									<span className="fa fa-search form-control-feedback"></span>
									<Form.Control className="form-control fitler" type="text" name="number"placeholder={trls("Quick_search")}/>
								</div>
							</div>
						</Col>
						{this.state.filterData.length>0&&(
							<Filtercomponent
								onHide={()=>this.setState({filterFlag: false})}
								filterData={this.state.filterData}
								onFilterData={(filterOption)=>this.filterOptionData(filterOption)}
								showFlag={this.state.filterFlag}
							/>
						)}
					</Row>
					<div className="table-responsive">
						<table id="example" className="place-and-orders__table table" width="100%">
							<thead>
								<tr>
								<th>{trls('UserName')}</th>
								<th>{trls('Email')}</th>
								<th>{trls('Active')}</th>
								<th>{trls('Action')}</th>
							</tr>
							</thead>
							{optionarray && !this.state.loading &&(<tbody >
								{
								optionarray.map((data,i) =>(
									<tr id={i} key={i}>
										<td>{data.UserName}</td>
										<td>{data.Email}</td>
										<td>
											{data.IsActive ? (
                                                <i className ="fas fa-check-circle active-icon"></i>
                                            ):
                                                <i className ="fas fa-check-circle inactive-icon"></i>
                                            }
										</td>
										<td style={{width: 300}}>
											<Row style={{justifyContent:"space-around"}}>
												<i className="fas fa-trash-alt add-icon" onClick={()=>this.userDeleteConfirm(data.Id)}><span className="action-title">{trls('Delete')}</span></i>
												<i className="fas fa-pen add-icon" onClick={()=>this.userUpdate(data.Id)}><span className="action-title">{trls('Edit')}</span></i>
												<i className="fas fa-eye add-icon" onClick={()=>this.viewUserData(data.Id)}><span className="action-title">{trls('View')}</span></i>
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
					<Adduserform
						show={this.state.modalShow}
						mode={this.state.mode}
						onHide={() => this.onAddformHide()}
						onGetUser={() => this.getUserData()}
						userUpdateData={this.state.userUpdateData}
						userID={this.state.userID}
						updateflag={this.state.updateflag}
						removeDetail={this.removeDetail}
					/>  
				</div>
			)
		};
	}
export default connect(mapStateToProps, mapDispatchToProps)(Userregister);
