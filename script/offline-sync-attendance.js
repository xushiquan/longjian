//删除数据
function deleteDbOfflineAttendance(){
    var db = api.require('db');
    dbApi.deleteRdDb(db, dictSyncDa["attendance"].tableName);
    dbApi.selectRdDb(db, dictSyncDa["attendance"].tableName);
}

function createPromise() {
    var promise;
    promise = new Promise(function(resolve, reject) {
        var elapse = Math.random() * 2000;
        setTimeout(resolve, elapse);
    });
    return promise;
}

//同步(bd考勤数据)到云（第一步）
async function syncAttendanceUpDbDataToCloud(){
    var db = api.require('db');
    var records = queryMain.attendanceSyncListDbData(db,"0");
    for(var h=0;h<records.length;h++){
        var recd = records[h];
        await syncAttendanceUpOne(recd,h)
    }

    if(records.length>0){
        api.toast({
            msg: "考勤成功同步云端！+"+records.length,
            duration: 2000,
            location: 'middle',
            global: 'true'
        });
    }
}



//同步(bd考勤数据)到云（第一步）
async function syncAttendanceUpOne(recd,h){
    //img.push("/storage/emulated/0/UZMap/A6172320708974/picture/picture_2023-03-26-23-22-14-774_p.jpg");
    var tok = $api.getStorage('token');
    var image = recd.image;
    var imgs = [];
    imgs = (image).split(",");
    if (imgs.length > 0) {
        await api.ajax({
            url: $reiz.urls['file'].upload_fujian,
            method: 'post',
            tag: h+"",
            async: false,
            headers: {
                "Authorization": tok
            },
            data: {
                values: {
                    masterType: 'bizAttendance'
                },
                files: {
                    file: imgs
                }
            }
        }, function(ret, err) {
            if (ret && ret.code == 200) {
                var retData = ret.data;
                var objData = JSON.parse(retData);
                var fileIdList = [];
                for (var i = 0; i　 < objData.length; i++) {
                    fileIdList.push(objData[i].fileId+"")
                }
                syncAttendanceUpTwo(recd,fileIdList);
            } else {
                alert("附件上传失败");
            }
        });
    }
}

//同步(bd考勤数据)到云（第二步）
async function syncAttendanceUpTwo(recd,fileIdList){
    var db = api.require('db');
    var entity = recd;
    var obj = {
        "account": entity.userCreate,
        "projectCode": entity.projectCode,
        "swipeTime": entity.swipeTime,
        "direction": entity.direction,
        "lng": entity.lng,
        "lat": entity.lat,
        "address": entity.address,
        "fenceName": entity.fenceName,
        "image": entity.image,
        "dbid": entity.dbid,
        "fileIdList": fileIdList
    }

    var params = {}
    var tempList = [];
    tempList.push(obj);
    params["data"] = tempList;
    await $reiz.request.post($reiz.urls['attendance'].addBatchWorkerAttendance, {
        body: params
    }, function(ret, err) {
        if (ret.code == '200'){
            entity.syncStatus = "1";
            entity.syncCreate = new Date().Format("yyyy-MM-dd HH:mm:ss");
            var tempArr = []
            tempArr.push(entity);
            dbApi.insertRdDbBatch(db, dbSql["attendanceISqlBatch"](tempArr));

            var statusNetWork3 = $api.getStorage('connectionStatus');
            if(statusNetWork3 == "1" || statusNetWork3 == "2"){//有网
                //getOnCurrPunchClockData();
            }
        }
    });
}


//离线打卡
function offlineAttendanceSubmit(drct){
    var img = [];
    $('#img_container'+drct).find('img').each(function() {
        if ($(this).attr('isNet') != "true") {
            img.push($(this).attr('src'));
        };
    });

    var statusNetWork2 = $api.getStorage('connectionStatus');
    var scStatus = "0";
    if(statusNetWork2 == "1" || statusNetWork2 == "2"){
        scStatus = "1";
    }else{
        if(img.length == 0){
            alert("请上传图片！");
            return false;
        }
    }
    
    var imgStr = "";
    if(img.length > 0){
        imgStr = img.toString()
    }
    var timeV = $("#swipeTime").val()+" "+ currTimeV;
    var objAtt = {
        "account": account,
        "idCardNumber": idCardNumber,
        "projectCode": projectCode,
        "direction": drct,
        "idCardType":"01",
        "attendType":"001",
        "lng":"0.0",
        "lat":"0.0",
        "swipeTime": timeV,
        "gmtCreate": timeV,
        "syncCreate":"",
        "syncStatus": scStatus,
        "lngLatO2":"",
        "address": "",
        "image": imgStr,
        "userCreate": account,
        "fenceName": currFenceName
    }
    
    var list = []
    var uid = $reiz.crtUUID();
    objAtt.dbid = uid;
    list.push(objAtt);
    var ret = dbApi.insertRdDbBatch(db, dbSql["attendanceISqlBatch"](list));

    if(ret.status = true){
        if(statusNetWork2 == "1" || statusNetWork2 == "2"){
            onlineAttendanceSubmit(drct,uid);
        }else{
            queryOffDbPunchClockData();
        }
    }
}

//加载本地db考勤数据
function queryOffDbPunchClockData(){
    $("#swipeTime").val(new Date().Format("yyyy-MM-dd"));
    var sTime = $("#swipeTime").val();

    if(currDayTime==sTime){
        loadIntervalCurrTime();
        load10IntervalPosition();
    }else{
        cancleClockTimer();
    }

    punchClockData = {};
    var attdRecords = queryMain.attendanceQuListDbData(db,sTime,projectCode,account,"");
    var directionArr = ["01","02"]
    for(var i=0;i<attdRecords.length;i++){
        var dir = attdRecords[i].direction;
        for(var j=0;j<directionArr.length;j++){
            if( dir == directionArr[j]){
                punchClockData[dir] = attdRecords[i];
            }
        }
    }

    if(punchClockData.hasOwnProperty("01")){//上班
        var currData = punchClockData["01"]
        var swipeTime = currData.swipeTime.substr(10, currData.swipeTime.length);
        $("#onWorkTime").show();
        $("#onWorkTime").attr("statusC","1");
        $("#onWorkTime").css("font-size","20px;");
        $("#onWorkTime").html("已打卡&nbsp"+ swipeTime);
        $("#onWorkClockBtn").hide();
        $("#onWorkTips").html(currData.fenceName);
        $(".content-on-work").css("text-align","left");
        $("#onTakepicDi").hide();
        
        addOffSetPic(currData);

        $("#offWorkTime").attr("statusC","0");
    }else{
        if(currDayTime==sTime){
            $(".content-on-work").css("text-align","center");
            $("#onWorkTime").attr("statusC","0");
            $("#onWorkTime").show();
            $("#onWorkClockBtn").show();
            $("#onWorkClockBtn").removeClass("disabled");
            $("#onWorkTips").html("离线打卡");
            $("#onTakepicDi").show();

            $("#offWorkTime").attr("statusC","-1")
        }else{
            $(".content-on-work").css("text-align","left");
            $("#onWorkTime").attr("statusC","-1");
            $("#onWorkTime").hide();
            $("#onWorkClockBtn").hide();
            $("#onWorkTips").html("当日未打卡");
        }
    }

    if(punchClockData.hasOwnProperty("02")){//下班
        var currData = punchClockData["02"]
        var swipeTime = currData.swipeTime.substr(10, currData.swipeTime.length);
        $("#offWorkTime").attr("statusC","1");
        $("#offWorkTime").css("font-size","20px;");
        $("#offWorkTime").html("已打卡&nbsp"+ swipeTime);
        $("#offWorkTime").show();
        $("#offWorkClockBtn").hide();
        $("#offWorkTips").html(currData.fenceName);
        $(".content-off-work").css("text-align","left");
        $("#offTakepicDi").hide();
        addOffSetPic(currData);

        cancleClockTimer();
        //loadNetworkTimer();
    }else{
        if(currDayTime==sTime){
            $(".content-off-work").css("text-align","center");
            if($("#offWorkTime").attr("statusC") == "0"){
                $("#offWorkTime").show();
                $("#offWorkClockBtn").show();
                $("#offWorkClockBtn").removeClass("disabled");
                $("#offWorkTips").html("离线打卡");
                $("#offTakepicDi").show();
            }else{
                $("#offWorkTime").hide();
                $("#offWorkClockBtn").hide();
                $("#offWorkTips").html("未开始");
            }
        }else{
            $(".content-off-work").css("text-align","left");
            $("#offWorkTime").attr("statusC","-1");
            $("#offWorkTime").hide();
            $("#offWorkClockBtn").hide();
            $("#offWorkTips").html("当日未打卡");
        }
    }
}

//添加图片
function addOffSetPic(currData){
    if(currData.image){
        var Img1 = [];
        var Img = (currData.image).split(",");
        for(var m=0;m<Img.length;m++){
            var obj = {"id":m,"path":Img[m]}
            Img1.push(obj);
        }
        setPicNet(Img1,'img_container'+currData.direction);
    }
}

//判断是否进入范围(Db库)
function loadJudgeClockScopeDbBakCopy(){
    judgeBoo = false;
    var fenceCount = 0;
    var fenceName = "";
    currFenceName = fenceName;

    if($("#onWorkTime").attr("statusC") == "0"){
        if(fenceCount < 1){
            $("#onWorkTips").html("");
        }else{
            if(judgeBoo){
                $("#onWorkClockBtn").removeClass("disabled");
                $("#onWorkTips").html("已进入打卡范围："+fenceName);
            }else{
                $("#onWorkClockBtn").addClass("disabled");
                $("#onWorkTips").html("未进入打卡范围");
            }
        }
        
    }else if($("#onWorkTime").attr("statusC") == "-1"){
        $("#onWorkTime").hide();
        $("#onWorkClockBtn").addClass("disabled");
    }else if($("#onWorkTime").attr("statusC") == "1"){
        $("#offWorkTips").html("未进入打卡范围");
    }

    if($("#offWorkTime").attr("statusC") == "0"){
        if(fenceCount < 1){
            $("#offWorkTips").html("");
        }else{
            if(judgeBoo){
                $("#offWorkClockBtn").removeClass("disabled");
                $("#offWorkTips").html("已进入打卡范围："+fenceName);
            }else{
                $("#offWorkClockBtn").addClass("disabled");
                $("#offWorkTips").html("未进入打卡范围");
            }
        }
    }else if($("#offWorkTime").attr("statusC") == "-1"){
        $("#offWorkTime").hide();
        $("#offWorkClockBtn").addClass("disabled");
    }
}

//同步(bd考勤数据)到云
function syncAttendanceUpDbDataToCloudCopy(){
    var db = api.require('db');
    var records = queryMain.attendanceSyncListDbData(db,"0");
    
    var params = {}
    var tempList = [];
    for(var i=0;i<records.length;i++){
        var entity = records[i];
        var obj = {
            "account": entity.userCreate,
            "projectCode": entity.projectCode,
            "swipeTime": entity.swipeTime,
            "direction": entity.direction,
            "lng": entity.lng,
            "lat": entity.lat,
            "address": entity.address,
            "fenceName": entity.fenceName,
            "image": entity.image,
            "dbid": entity.dbid,
        }
        tempList.push(obj);
    }
    params["data"] = tempList;

    $reiz.request.post($reiz.urls['attendance'].addBatchWorkerAttendance, {
        body: params
    }, function(ret, err) {
        if (ret.code == '200'){
            for(var k=0;k<records.length;k++){
                records[k].syncStatus = "1";
                records[k].syncCreate = new Date().Format("yyyy-MM-dd HH:mm:ss");
            }

            dbApi.insertRdDbBatch(db, dbSql["attendanceISqlBatch"](records));

            var statusNetWork2 = $api.getStorage('connectionStatus');
            if(statusNetWork2 == "1" || statusNetWork2 == "2"){
            }

            api.toast({
                msg: "考勤成功同步云端！",
                duration: 2000,
                location: 'middle',
                global: 'true'
            });
        }
    });
}











