
//1同步-下载云数据-基础信息数据
function syncCloudBasicsAllData(flag){//true-刷新页面；false-不刷新页面
    var status = $api.getStorage('connectionStatus');
    if(status == "-1" || status == "0"){
        api.toast({
            msg: $reiz.connectionReminder(status)+'请稍后重试！',
            duration: 2000,
            location: 'bottom'
        });
        return;
    }

    var loginInfo = $api.getStorage('loginInfo');
    if(!loginInfo){
        return ;
    }

    if(flag){
        api.showProgress({
            title: '加载中...',
            modal: false
        });
    }
    
    var account = loginInfo.account;
    $reiz.request.post($reiz.urls['syncDb'].querySyncDa, {
        body: {
            'account': account
        }
    }, function(ret, error) {
        api.hideProgress();
        if (ret.code == 200) {
            var data = JSON.parse(ret.data);
            var db = api.require('db');
            for (let key in data) {
                //console.log("属性，"+key+","+ JSON.stringify(data[key].length))
                if(key != "waybill" && key != "attendance"){
                    dbApi.insertRdDbBatch(db, dbSql[key+"ISqlBatch"](data[key]));
                }
            }

            if(flag){
                window.location.reload();//刷新页面
                api.toast({
                    msg: '手动同步下载云数据完成！',
                    duration: 2000,
                    location: 'bottom'
                });
            }else{
                api.toast({
                    msg: '自动同步下载云数据完成!',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        } else {
            if(error){
                alert(error.msg)//("暂无同步数据")
            }
        }
    })
}

//2同步-上传db库运单数据到云库
function syncUploadDbDataToCloud(flag){//true-刷新页面；false-不刷新页面
    var status = $api.getStorage('connectionStatus');
    if(status == "-1" || status == "0"){
        api.toast({
            msg: $reiz.connectionReminder(status)+'请稍后重试！',//'同步上传数据失败!',
            duration: 2000,
            location: 'bottom'
        });
        return;
    }

    var loginInfo = $api.getStorage('loginInfo');
    if(!loginInfo){
        return ;
    }

    if(flag){
        api.showProgress({
            title: '加载中...',
            modal: false
        });
    }
    
    var account = loginInfo.account;
    var orgId = loginInfo.orgId;
    var projectId = loginInfo.projects.id;
    var db = api.require('db');

    var status = "0";//0-未收车，1-已收车
    var syncStatus = "0";//syncStatus(0-未同步，1-已同步)
    var waybillDbDatas = queryMain.waybillByStatusDbData(db,status,syncStatus);//未收车,未同步
    var alreadyWaybillDbDatas = queryMain.waybillByStatusDbData(db,status,"1");//未收车,已同步

    /*if(waybillDbDatas.length ==0){
        api.hideProgress();
        api.toast({
            msg: '已全部上传！',
            duration: 2000,
            location: 'bottom'
        });
        return;
    }*/

    $reiz.request.post($reiz.urls['syncDb'].addOffWaybillList, {
        body: {
            offWaybill:waybillDbDatas
        }
    }, function (ret, err) {
        if(ret.code == 200){
            var reSyncData = JSON.parse(ret.data);
            api.hideProgress();
            for(var i=0;i<waybillDbDatas.length;i++){
                var waybill = waybillDbDatas[i];
                waybill.deliverytime = waybill.deliveryTime;
                waybill.receipttime = waybill.receiptTime;
                waybill.syncStatus = "1";
                waybill.syncCreate = new Date().Format("yyyy-MM-dd HH:mm:ss");
            }
            if(waybillDbDatas.length>0){
                var ret = dbApi.insertRdDbBatch(db, dbSql.waybillISqlBatch(waybillDbDatas));
            }
            
            for(var k=0;k<alreadyWaybillDbDatas.length;k++){
                var entity = alreadyWaybillDbDatas[k];
                for(var j=0;j<reSyncData.length;j++){
                    var reD = reSyncData[j];
                    var id = reD.dbid+"";
                    //if(id==entity.dbid && reD.carNo==entity.carNo && reD.projectCode==entity.projectCode ){waybillNo
                    if(reD.carNo==entity.carNo && reD.waybillNo==entity.waybillNo ){
                        if(reD.receiptTime){
                            entity.receipttime = new Date(reD.receiptTime).Format("yyyy-MM-dd HH:mm:ss");
                        }
                        if(reD.receiptRemark){
                            entity.receiptRemark = reD.receiptRemark;
                        }
                        if(reD.receiving){
                            entity.receiving = reD.receiving;
                        }
                        if(reD.consignorId){
                            entity.consignorId = reD.consignorId;
                        }
                        if(reD.consigneeId){
                            entity.consigneeId = reD.consigneeId;
                        }
                        if(reD.receivingStakeNum){
                            entity.receivingStakeNum = reD.receivingStakeNum;
                        }
                        if(reD.receivingStakeNumMeter){
                            entity.receivingStakeNumMeter = reD.receivingStakeNumMeter;
                        }
                        if(reD.adjustRemark){
                            entity.adjustRemark = reD.adjustRemark;
                        }
                        if(reD.adjustQuantity){
                            entity.adjustQuantity = reD.adjustQuantity;
                        }
                        if(reD.adjustDistance){
                            entity.adjustDistance = reD.adjustDistance;
                        }
                        if(reD.distanceHaul){
                            entity.distanceHaul = reD.distanceHaul;
                        }
                        if(reD.subWork){
                            entity.subWork = reD.subWork;
                        }
                        entity.status = "1";
                    }
                }
                entity.deliverytime = entity.deliveryTime;
            }
            if(alreadyWaybillDbDatas.length>0){
                var ret2 = dbApi.insertRdDbBatch(db, dbSql.waybillISqlBatch(alreadyWaybillDbDatas));
                if(ret2.status){
                    //window.location.reload();//刷新页面
                    api.toast({
                        msg: "成功同步云端！",
                        duration: 2000,
                        location: 'middle',
                        global: 'true'
                    });
                    api.execScript({
						name: 'off_material_list_win',
						frameName: 'off_material_list_frame',
						script:  'loadWaybillDbDatalist("1")'
					});
                    $("#unreceived").removeClass("aui-active");
				    $("#received").addClass("aui-active");
                }else{
                    api.toast({
                        msg: "同步云端失败1！",
                        duration: 2000,
                        location: 'middle',
                        global: 'true'
                    }); 
                }
            }else{
                api.hideProgress();
                    api.toast({
                        msg: '已全部同步！',
                        duration: 2000,
                        location: 'bottom'
                }); 
            }
        }else{
            api.hideProgress();
            api.toast({
                msg: "同步云端失败2！",
                duration: 2000,
                location: 'middle'
            });    
        }
    });
}