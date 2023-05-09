'use strict';
;(function($) {
	var host = "116.182.15.136";
	//   var host = "172.19.250.8"; 
	// var host = "192.168.1.5";
	var port = 8765;
	var appToken = "tjlr123qwe!@#";

	var https = false;
	var context = '/api';
	var authBasePath = '/auth';
	var adminBasePath = '/admin/reizApp';
	var toolPath = '/tool/reizApp';
	var question = '/admin/appForExam';
	var debugModel = false;
	var imagePath = 'http://116.182.15.136:9778/images/';
	var appUpdateSoftPath = 'https://ljzhihui.com:6332/download/longjianluqiao2.0app.html';
	var appUpdateSoftPathOff = 'https://ljzhihui.com:6332/downloadOff/longjianluqiao2.0app.html';
	var versionApp = "2";//1-有网版本App；2-离线版本App
	var uRoles = ["QualityPatrol","QualityAmend","QualityReinspect","QualityApproval"];//1-巡检员;2-整改人;3-复验员;4-审批人;
	var uRolesSafe = ["SafePatrol","SafeAmend","SafeReinspect","SafeApproval"];//1-巡检员;2-整改人;3-复验员;4-审批人;
	var roleCodeDicts = 
	{
		"SHIPOPERATOR":"ShippingOperator","RECEOPERATOR":"ReceivingOperator","CARDRIVER":"carDriver","CAROWNER":"carOwner","SUPPLIER":"Supplier","OFFLINE":"offline"
	};//1-发料员;2-收料员;3-司机;4-车队长;5-供应商;6-离线运单使用权限

	var getURL = function(type, path) {
		var urlstr = [];
		if (https) {
			urlstr.push('https://');
		} else {
			urlstr.push('http://');
		}
		urlstr.push(host);
		urlstr.push(':');
		urlstr.push(port);
		urlstr.push(context);
		if (type == "auth") {
			urlstr.push(authBasePath);
		}
		if (type == "admin") {
			urlstr.push(adminBasePath);
		}
		if (type == "question") {
			urlstr.push(question);
		}
		if (type == "tool") {
			urlstr.push(toolPath);
		}
		if (path && (path.indexOf("/") > 0)) {
			urlstr.push('/');
		}

		urlstr.push(path);

		return urlstr.join('');
	}
	var urls = {
		login : {
			getToken : getURL('auth', '/jwt/appToken'),
			getUserInfo : getURL('admin', '/user/loginInfo'),
			getUserInfoMultRole : getURL('admin', '/user/loginInfoMultRole')
		},
		syncDb:{
			querySyncDa : getURL('admin', '/syncDb/querySyncAppData'),
			addOffWaybillList : getURL('admin', '/syncDb/addOffWaybillList')
		},
		attendancePunchFence:{
			attendancePunchFenceList : getURL('admin', 'attendancePunchFence/queryList'),
			judgeCurrPointInPunchFence : getURL('admin', 'attendancePunchFence/judgeCurrPointInFence'),
			//getAttendanceCount : getURL('admin', 'attendance/getWorkerlChartCount'),
		},
		projectList:{
			getprojectList : getURL('admin', '/project/queryProject')
		},
		user : {
			getUsersByRoleCode : getURL('admin', '/user/getUsersByRoleCode'),
			getUsersByRoleCodeAndProject : getURL('admin', '/user/getUsersByRoleCodeAndProject')
		},
		material : {
			count : getURL('admin', '/waybill/waybillCount'),
			countByPtCode : getURL('admin', '/waybill/waybillCountByPtCode'),
			getMaterialList : getURL('admin', '/waybill/getMaterialList'),
			getMotorcadeList : getURL('admin', '/waybill/getMotorcadeList'),
			getList : getURL('admin', 'waybill/pageWaybill'),
			//车辆列表
			getVehicleList: getURL('admin', '/vehicle/getVehicleList'),
			//发料
			queryWaybill : getURL('admin', '/waybill/queryWaybill'),
			addWaybill : getURL('admin', '/waybill/addWaybill'),
			selectWayBillTemplate : getURL('admin', '/waybill/selectWayBillTemplate'),
			saveWayBillTemplate : getURL('admin', '/waybill/saveWayBillTemplate'),
			receiveWaybill : getURL('admin', '/waybill/receiveWaybill'),
			confirmWaybill : getURL('admin', '/waybill/confirmWaybill'),
			driverConfirmWaybill : getURL('admin', '/waybill/driverConfirmWaybill'),
			wayBillDetail : getURL('admin', '/waybill/wayBillDetail'),
			selectWaybillStatus : getURL('admin', '/waybill/selectWaybillStatus'),
			getMaterialLocationList : getURL('admin', '/waybill/getMaterialLocationList'),
			getSubworkList : getURL('admin', '/waybill/getSubworkList'),
		},
		project : {
			querylist : getURL('admin', '/project/queryProject'),
			projectOne : getURL('admin', '/project/queryProjectListByCode'),
			query_project_detail : getURL('admin', '/corporation/getParticipationCorporationList'),
			query : getURL('admin', 'constructionLog/getContructionLogList'),
			saveData : getURL('admin', 'constructionLog/addConstructionLog'),
		},
		worker : {
			querygrxx : getURL('admin', '/projectWorker/pageProjectWorker'),
			pageVehicle: getURL('admin', '/vehicle/pageVehicle'), 
		},
		environment : {
			query : getURL('admin', '/env/getEnvDataList'),
			query_shebei : getURL('admin', '/env/getDeviceList'),
			query_envData : getURL('admin', '/env/getEnvData')
		},
		video : {
			refresh : getURL('/video/refreshVideo.do'),
			getVideo : getURL('admin', '/vision/queryVisionForAPP'),
			playVision : getURL('admin', '/vision/playVision'),
			pushRTMP : getURL('/video/pushRTMP.do'),
			stopPush : getURL('admin', '/vision/stopPush'),
			control : getURL('admin', '/vision/control'),
			screenshot : getURL('admin', '/vision/takePhoto'),
			getxieyi : getURL('/video/xieyiSfty.do'),
			controlxieyi : getURL('/video/xieyiDoTY.do')
		},
		weather : {
			query : getURL('weather/queryWeather.do'),
			queryDayWeather : getURL('admin', 'weather/getWeatherByProjectCode'),
			querySimpleDataNow:getURL('admin', 'weather/getSimpleWeatherNowByProjectCode')
		},
		file : {
			delete_fujian : getURL('tool', 'files/deleteOss'),
			upload_fujian : getURL('tool', 'files/uploadBatchOSS')
		},
		attendance:{
			pageWorkerAttendance : getURL('admin', 'attendance/pageWorkerAttendance'),
			selectAttByIdCard : getURL('admin', 'attendance/selectAttByIdCard'),
			getAttendanceCount : getURL('admin', 'attendance/getWorkerlChartCount'),
			selectCurrAttendance: getURL('admin', 'attendance/selectCurrAttendance'),
			addOneWorkerAttendance: getURL('admin', 'attendance/addOneWorkerAttendance'),
			addBatchWorkerAttendance: getURL('admin', 'attendance/addBatchWorkerAttendance'),
		},
		message : {
			query : getURL('admin', 'messagePush/getPageList')
		},
		safe:{
			queryList : getURL('admin','check/getCheckPageList'),
			addCheck : getURL('admin','check/addCheck'),
			knowledgeList : getURL('admin','safeKnowledge/getSafeKnowledgePageList'),
			submissionList : getURL('admin','safeSubmission/getSafeSubmissionPageList'),
			getSafeAmend : getURL('admin','check/getSafeAmend'),
			getUsersByAccount:getURL('admin','/user/getUsersByAccount'),
			getSafeTrainPageList:getURL('admin','/safeTrain/getSafeTrainPageList'),
			getAmendPageList:getURL('admin','/amend/getAmendPageList'),
			amendSubmit:getURL('admin','/amend/amendSubmit'),
			approve:getURL('admin','/amend/approve'),
			deleteCheck:getURL('admin','/check/deleteCheck'),

			getUsersByProject:getURL('admin','/user/getUsersByProject'),
			reinspect:getURL('admin','/amend/reinspect'),
			reinspect:getURL('admin','/amend/reinspect'),
			viewLog:getURL('admin','/amend/viewLog'),
		},
		//安全考核
		safetyInspect:{
			questionList:getURL('question','/exam/pageExam'),
			queryExamDetails:getURL('question','/exam/queryExamDetails'),
			saveExamRecords:getURL('question','/exam/saveExamRecords'),
		},
		member:{
			queryBridgeComponent:getURL('admin','/bridgeComponent/queryBridgeComponent'),
			queryComponent:getURL('admin','/bridgeComponent/queryComponent'),
			queryComponentById:getURL('admin','/bridgeComponent/queryComponentById'),
		}
	};
	var isdebugModel = function() {
		return debugModel;
	};

	var logininfo = {};

	var getLoginInfo = function(callback) {
		api.getPrefs({
			key : 'loginInfo'
		}, function(ret, err) {
			if (ret.value !== "") {
				if ( typeof (ret.value) == "string") {
					loginInfo = JSON.parse(ret.value);
				} else if ( typeof (ret.value) == "object") {
					loginInfo = ret.value;
				}
				callback(loginInfo);
			}
		});
	};

	var error = {
		errorinfo : {
			"default" : "网络请求异常！",
			"302" : "请求被重定向",
			"404" : "请求地址错误！",
			"400" : "错误的请求！",
			"401" : "访问被拒绝！",
			"403" : "禁止访问！",
			"500" : "服务器内部错误！"
		},
		getErrorMsg : function(error) {
			var msg = this.errorinfo["default"];
			if (!error) {
				return msg;
			}
			var cod = new String(error.code);
			if (cod && cod.length > 1) {
				for (var key in this.errorinfo) {
					if (cod == key) {
						msg = this.errorinfo[key];
					}
				}
				if (msg == this.errorinfo["default"]) {
					msg += "[" + cod + "]";
				}
			} else {
				msg = error.msg;
			}
			return msg;
		}
	};

	var func_url = {
		"func_project" : {
			name : "project",
			url : "../project/project_detail_win.html",
			category : "project"
		},
		"func_worker" : {
			name : "worker",
			url : "../worker/gongrenxx_header.html",
			category : "worker"
		},
		"func_environment" : {
			name : 'environment',
			url : '../environment/dust_search_win.html',
			category : "video"
		},
		"func_video" : {
			name : 'video_monitor',
			url : '../video/video_monitor.html',
			category : "video"
		},
		"func_construction_log" : {
			name : 'gzrz_all',
			url : '../project/gzrz_all.html',
			category : "project"
		}

	}
	var onlyGR = true;

	var getCurrentDate = function() {
		var datetime = new Date();
		var date = datetime.toLocaleDateString().replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
		var chsDate = datetime.toLocaleDateString().replace(/(\d+)\/(\d+)\/(\d+)/, '$3年$1月$2日');
		var chsWeekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][datetime.getDay()];
		var dateObj = {
			datetime : datetime,
			date : date,
			chsDate : chsDate,
			chsWeekDay : chsWeekDay,
		};
		return dateObj;
	};

	var getPictureURL = function(path) {
		var urlstr = [];
		if (https) {
			urlstr.push('https://');
		} else {
			urlstr.push('http://');
		}
		urlstr.push(host);
		urlstr.push(':');
		urlstr.push(port);
		urlstr.push(context);
		urlstr.push('/');
		urlstr.push(path);

		return urlstr.join('');
	}
	// ajax请求
	var ajaxRequest = function (url, method, callback, params/*{ data, dataType, contentType, cache, timeout, returnAll } = {}*/) {
		var userJwtToken = api.getPrefs({
			key : 'userJwtToken',
			sync : true,
		}, function(ret, err) {
			if (ret && ret.value != '') {
				return ret.value;
			} else {
				api.removePrefs({
					key : 'userJwtToken',
				});
				api.removePrefs({
					key : 'userInfo',
				});
				api.sendEvent({
					name : 'reLogin',
				});
				return;
			}
		});
		//alert("post,"+JSON.stringify(userJwtToken));
		var data = params.data;
		var dataType = params.dataType;
		var timeout = params.timeout;
		var cache = params.cache;
		var returnAll = params.returnAll;
		var contentType = params.contentType;
		/*var ajaxConfig = Object.assign({
			url: '',
			method: 'get',
			cache: false,
			timeout: 5,
			dataType: 'json',
			returnAll: false,
			headers: {
			"Authorization": userJwtToken,
			"token": appToken,
			},
			data: {},
			}, { url,
			method, data, dataType,timeout, cache, returnAll
		});*/
		var ajaxConfig ={
				url: '',
				method: 'get',
				cache: false,
				timeout: 5,
				dataType: 'json',
				returnAll: false,
				headers: {
				"Authorization": userJwtToken,
				"token": appToken
			}
		};
		if(url && url != ''){
			ajaxConfig.url = url;
		}
		if(method && method != ''){
			ajaxConfig.method = method;
		}
		if(data && data != ''){
			ajaxConfig.data = data;
		}
		if(cache && cache != ''){
			ajaxConfig.cache = cache;
		}
		if(timeout && timeout != ''){
			ajaxConfig.timeout = timeout;
		}
		if(dataType && dataType != ''){
			ajaxConfig.dataType = dataType;
		}
		if(returnAll && returnAll != ''){
			ajaxConfig.returnAll = returnAll;
		}

		if (contentType && contentType != '') {
			ajaxConfig.headers['Content-Type'] = contentType;
		}
		api.ajax(ajaxConfig, function(ret, err) {
			if (ret) {
				if (ret.status && ret.status == '40301') {
					api.toast({//错误提示信息
						msg : '登录已过期，请重新登录', //错误信息
						duration : 2000, //显示时间长度
						location : 'bottom' //显示位置
					});
					api.removePrefs({
						name : 'userJwtToken',
					});
					api.sendEvent({
						name : 'reLogin',
					});
					return;
				}
			}

			return callback(ret, err);
		})
	}
	var request = {
		post : function(url, data, callback) {
			ajaxRequest(url, 'post', callback, {
			data, contentType: 'application/json;',
			});
		},
		get : function(url, data, callback) {
			ajaxRequest(url, 'get', callback, {
			data, contentType: 'application/json;',
			});
		}
	}

	function parseArguments(url, data, fnSuc, dataType) {
		if ( typeof (data) == 'function') {
			dataType = fnSuc;
			fnSuc = data;
			data = undefined;
		}
		if ( typeof (fnSuc) != 'function') {
			dataType = fnSuc;
			fnSuc = undefined;
		}
		return {
			url : url,
			data : data,
			fnSuc : fnSuc,
			dataType : dataType
		};
	}

	Date.prototype.Format = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"H+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	var handleProjectName = function(element) {
		var ptName = "";
		if(element.projectType == '1'){
			ptName = element.projectName;
		}else if(element.projectType == '2'){
			ptName = element.sectionName;
		}else if(element.projectType == '3'){
			ptName = element.workAreaName;
		}
		return ptName;
	};

	var getNetwork = function (){
		//获取网络情况-如果unknown-未知，ethernet-以太网，wifi-wifi，2g-2G网络，3g-3G网络，4g-4G网络，none-无网络
		return api.connectionType;
	}

	//var connectionStatus=999;//全局中定义变量
	/*{
		status:0 //数字类型；网络状态  //取值如下：
			//-1：未知网络
			//0：没有联网
			//1：蜂窝数据2G/3G/4G
			//2：无线网
	}*/

	//网络连接提示
	var connectionReminder = function (status){
		var statusV = "";
		if(status == "0"){
			statusV = "网络已断开！";//网络连接不可用
		}else if(status == "1" || status == "2"){
			statusV = "网络已连接！";
		}else{
			statusV = "网络未知！";
		}
		return statusV;
	}

	var nativePermission = function(moduleName, znName, cb) {
        let resultList = api.hasPermission({ // 判断是否有权限
            list: [moduleName]
        })
        if (resultList[0].granted) {
			// 已授权，可以继续下一步操作
			cb()
		} else {
			api.confirm({
				msg: znName + '权限未开启，是否开启？',
				buttons: ['取消', '去设置']
			}, function(ret) {
				if (ret.buttonIndex == 2) {
					api.requestPermission({
						list: [moduleName],
					}, function(res) {
						if (res.list[0].granted) {
							// 已授权，可以继续下一步操作
							// api.alert({
							// 	msg: '已授权'
							// });
						}
					});
				}
			});
		}
    }

    //【js  UUID】JS生成UUID 使用
    var crtUUID =function() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; 
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
															
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}

	var reizboj = {
		urls : urls,
		isdebug : isdebugModel,
		loginInfo : logininfo,
		error : error,
		func_url : func_url,
		appToken : appToken,
		getCurrentDate : getCurrentDate,
		request : request,
		imagePath:imagePath,
		handleProjectName: handleProjectName,
		connectionType: getNetwork,
		connectionReminder: connectionReminder,
		appUpdateSoftPath: appUpdateSoftPath,
		appUpdateSoftPathOff: appUpdateSoftPathOff,
		versionApp: versionApp,
		uRoles: uRoles,
		uRolesSafe: uRolesSafe,
		roleCodeDicts: roleCodeDicts,
		nativePermission: nativePermission,
		crtUUID: crtUUID
	};

	window.$reiz = reizboj;
})(window.jQuery || window.Zepto || window.$);
