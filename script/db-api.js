
(function(window){
    var dataBaseName = "platform-admin";
    var dbRootPath = 'fs://db/platform-admin';
    var dbRootPathFile = dbRootPath+'/'+dataBaseName+'.db';//'fs://db/platform-admin/platform-admin.db'

    
    // apiready = function() {
    //     //var db2 = api.require('db');
    // };

    //0-1-createDir创建库路径
    var createDir = function(fs){
        fs.readDir({
            path: dbRootPath
        }, function(ret, err) {
            if(ret.status) {
                //alertDialog("readDir",ret);
            }else {
                fs.createDir({
                    path: dbRootPath
                }, function(ret, err) {
                    if (ret.status) {
                        //alertDialog("createDir",ret);
                    } else {
                        //alertDialog("createDirerror",err);
                    }
                });
            }
        });
    }

    var subfile = function(db){
        db.subfile({
        	directory: dbRootPathFile//'fs://db/platform.db'
        }, function(ret, err) {
        	if (ret.status) {
        		//alert(JSON.stringify(ret));
        	} else {
        		//alert(JSON.stringify(err));
        	}
        });
    }

    //1-关闭数据库
    var closeDatabase = function(db){
        //alert("close,"+"0000");
        db.closeDatabase({
            name: dataBaseName
        }, function(ret, err) {
            if (ret.status) {
                //alert("close1,"+JSON.stringify(ret));
            } else {
                //alert("closeerr,"+JSON.stringify(err));
            }
        });
        $api.rmStorage('databaseStatus');
    }

    //2-打开数据库
    var openDatabase = function(db){
        db.openDatabase({
            name: dataBaseName,
            path: dbRootPathFile
        }, function(ret, err) {
            if (ret.status) {
                //alertDialog("open1",ret);
            } else {
                //alertDialog("openerr",err);
            }
        });
        $api.setStorage('databaseStatus',"open");
    }

    //2-1-打开数据库
    var openDatabaseSync = function(db){
        var ret = db.openDatabaseSync({
            name: dataBaseName,
            path: dbRootPathFile
        });
        if (ret.status) {
            //alertDialog("open1",ret);
        } else {
            //alertDialog("openerr",err);
        }
        $api.setStorage('databaseStatus',"open");
    }

    //3-查询库列表
    var queryTables = function(db){
        var ret = db.selectSqlSync({
            name: dataBaseName,
            sql: 'SELECT `name` FROM sqlite_master WHERE type="table"'
        });
        var tabs = ret.data;
        var tabsList = [];
        for(var i=0; i<tabs.length;i++){
            //alert("ret -> " + tabs[i].name);
            tabsList.push(tabs[i].name);
        }
        //alert("ret -> " + JSON.stringify(tabsList));
        return tabsList;
    }

    //4-查询表是否存在
    var tableExist= function(db,tableName){
        var tabList = queryTables(db)
        var reIndex= $.inArray(tableName, tabList);
        return reIndex;
    }

    //5-创建表
    var newTable = function(db,tableName,sql){
        var reIndex= tableExist(db,tableName);
        if(reIndex > -1){
            //alertDialog("表已存在","");
        }else{
            db.executeSql({
                name: dataBaseName,
                sql: sql
            }, function(ret, err) {
                if (ret.status) {
                    //alertDialog("newtable",ret);
                } else {
                    //alertDialog("newtableerr",err);
                }
            });
        }
    }

    //5-1-创建表
    var newTableSync = function(db,tableName,sql){
        var cTableNum = 0;
        var reIndex= tableExist(db,tableName);
        if(reIndex > -1){
            //alertDialog("表已存在","");
        }else{
            var ret = db.executeSqlSync({
                name: dataBaseName,
                sql: sql
            });
            if (ret.status) {
                cTableNum++;
                //alertDialog("newtable",ret);
            } else {
                //alertDialog("newtableerr",err);
            }
        }
        return cTableNum;
    }

    //6-删除表
    var dropTable = function(db,tableName){
        var tabList = dbApi.queryTables(db)
        var reIndex= $.inArray(tableName, tabList);
        if(reIndex > -1){
            db.executeSql({
                name: dataBaseName,
                sql: 
                'DROP TABLE '+ tableName
            }, function(ret, err) {
                if (ret.status) {
                    //alertDialog("drop",ret);
                } else {
                    alertDialog("droperr",err);
                }
            });
        }else{
            alertDialog("表不存在","");
        }
    }

    //7-插入数据-单条
    var insertRdDb = function(db,sql){
        db.executeSql({
            name: dataBaseName,
            sql: sql   
        }, function(ret, err){        
            if( ret.status ){
                alertDialog("insert",ret);
            }else{
                var errorMsg = err.msg;
                //alert( '插入error'+errorMsg);
                if(errorMsg.indexOf("CONSTRAINT_PRIMARYKEY") >-1){//unique
                    //updateRdDb(db,tableName)
                }
            }
        });
    }

    //7-1-插入数据-批量batch
    var insertRdDbBatch = function(db,sql){
        var ret1 = db.transactionSync({
            name: dataBaseName,
            operation: 'begin'
        });
        var ret2 = db.executeSqlSync({
            name: dataBaseName,
            sql: sql   
        });
        //alertDialog("insertBatch ",ret2);
        var ret3 = db.transactionSync({
            name: dataBaseName,
            operation: 'commit'
        });
        return ret2;
    }

    //8-修改数据
    var updateRdDb = function(db,sql){
        //'UPDATE runoob_tbl SET Id_P= 1, LastName = "jack666", FirstName = "rosr666" WHERE runoob_id=3' 
        db.executeSql({
            name: dataBaseName,
            sql: sql 
        }, function(ret, err){        
            if( ret.status ){
                //alertDialog("update",ret);
            }else{
                //alertDialog("updateerror",ret);
            }
        });
    }
    
    //9-删除表数据
    var deleteRdDb = function(db,tableName){
        db.executeSql({
            name: dataBaseName,
            sql: 'DELETE FROM '+ tableName 
        }, function(ret, err){        
            if( ret.status ){
                //alertDialog("delete",ret);
            }else{
                //alertDialog("deleteerr",err);
            }
        });
    }

    //10-查询表数据
    var selectRdDb = function(db,tableName){
        var ret = db.selectSqlSync({
            name: dataBaseName,
            sql: 'SELECT * FROM '+ tableName 
        });
        if(ret.status){
            alertDialog("select",ret.data);//.length
        }else{
            alertDialog("selecterr",ret.msg);
        }
    }

    //10-1-查询表数据
    var querySqlDb = function(db,sql){
        var ret = db.selectSqlSync({
            name: dataBaseName,
            sql: sql 
        });
        if( ret.status ){
            //alertDialog("querySql",ret.data);
            return ret.data;
        }else{
            alertDialog("querySqlerr",ret.msg);
            return [];
        }
    }


    //11-开启事务-异步
    var beginTransaction = function(db){
        db.transaction({
            name: dataBaseName,
            operation: 'begin'
        }, function(ret, err) {
            if (ret.status) {
                //alertDialog("开启事务",ret);
            } else {
                //alert(JSON.stringify(err));
            }
        });
    }

     //12-提交事务-异步
     var commitTransaction = function(db){
        db.transaction({
            name: dataBaseName,
            operation: 'commit'
        }, function(ret, err) {
            if (ret.status) {
                //alertDialog("提交事务",ret);
            } else {
                //alert(JSON.stringify(err));
            }
        });
    }

    //21-alert弹窗
    var alertDialog = function(msg,ret){
        alert(msg + ",  " +JSON.stringify(ret));
    }

    //22-toast全局弹窗
    var toastDialog = function(msg){
        api.toast( {
            msg: msg,
            duration: 1000,
            location: 'bottom',
            global: 'true'
        } );
    } 

    
    //1111-dict-sql-------------------------------------
    var userCSql=
        'CREATE TABLE `sys_user` (' +
        '    `id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '    `account` varchar(255) DEFAULT NULL,' +
        '    `name` varchar(255) DEFAULT NULL,' +
        '    `id_card` varchar(20) DEFAULT NULL,' +
        '    `phone` varchar(255) DEFAULT NULL,'+
        '    `org_id` bigint(20) DEFAULT NULL,' +
        '    `status` tinyint(4) DEFAULT "1",' +
        '    `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP' +
        ') ';
    var roleCSql = 
        'CREATE TABLE `sys_role` (' +
        '    `id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '    `code` varchar(32) DEFAULT NULL,' +
        '    `name` varchar(32) DEFAULT NULL,' +
        '    `type` varchar(20) DEFAULT NULL,' +
        '    `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP' +
        ') ';
    var userRoleCSql = 
        'CREATE TABLE `sys_user_role` (' +
        '    `id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '    `user_id` bigint(20) DEFAULT NULL,' +
        '    `role_id` bigint(20) DEFAULT NULL,' +
        '    `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP' +
        ') ';

    var orgCSql=
        'CREATE TABLE `sys_org` (' +
        '  `id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '  `num` int(11) DEFAULT "1",' +
        '  `org_type` varchar(2) DEFAULT NULL,' +
        '  `pid` bigint(20) DEFAULT NULL,' +
        '  `pids` varchar(1000) DEFAULT NULL,' +
        '  `simple_name` varchar(255) DEFAULT NULL,' +
        '  `project_id` bigint(20) DEFAULT NULL ,' +
        '  `is_delete` tinyint(4) DEFAULT "0",' +
        '  `gmt_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP' +
        ')';

    var projectCSql=
        'CREATE TABLE `biz_project` (' +
        '  `id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '  `project_code` varchar(12)  NOT NULL,' +
        '  `project_name` varchar(255) DEFAULT NULL,' +
        '  `num` int(11) DEFAULT "1",' +
        '  `pid` bigint(20) DEFAULT NULL,' +
        '  `pids` varchar(1000) DEFAULT NULL,' +
        '  `org_id` bigint(20) DEFAULT NULL ,' +
        '  `is_delete` tinyint(4) DEFAULT "0",' +
        '  `gmt_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  `gmt_modify` timestamp NULL DEFAULT NULL,' +
        '  `user_create` varchar(25) DEFAULT NULL,' +
        '  `user_modify` varchar(25) DEFAULT NULL,' +
        '  `project_type` varchar(20) DEFAULT NULL,' +
        '  `data_type` varchar(25) DEFAULT NULL' +
        //'  KEY `index_pro_projectCode` (`project_code`) USING BTREE' +
        ')';

    var motorcadeCSql= 
        'CREATE TABLE `biz_motorcade` (' +
        '   `id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '   `project_code` varchar(12) DEFAULT NULL,' +
        '   `vehicle_owner` varchar(11) DEFAULT NULL,' +
        '   `motorcade_name` varchar(25) DEFAULT NULL,' +
        '   `short_name` varchar(10) DEFAULT NULL,' +
        '   `gmt_create` timestamp NULL DEFAULT NULL,' +
        '   `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP,' +
        '   `gmt_modify` timestamp NULL DEFAULT NULL' +
        ')';

    var materialCSql=
        'CREATE TABLE `biz_material` (' +
        '   `id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '   `project_code` varchar(12) DEFAULT NULL,' +
        '   `name` varchar(20) DEFAULT NULL,' +
        '   `material_no` varchar(20) NOT NULL,' +
        '   `current_count` double(10,2) DEFAULT NULL,' +
        '   `material_type` varchar(10) DEFAULT NULL,' +
        '   `material_standard` varchar(10) DEFAULT NULL,' +
        '   `supplier` varchar(255) DEFAULT NULL,' +
        '   `gmt_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP,' +
        '   `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP,' +
        '   `gmt_modify` timestamp NULL DEFAULT NULL' +
        ')';

    var vehicleCSql=
        'CREATE TABLE `biz_vehicle` (' +
        '    `id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '    `project_code` varchar(12) NOT NULL,' +
        '    `car_no` varchar(20) NOT NULL,' +
        '    `driver_id` varchar(20) DEFAULT NULL,' +
        '    `driver_mobile` varchar(11) DEFAULT NULL,' +
        '    `car_type` varchar(2) DEFAULT NULL,' +
        '    `trade_type` char(1) DEFAULT NULL,' +
        '    `car_length` double(10,2) DEFAULT NULL,' +
        '    `car_width` double(10,2) DEFAULT NULL,' +
        '    `car_height` double(10,2) DEFAULT NULL,' +
        '    `add_height` double(10,2) DEFAULT NULL,' +
        '    `standard_volume` double(10,2) DEFAULT NULL,' +
        '    `motorcade_id` int(11) DEFAULT NULL,' +
        '    `gmt_create` timestamp NULL DEFAULT NULL,' +
        '    `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP,' +
        '    `gmt_modify` timestamp NULL DEFAULT NULL' +
        ')';

    var waybillCSql=
        'CREATE TABLE `biz_waybill` ('+
        '  `dbid` INTEGER PRIMARY KEY AUTOINCREMENT,'+
        '  `waybill_no` varchar(32) DEFAULT NULL,'+
        '  `car_no` varchar(32) DEFAULT NULL,'+
        '  `driver_id` varchar(21) DEFAULT NULL,'+
        '  `project_code` varchar(20) DEFAULT NULL,'+
        '  `material_no` varchar(32) DEFAULT NULL,'+
        '  `origin` varchar(255) DEFAULT NULL,'+
        '  `origin_stake_num` double(20,2) DEFAULT NULL,'+
        '  `origin_stake_num_meter` double(20,2) DEFAULT NULL,'+
        '  `load_stake_num` double(20,2) DEFAULT NULL,'+
        '  `load_stake_num_meter` double(255,2) DEFAULT NULL,'+
        '  `receiving` varchar(255) DEFAULT NULL,'+
        '  `receiving_stake_num` double(20,4) DEFAULT NULL,'+
        '  `receiving_stake_num_meter` double(20,4) DEFAULT NULL,'+
        '  `distance` double(255,4) DEFAULT NULL,'+
        '  `adjust_distance` varchar(255) DEFAULT NULL,'+
        '  `adjust_remark` varchar(255) DEFAULT NULL,'+
        '  `quantity` varchar(255) DEFAULT NULL,'+
        '  `adjust_quantity` double DEFAULT NULL,'+
        '  `consignor_id` varchar(32) DEFAULT NULL,'+
        '  `consignee_id` varchar(32) DEFAULT NULL,'+
        '  `status` varchar(2) DEFAULT NULL,'+
        '  `deliveryTime` datetime DEFAULT NULL,'+
        '  `receiptTime` datetime DEFAULT NULL,'+
        '  `deliveryRemark` varchar(255) DEFAULT NULL,'+
        '  `receiptRemark` varchar(255) DEFAULT NULL,'+
        '  `gmt_create` timestamp NULL DEFAULT NULL,'+
        '  `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP,'+
        '  `sync_status` varchar(2) DEFAULT "0",'+
        '  `gmt_modify` timestamp NULL DEFAULT NULL,'+
        '  `driver_opinion` varchar(25) DEFAULT NULL,'+
        '  `driver_hd_opinion` varchar(25) DEFAULT NULL,'+
        '  `supplier` varchar(255) DEFAULT NULL,'+
        '  `distance_haul` double(20,4) DEFAULT NULL,'+
        '  `sub_work` varchar(255) DEFAULT NULL'+
        ')';

    //'  `dbid` INTEGER PRIMARY KEY AUTOINCREMENT,'+
    var attendanceCSql=
        'CREATE TABLE `biz_attendance` ('+
        '  `dbid` varchar(50) PRIMARY KEY,'+
        '  `id_card_type` varchar(32) DEFAULT NULL,'+
        '  `id_card_number` varchar(32) DEFAULT NULL,'+
        '  `swipe_time` timestamp NULL DEFAULT NULL,'+
        '  `direction` varchar(21) DEFAULT NULL,'+
        '  `image` varchar(1000) DEFAULT NULL,'+
        '  `attend_type` varchar(32) DEFAULT NULL,'+
        '  `lng` varchar(255) DEFAULT NULL,'+
        '  `lat` varchar(255) DEFAULT NULL,'+
        '  `address` varchar(255) DEFAULT NULL,'+
        '  `project_code` varchar(20) DEFAULT NULL,'+
        '  `group_code` varchar(20) DEFAULT NULL,'+
        '  `gmt_create` timestamp NULL DEFAULT NULL,'+
        '  `sync_create` timestamp NULL DEFAULT CURRENT_TIMESTAMP,'+
        '  `sync_status` varchar(2) DEFAULT "0",'+
        '  `gmt_modify` timestamp NULL DEFAULT NULL,'+
        '  `user_create` varchar(20) DEFAULT NULL,'+
        '  `lng_lat_02` varchar(100) DEFAULT NULL,'+
        '  `fence_name` varchar(60) DEFAULT NULL'+
        ')';

    //2222-sql------------------------------------------------------------------------------------
    /*var projectISql = function(entity){
        var sql = 'REPLACE INTO `biz_project` (id, project_code, project_name, num, pid, pids, org_id, is_delete, sync_create, project_type, data_type)  VALUES '+
        '('+ entity.id+',"'+entity.projectCode+'","'+entity.projectName+'",'+entity.num+', '+entity.pid+',"'+entity.pids+'",'+entity.orgId+', '+entity.isDelete
        +',"'+entity.syncCreate+'","'+entity.projectType+'","'+entity.dataType+'"); ';
        return sql;
    }*/

    var userISqlBatch = function(list){
        var sql = 'REPLACE INTO `sys_user` (id, account, name, id_card, phone, org_id, status, sync_create)  VALUES ';
        for(var i=0;i<list.length;i++){
            var entity = list[i];
            sql += '('+entity.id+',"'+entity.account+'","'+entity.name+'","'+entity.idCard+'","'+entity.phone+'",'+entity.orgId+','+entity.status+',"'+entity.syncCreate+'"),';
        }
        sql = sql.substring(0,sql.length-1)+';';
        return sql;
    }

    var roleISqlBatch = function(list){
        var sql = 'REPLACE INTO `sys_role` (id, code, name, type, sync_create)  VALUES ';
        for(var i=0;i<list.length;i++){
            var entity = list[i];
            sql += '('+entity.id+',"'+entity.code+'","'+entity.name+'","'+entity.type+'","'+entity.syncCreate+'"),';
        }
        sql = sql.substring(0,sql.length-1)+';';
        return sql;
    }

    var userRoleISqlBatch = function(list){
        var sql = 'REPLACE INTO `sys_user_role` (id, user_id, role_id, sync_create)  VALUES ';
        for(var i=0;i<list.length;i++){
            var entity = list[i];
            sql += '('+entity.id+',"'+entity.userId+'","'+entity.roleId+'","'+entity.syncCreate+'"),';
        }
        sql = sql.substring(0,sql.length-1)+';';
        return sql;
    }

    var orgISqlBatch = function(list){
        var sql = 'REPLACE INTO `sys_org` (id, org_type, simple_name, num, pid, pids, project_id, is_delete, gmt_create, sync_create)  VALUES ';
        for(var i=0;i<list.length;i++){
            var entity = list[i];
            sql += '('+entity.id+',"'+entity.orgType+'","'+entity.simpleName+'",'+entity.num+', '+entity.pid+',"'+entity.pids+'",'+entity.projectId+', '+entity.isDelete
            +',"'+entity.gmtCreate+'","'+entity.syncCreate+'"),';
        }
        sql = sql.substring(0,sql.length-1)+';';
        return sql;
    }

    var projectISqlBatch = function(list){
        var sql = 'REPLACE INTO `biz_project` (id, project_code, project_name, num, pid, pids, org_id, is_delete, gmt_create, sync_create, project_type, data_type)  VALUES ';
        for(var i=0;i<list.length;i++){
            var entity = list[i];
            sql += '('+entity.id+',"'+entity.projectCode+'","'+entity.projectName+'",'+entity.num+', '+entity.pid+',"'+entity.pids+'",'+entity.orgId+', '+entity.isDelete
            +',"'+entity.gmtCreate+'","'+entity.syncCreate+'","'+entity.projectType+'","'+entity.dataType+'"),';
        }
        sql = sql.substring(0,sql.length-1)+';';
        return sql;
    }

    var motorcadeISqlBatch = function(list){
        var sql = 'REPLACE INTO `biz_motorcade` (id, project_code, vehicle_owner, motorcade_name, short_name, gmt_create, sync_create)  VALUES ';
        for(var i=0;i<list.length;i++){
            var entity = list[i];
            sql += '('+entity.id+',"'+entity.projectCode+'","'+entity.vehicleOwner+'","'+entity.motorcadeName+'","'+entity.shortName+'","'+entity.gmtCreate+'","'+entity.syncCreate+'"),';
        }
        sql = sql.substring(0,sql.length-1)+';';
        return sql;
    }

    var materialISqlBatch = function(list){
        var sql = 'REPLACE INTO `biz_material` (id, project_code, name, current_count,material_no, material_type,material_standard, supplier, gmt_create, sync_create)  VALUES ';
        for(var i=0;i<list.length;i++){
            var entity = list[i];
            if(!entity.materialStandard){entity.materialStandard=''}
            if(!entity.supplier){entity.supplier=''}
            if(!entity.currentCount){entity.currentCount=null}
            sql += '('+entity.id+',"'+entity.projectCode+'","'+entity.name+'",'+entity.currentCount +',"'+entity.materialNo+'","'+entity.materialType+'","'+entity.materialStandard+'","'+entity.supplier
            +'","'+entity.gmtCreate+'","'+entity.syncCreate+'"),';
        }
        sql = sql.substring(0,sql.length-1)+';';
        return sql;
    }

    var vehicleISqlBatch = function(list){
        var sql = 'REPLACE INTO `biz_vehicle` (id, project_code, car_no, driver_id, driver_mobile, car_type, trade_type, car_length, car_width, car_height, add_height,standard_volume,motorcade_id,gmt_create, sync_create)  VALUES ';
        for(var i=0;i<list.length;i++){
            var entity = list[i];
            if(!entity.driverMobile){entity.driverMobile=''}
            if(!entity.addHeight){entity.addHeight=null}
            sql += '('+entity.id+',"'+entity.projectCode+'","'+entity.carNo+'","'+entity.driverId +'","'+entity.driverMobile+'","'+entity.carType+'","'+entity.tradeType
            +'",'+entity.carLength+','+entity.carWidth+','+entity.carHeight+','+entity.addHeight+','+entity.standardVolume+','+entity.motorcadeId
            +',"'+entity.gmtCreate+'","'+entity.syncCreate+'"),';
        }
        sql = sql.substring(0,sql.length-1)+';';
        return sql;
    }

    var waybillISqlBatch = function(list){//syncStatus(0-未同步，1-已同步)
        var sql = 
            'REPLACE INTO `biz_waybill` (dbid, waybill_no,project_code, car_no, driver_id, material_no, origin, receiving, origin_stake_num, origin_stake_num_meter,'+
            'load_stake_num, load_stake_num_meter,receiving_stake_num,receiving_stake_num_meter,distance,adjust_distance,adjust_remark,quantity,adjust_quantity,'+
            'consignor_id,consignee_id,status,deliveryTime,receiptTime,deliveryRemark,receiptRemark,driver_opinion,driver_hd_opinion,gmt_create, sync_create,sync_status,'+
            'supplier,distance_haul,sub_work)  VALUES ';
            for(var i=0;i<list.length;i++){
                var entity = list[i];
                if(!entity.driverId){entity.driverId=''}
                if(!entity.receiving){entity.receiving=''}
                if(!entity.receivingStakeNum){entity.receivingStakeNum=null}
                if(!entity.receivingStakeNumMeter){entity.receivingStakeNumMeter=null}
                if(!entity.adjustDistance){entity.adjustDistance=''}
                if(!entity.adjustRemark){entity.adjustRemark=''}
                if(!entity.adjustQuantity){entity.adjustQuantity=null}
                if(!entity.consignorId){entity.consignorId=''}
                if(!entity.consigneeId){entity.consigneeId=''}
                if(!entity.receipttime){entity.receipttime=''}
                if(!entity.deliveryRemark){entity.deliveryRemark=''}
                if(!entity.receiptRemark){entity.receiptRemark=''}
                if(!entity.driverOpinion){entity.driverOpinion=''}
                if(!entity.driverHdOpinion){entity.driverHdOpinion=''}
                if(!entity.syncCreate){entity.syncCreate=''}
                if(!entity.syncStatus){entity.syncStatus='0'}
                if(!entity.supplier){entity.supplier=''}
                if(!entity.distanceHaul){entity.distanceHaul=''}
                if(!entity.subWork){entity.subWork=''}
                sql += 
                '('+entity.dbid+',"'+entity.waybillNo+'","'+entity.projectCode+'","'+entity.carNo+'","'+entity.driverId +'","'+entity.materialNo+'","'+entity.origin+'","'+entity.receiving
                +'",'+entity.originStakeNum+','+entity.originStakeNumMeter+','+entity.loadStakeNum+','+entity.loadStakeNumMeter+','+entity.receivingStakeNum+','+entity.receivingStakeNumMeter
                +','+entity.distance+',"'+entity.adjustDistance+'","'+entity.adjustRemark+'","'+entity.quantity+'",'+entity.adjustQuantity+',"'+entity.consignorId+'","'+entity.consigneeId
                +'","'+entity.status+'","'+entity.deliverytime+'","'+entity.receipttime+'","'+entity.deliveryRemark+'","'+entity.receiptRemark+'","'+entity.driverOpinion+'","'+entity.driverHdOpinion
                +'","'+entity.gmtCreate+'","'+entity.syncCreate+'","'+entity.syncStatus+'","'+entity.supplier+'","'+entity.distanceHaul+'","'+entity.subWork+'"),';
            }
            sql = sql.substring(0,sql.length-1)+';';
            console.log(sql);
            return sql;
    }

    var waybillISqlBatchNoId = function(list){//syncStatus(0-未同步，1-已同步)
        var sql = 
            'REPLACE INTO `biz_waybill` ( waybill_no,project_code, car_no, driver_id, material_no, origin, receiving, origin_stake_num, origin_stake_num_meter,'+
            'load_stake_num, load_stake_num_meter,receiving_stake_num,receiving_stake_num_meter,distance,adjust_distance,adjust_remark,quantity,adjust_quantity,'+
            'consignor_id,consignee_id,status,deliveryTime,receiptTime,deliveryRemark,receiptRemark,driver_opinion,driver_hd_opinion,gmt_create, sync_create,'+
            'sync_status,supplier,distance_haul,sub_work)  VALUES ';
            for(var i=0;i<list.length;i++){
                var entity = list[i];
                if(!entity.driverId){entity.driverId=''}
                if(!entity.receiving){entity.receiving=''}
                if(!entity.receivingStakeNum){entity.receivingStakeNum=null}
                if(!entity.receivingStakeNumMeter){entity.receivingStakeNumMeter=null}
                if(!entity.adjustDistance){entity.adjustDistance=''}
                if(!entity.adjustRemark){entity.adjustRemark=''}
                if(!entity.adjustQuantity){entity.adjustQuantity=null}
                if(!entity.consignorId){entity.consignorId=''}
                if(!entity.consigneeId){entity.consigneeId=''}
                if(!entity.receipttime){entity.receipttime=''}
                if(!entity.deliveryRemark){entity.deliveryRemark=''}
                if(!entity.receiptRemark){entity.receiptRemark=''}
                if(!entity.driverOpinion){entity.driverOpinion=''}
                if(!entity.driverHdOpinion){entity.driverHdOpinion=''}
                if(!entity.syncCreate){entity.syncCreate=''}
                if(!entity.syncStatus){entity.syncStatus='0'}
                if(!entity.supplier){entity.supplier=''}
                if(!entity.distanceHaul){entity.distanceHaul=''}
                if(!entity.subWork){entity.subWork=''}
                sql += 
                '("'+entity.waybillNo+'","'+entity.projectCode+'","'+entity.carNo+'","'+entity.driverId +'","'+entity.materialNo+'","'+entity.origin+'","'+entity.receiving
                +'",'+entity.originStakeNum+','+entity.originStakeNumMeter+','+entity.loadStakeNum+','+entity.loadStakeNumMeter+','+entity.receivingStakeNum+','+entity.receivingStakeNumMeter
                +','+entity.distance+',"'+entity.adjustDistance+'","'+entity.adjustRemark+'","'+entity.quantity+'",'+entity.adjustQuantity+',"'+entity.consignorId+'","'+entity.consigneeId
                +'","'+entity.status+'","'+entity.deliverytime+'","'+entity.receipttime+'","'+entity.deliveryRemark+'","'+entity.receiptRemark+'","'+entity.driverOpinion+'","'+entity.driverHdOpinion
                +'","'+entity.gmtCreate+'","'+entity.syncCreate+'","'+entity.syncStatus+'","'+entity.supplier+'","'+entity.distanceHaul+'","'+entity.subWork+'"),';
            }
            sql = sql.substring(0,sql.length-1)+';';
            //console.log(sql);
            return sql;
    }

    var attendanceISqlBatch = function(list){//syncStatus(0-未同步，1-已同步)
        var sql = 
            'REPLACE INTO `biz_attendance` (dbid, id_card_type,id_card_number, direction, image, attend_type, lng, lat, address, project_code,'+
            'group_code, swipe_time,gmt_create, sync_create,sync_status,user_create,lng_lat_02,fence_name)  VALUES ';
            for(var i=0;i<list.length;i++){
                var entity = list[i];
                if(!entity.dbid){entity.dbid=''}
                if(!entity.image){entity.image=''}
                if(!entity.lngLatO2){entity.lngLatO2=''}
                if(!entity.address){entity.address=''}
                if(!entity.groupCode){entity.groupCode=''}
                if(!entity.userCreate){entity.userCreate=''}
                if(!entity.syncCreate){entity.syncCreate=''}
                if(!entity.syncStatus){entity.syncStatus='0'}
                sql += 
                '("'+entity.dbid+'","'+entity.idCardType+'","'+entity.idCardNumber+'","'+entity.direction+'","'+entity.image +'","'+entity.attendType+'","'+entity.lng+'","'+entity.lat
                +'","'+entity.address+'","'+entity.projectCode+'","'+entity.groupCode+'","'+entity.swipeTime+'","'+entity.gmtCreate+'","'+entity.syncCreate+'","'+entity.syncStatus
                +'","'+entity.userCreate+'","'+entity.lngLatO2+'","'+entity.fenceName+'"),';
            }
            sql = sql.substring(0,sql.length-1)+';';
            return sql;
    }

    var attendanceISqlBatchNoId = function(list){//syncStatus(0-未同步，1-已同步)
        var sql = 
            'REPLACE INTO `biz_attendance` (id_card_type,id_card_number, direction, image, attend_type, lng, lat, address, project_code,'+
            'group_code, swipe_time,gmt_create, sync_create,sync_status,user_create,lng_lat_02,fence_name)  VALUES ';
            for(var i=0;i<list.length;i++){
                var entity = list[i];
                if(!entity.image){entity.image=''}
                if(!entity.address){entity.address=''}
                if(!entity.groupCode){entity.groupCode=''}
                if(!entity.userCreate){entity.userCreate=''}
                if(!entity.syncCreate){entity.syncCreate=''}
                if(!entity.syncStatus){entity.syncStatus='0'}
                sql += 
                '("'+entity.idCardType+'","'+entity.idCardNumber+'","'+entity.direction+'","'+entity.image +'","'+entity.attendType+'","'+entity.lng+'","'+entity.lat
                +'","'+entity.address+'","'+entity.projectCode+'","'+entity.groupCode+'","'+entity.swipeTime+'","'+entity.gmtCreate+'","'+entity.syncCreate+'","'+entity.syncStatus
                +'","'+entity.userCreate+'","'+entity.lngLatO2+'","'+entity.fenceName+'"),';
            }
            sql = sql.substring(0,sql.length-1)+';';
            console.log(sql);
            return sql;
    }
    

    //3333-method-------------------------------------------------------------------------------------
    var getAuthorityQueryForApp = function(orgId){
        var sql ="SELECT	p.id AS projectId,	p.project_code AS projectCode,	( CASE WHEN p.project_type = '3' THEN p.project_name END) AS workAreaName,	( CASE			WHEN p.project_type = '2' THEN p.project_name			WHEN p.project_type = '3' THEN bp.project_name END ) AS sectionName,	( CASE			WHEN p.project_type = '1' THEN p.project_name			WHEN p.project_type = '2' THEN bp.project_name			WHEN p.project_type = '3' THEN bpt.project_name END ) AS projectName,	p.pid,	p.project_type AS projectType,   ( CASE           WHEN p.project_type = '1' THEN p.data_type           WHEN p.project_type = '2' THEN p.data_type           WHEN p.project_type = '3' THEN bp.data_type END ) AS dataType	FROM		sys_org o	JOIN biz_project p ON p.id = o.project_id		LEFT JOIN biz_project bp ON bp.id = p.pid 		LEFT JOIN biz_project bpt ON bpt.id = bp.pid	WHERE		INSTR(o.pids,'["+ orgId +"]')>0  		AND o.org_type = '1' 		AND o.is_delete = 0 ";
		return sql;	
    }

    var projectQuListDbData = function(db,orgId){
        var sql;
        if(orgId){
            sql ="SELECT pro.id,pro.pid,pro.pids,org.pids AS orgPids,pro.num,pro.project_name AS projectName,pro.project_code AS projectCode,pro.project_type AS projectType,"+
            "pro.data_type as dataType,pro.is_delete as isDelete,pro.org_id as orgId,pro.gmt_create as gmtCreate,pro.sync_create as syncCreate FROM biz_project pro"+
            " LEFT JOIN sys_org org ON org.project_id = pro.id "+
            " WHERE INSTR(org.pids,'["+ orgId +"]')>0 AND pro.is_delete = 0";
            //" WHERE org.pids LIKE '%[' || " + orgId +" || ']%' AND pro.is_delete = 0";
        }else{
            sql = 'SELECT id,project_code as projectCode,project_name as projectName,num,pid,pids,org_id as orgId,is_delete as isDelete,project_type as projectType,data_type as dataType FROM '
            + dictSyncDa.project.tableName +' ORDER BY id desc';
        }
        return querySqlDb(db,sql);
    }

    var waybillQuListDbData = function(db,orgId,projectId,status){
        var sql;
        if(orgId){
            var basecSql = getAuthorityQueryForApp(orgId);
            sql= "SELECT"+
                "	bw.dbid,"+
                "	bw.waybill_no AS waybillNo,"+
                "	bw.car_no AS carNo,"+
                "	bw.driver_id as driverId,"+
                "	bw.project_code AS projectCode,"+
                "	pro.projectType,"+
                "	pro.projectName,"+
                "	pro.sectionName,"+
                "	pro.workAreaName,"+
                "	bw.material_no as materialNo,"+
                "	bw.origin AS origin,"+
                "	bw.origin_stake_num AS originStakeNum,"+
                "	bw.origin_stake_num_meter AS originStakeNumMeter,"+
                "	bw.load_stake_num AS loadStakeNum,"+
                "	bw.load_stake_num_meter AS loadStakeNumMeter,"+
                "	bw.receiving AS receiving,"+
                "	bw.receiving_stake_num AS receivingStakeNum,"+
                "	bw.receiving_stake_num_meter AS receivingStakeNumMeter,"+
                "	bw.distance AS distance,"+
                "	bw.adjust_distance AS adjustDistance,"+
                "	bw.adjust_remark AS adjustRemark,"+
                "	bw.quantity AS quantity,"+
                "	bw.adjust_quantity AS adjustQuantity,"+
                "	bw.consignor_id AS consignorId,"+
                "	bw.consignee_id AS consigneeId,"+
                "	bw.status AS status,"+
                "	bw.deliveryTime AS deliverytime,"+
                "	bw.receiptTime AS receipttime,"+
                "	bw.deliveryRemark AS deliveryRemark,"+
                "	bw.receiptRemark AS receiptRemark,"+
                "	bw.gmt_create as gmtCreate,"+
                "	m.motorcade_name as motorcadeName,"+
                "   v.driver_mobile as driverMobile,"+
                "   v.car_length as carLength,"+
                "   v.car_width as carWidth,"+
                "   v.car_height as carHeight,"+
                "   v.add_height as addHeight,"+
                "   v.standard_volume as standardVolume,"+
                "   su1.name as consignorName,"+
                "   su1.phone as consignorMobike,"+
                "   su2.name as consigneeName,"+
                "   su2.phone as consigneeMobike,"+
                "   su3.name as driverName,"+
                "   su4.name as supplierName,"+
                "	bm.name as materialName,"+
                "	bm.material_standard as materialStandard,"+
                "	bw.driver_opinion AS driverOpinion,"+
                "	bw.driver_hd_opinion AS driverHdOpinion,"+
                "   bw.sync_create as syncCreate,"+
                "   bw.sync_status as syncStatus,"+
                "   bw.distance_haul as distanceHaul,"+
                "   bw.sub_work as subWork"+
                " FROM biz_waybill bw"+
                " inner join ( "+basecSql+" ) pro on pro.projectCode= bw.project_code"+
                " LEFT JOIN biz_vehicle v ON v.car_no = bw.car_no and v.project_code = bw.project_code"+
                " LEFT JOIN biz_motorcade m ON v.motorcade_id = m.id"+
                " LEFT JOIN  biz_material bm on bm.material_no = bw.material_no and bm.project_code = bw.project_code"+
                " LEFT JOIN sys_user su1 on su1.account = bw.consignor_id"+
                " LEFT JOIN sys_user su2 on su2.account = bw.consignee_id"+
                " LEFT JOIN sys_user su3 on su3.account = bw.driver_id"+
                " LEFT JOIN sys_user su4 on su4.account = bw.supplier"+
                " WHERE  bw.status = "+ status +" AND bw.project_code IN"+
                "	(SELECT p2.project_code AS projectCode FROM biz_project p2 where  INSTR(p2.pids,'["+ projectId +"]')>0  AND p2.is_delete = 0) "+
                " order by bw.deliveryTime desc";
        }
        return querySqlDb(db,sql);
    }

    var userQuCountDbData = function(db,orgId){
        var sql;
        if(orgId){
            sql ="SELECT Count(*) as count,Max(pro.sync_create) as syncCreate FROM sys_user pro LEFT JOIN sys_org org ON org.id = pro.org_id "+
            " WHERE INSTR(org.pids,'["+ orgId +"]')>0 AND org.is_delete = 0";
        }else{
            sql ="SELECT Count(*) as count FROM sys_user pro LEFT JOIN sys_org org ON org.id = pro.org_id WHERE org.is_delete = 0";
        }
        return querySqlDb(db,sql);
    }

    var projectQuCountDbData = function(db,orgId){
        var sql;
        if(orgId){
            sql ="SELECT Count(*) as count,Max(pro.sync_create) as syncCreate FROM biz_project pro LEFT JOIN sys_org org ON org.project_id = pro.id "+
            " WHERE INSTR(org.pids,'["+ orgId +"]')>0 AND pro.is_delete = 0";
        }else{
            sql ="SELECT Count(*) as count,Max(pro.sync_create) as syncCreate FROM biz_project pro LEFT JOIN sys_org org ON org.project_id = pro.id WHERE pro.is_delete = 0";
        }
        return querySqlDb(db,sql);
    }

    var motorcadeQuCountDbData = function(db,orgId){
        var sql;
        if(orgId){
            sql ="SELECT Count(*) as count,Max(mo.sync_create) as syncCreate FROM biz_motorcade mo where mo.project_code in "+
            " (SELECT pro.project_code AS projectCode FROM biz_project pro LEFT JOIN sys_org org ON org.project_id = pro.id WHERE INSTR(org.pids,'["+ orgId +"]')>0 AND pro.is_delete = 0)";
        }else{
            sql ="SELECT Count(*) as count,Max(mo.sync_create) as syncCreate FROM biz_motorcade mo where mo.project_code in "+
            " (SELECT pro.project_code AS projectCode FROM biz_project pro LEFT JOIN sys_org org ON org.project_id = pro.id WHERE pro.is_delete = 0)";
        }
        return querySqlDb(db,sql);
    }

    var materialQuCountDbData = function(db,orgId){
        var sql;
        if(orgId){
            sql ="SELECT Count(*) as count,Max(mo.sync_create) as syncCreate FROM biz_material mo where mo.project_code in "+
            " (SELECT pro.project_code AS projectCode FROM biz_project pro LEFT JOIN sys_org org ON org.project_id = pro.id WHERE INSTR(org.pids,'["+ orgId +"]')>0 AND pro.is_delete = 0)";
        }else{
            sql ="SELECT Count(*) as count,Max(mo.sync_create) as syncCreate FROM biz_material mo where mo.project_code in "+
            " (SELECT pro.project_code AS projectCode FROM biz_project pro LEFT JOIN sys_org org ON org.project_id = pro.id WHERE pro.is_delete = 0)";
        }
        return querySqlDb(db,sql);
    }

    var vehicleQuCountDbData = function(db,orgId){
        var sql;
        if(orgId){
            sql ="SELECT Count(*) as count,Max(mo.sync_create) as syncCreate FROM biz_vehicle mo where mo.project_code in "+
            " (SELECT pro.project_code AS projectCode FROM biz_project pro LEFT JOIN sys_org org ON org.project_id = pro.id WHERE INSTR(org.pids,'["+ orgId +"]')>0 AND pro.is_delete = 0)";
        }else{
            sql ="SELECT Count(*) as count,Max(mo.sync_create) as syncCreate FROM biz_vehicle mo where mo.project_code in "+
            " (SELECT pro.project_code AS projectCode FROM biz_project pro LEFT JOIN sys_org org ON org.project_id = pro.id WHERE pro.is_delete = 0)";
        }
        return querySqlDb(db,sql);
    }
    
    var waybillByStatusDbData = function(db,status,syncStatus){
        var tempS ="";  
        if(status=="99"){
            tempS = " WHERE bw.sync_status="+syncStatus;
        }else{
            tempS = " WHERE  bw.status = "+ status + " AND bw.sync_status="+syncStatus;
        }
        var sql= "SELECT"+
                "	bw.dbid,"+
                "	bw.waybill_no AS waybillNo,"+
                "	bw.car_no AS carNo,"+
                "	bw.driver_id as driverId,"+
                "	bw.project_code AS projectCode,"+
                "	bw.material_no as materialNo,"+
                "	bw.origin AS origin,"+
                "	bw.origin_stake_num AS originStakeNum,"+
                "	bw.origin_stake_num_meter AS originStakeNumMeter,"+
                "	bw.load_stake_num AS loadStakeNum,"+
                "	bw.load_stake_num_meter AS loadStakeNumMeter,"+
                "	bw.receiving AS receiving,"+
                "	bw.receiving_stake_num AS receivingStakeNum,"+
                "	bw.receiving_stake_num_meter AS receivingStakeNumMeter,"+
                "	bw.distance AS distance,"+
                "	bw.adjust_distance AS adjustDistance,"+
                "	bw.adjust_remark AS adjustRemark,"+
                "	bw.quantity AS quantity,"+
                "	bw.adjust_quantity AS adjustQuantity,"+
                "	bw.consignor_id AS consignorId,"+
                "	bw.consignee_id AS consigneeId,"+
                "	bw.status AS status,"+
                "	bw.deliveryTime AS deliveryTime,"+
                "	bw.receiptTime AS receiptTime,"+
                "	bw.deliveryRemark AS deliveryRemark,"+
                "	bw.receiptRemark AS receiptRemark,"+
                "	bw.gmt_create as gmtCreate,"+
                "	bw.driver_opinion AS driverOpinion,"+
                "	bw.driver_hd_opinion AS driverHdOpinion,"+
                "   bw.sync_create as syncCreate,"+
                "   bw.sync_status as syncStatus,"+
                "   bw.supplier as supplier"+
                " FROM biz_waybill bw"+
                tempS+
                " order by bw.deliveryTime desc";
                //" WHERE  bw.status = "+ status + " AND bw.sync_status="+syncStatus+
        return querySqlDb(db,sql);
    }

    var materialQuListDbData= function(db,projectCode){
        var sql;
        if(projectCode){
            sql ="SELECT id, project_code as projectCode, name, current_count as currentCount,material_no as materialNo, material_type as materialType,"+
            "material_standard as materialStandard, supplier, gmt_create as gmtCreate, sync_create as syncCreate FROM biz_material "+
            " WHERE project_code="+ projectCode +"";
        }else{
            sql ="SELECT id, project_code as projectCode, name, current_count as currentCount,material_no as materialNo, material_type as materialType,"+
            "material_standard as materialStandard, supplier, gmt_create as gmtCreate, sync_create as syncCreate FROM biz_material ";
        }
        return querySqlDb(db,sql);
    } 

    var vehicleQuListDbData= function(db,carNo,projectCode,account){
        var sql;
        if(projectCode && account){
            sql ="SELECT ve.id, ve.project_code as projectCode, ve.car_no as carNo, ve.driver_id as driverId, ve.driver_mobile as driverMobile, ve.car_type as carType, ve.trade_type as tradeType,"+
            "ve.car_length as carLength, ve.car_width as carWidth, ve.car_height as carHeight, ve.add_height as addHeight,ve.standard_volume as standardVolume,ve.motorcade_id as motorcadeId,"+
            "ve.gmt_create as gmtCreate, ve.sync_create as syncCreate,su3.name as driverName"+
            " FROM biz_vehicle ve"+
            " LEFT JOIN sys_user su3 on su3.account = ve.driver_id"+
            " WHERE ve.project_code="+ projectCode +" AND ve.driver_id ='"+ account +"'";
        }else if(projectCode && carNo){
            sql ="SELECT ve.id, ve.project_code as projectCode, ve.car_no as carNo, ve.driver_id as driverId, ve.driver_mobile as driverMobile, ve.car_type as carType, ve.trade_type as tradeType,"+
            "ve.car_length as carLength, ve.car_width as carWidth, ve.car_height as carHeight, ve.add_height as addHeight,ve.standard_volume as standardVolume,ve.motorcade_id as motorcadeId,"+
            "ve.gmt_create as gmtCreate, ve.sync_create as syncCreate,su3.name as driverName"+
            " FROM biz_vehicle ve"+
            " LEFT JOIN sys_user su3 on su3.account = ve.driver_id"+
            " WHERE ve.car_no ='"+ carNo +"' AND ve.project_code="+ projectCode +"";
        }else{
            sql ="SELECT ve.id, ve.project_code as projectCode, ve.car_no as carNo, ve.driver_id as driverId, ve.driver_mobile as driverMobile, ve.car_type as carType, ve.trade_type as tradeType,"+
            "ve.car_length as carLength, ve.car_width as carWidth, ve.car_height as carHeight, ve.add_height as addHeight,ve.standard_volume as standardVolume,ve.motorcade_id as motorcadeId,"+
            "ve.gmt_create as gmtCreate, ve.sync_create as syncCreate,su3.name as driverName"+
            " FROM biz_vehicle ve"+
            " LEFT JOIN sys_user su3 on su3.account = ve.driver_id";
        }
        return querySqlDb(db,sql);
    } 
    
    var usersByRoleCodeListDbData= function(db,roleCode){
        var sql;
        if(roleCode){
            sql ="SELECT u.id,u.account,u.NAME as name FROM sys_user u,sys_role r,sys_user_role ur"+
            " WHERE u.id = ur.user_id AND u.`status` != 3 AND ur.role_id = r.id AND r.CODE = '"+ roleCode +"'";
        }else{
            sql ="SELECT u.id,u.account,u.NAME as name FROM sys_user u,sys_role r,sys_user_role ur"+
            " WHERE u.id = ur.user_id AND u.`status` != 3 AND ur.role_id = r.id ";
        }
        return querySqlDb(db,sql);
    } 

    var attendanceQuListDbData = function(db,attendanceDate,projectCode,account,status){
        var sql;
        if(projectCode && attendanceDate){
            sql= "SELECT"+
                "	bw.dbid,"+
                "	bw.id_card_type AS idCardType,"+
                "	bw.id_card_number AS idCardNumber,"+
                "	bw.direction as direction,"+
                "	bw.image AS image,"+
                "	bw.attend_type as attendType,"+
                "	bw.lng AS lng,"+
                "	bw.lat AS lat,"+
                "	bw.address AS address,"+
                "	bw.project_code AS projectCode,"+
                "	bw.swipe_time AS swipeTime,"+
                "	bw.gmt_create AS gmtCreate,"+
                "	bw.sync_status AS syncStatus,"+
                "	bw.user_create AS userCreate,"+
                "	bw.lng_lat_02 AS lngLat02,"+
                "	bw.fence_name AS fenceName"+
                " FROM biz_attendance bw"+
                " LEFT JOIN sys_user u on u.id_card = bw.id_card_number"+
                " WHERE  strftime('%Y-%m-%d',bw.swipe_time)= '"+ attendanceDate +"'"+
                " AND  bw.project_code = '"+ projectCode +"'"+
                " AND  bw.user_create = '"+ account +"'"+
                " order by bw.swipe_time asc";
        }
        return querySqlDb(db,sql);
    }

    var attendanceSyncListDbData = function(db,status){
        var sql;
        sql= "SELECT"+
            "	bw.dbid,"+
            "	bw.id_card_type AS idCardType,"+
            "	bw.id_card_number AS idCardNumber,"+
            "	bw.direction as direction,"+
            "	bw.image AS image,"+
            "	bw.attend_type as attendType,"+
            "	bw.lng AS lng,"+
            "	bw.lat AS lat,"+
            "	bw.address AS address,"+
            "	bw.project_code AS projectCode,"+
            "	bw.swipe_time AS swipeTime,"+
            "	bw.gmt_create AS gmtCreate,"+
            "	bw.sync_status AS syncStatus,"+
            "	bw.user_create AS userCreate,"+
            "	bw.lng_lat_02 AS lngLat02,"+
            "	bw.fence_name AS fenceName"+
            " FROM biz_attendance bw"+
            " LEFT JOIN sys_user u on u.id_card = bw.id_card_number"+
            " WHERE  bw.sync_status = '"+ status +"'"+
            " order by bw.swipe_time asc";
        return querySqlDb(db,sql);
    }


    //444---dictData-------------------------------------
    var dictSyncDa = {
            user:{
                name:"人员信息",
                entity:{},
                tableName:"sys_user",
                cSql:userCSql,
            },
            role:{
                name:"角色信息",
                entity:{},
                tableName:"sys_role",
                cSql:roleCSql,
            },
            userRole:{
                name:"用户角色信息",
                entity:{},
                tableName:"sys_user_role",
                cSql:userRoleCSql,
            },
            org: {
                name:"机构信息",
                entity:{},
                tableName:"sys_org",
                cSql:orgCSql,
            },
            project: {
                name:"项目信息",////project_code, project_name, num, pid, pids, org_id, is_delete, gmt_create, gmt_modify, project_type, data_type
                entity:{
                    id:'',
                    projectCode:'',
                    projectName:'',
                    num:'',
                    pid:'',
                    pids:'',
                    orgId:'',
                    isDelete:'',
                    gmtCreate:'',
                    gmtModify:'',
                    projectType:'',
                    dataType:''
                },
                tableName:"biz_project",//"Persons",
                cSql:projectCSql,//创建表
                //iSql:projectISql,//插入数据
                //qSql:projectQSql,//查询数据
                //rSql:"",//删除表
                //dSql:"",//清空表
            },
            motorcade: {
                name:"车队信息",
                entity:{},
                tableName:"biz_motorcade",
                cSql:motorcadeCSql,
            },
            vehicle: {
                name:"车辆信息",
                entity:{},
                tableName:"biz_vehicle",
                cSql:vehicleCSql,
            },
            material: {
                name:"物料信息",
                entity:{},
                tableName:"biz_material",
                cSql:materialCSql,
            },
            waybill: {
                name:"运单信息",
                entity:{},
                tableName:"biz_waybill",
                cSql:waybillCSql,//syncStatus(0-未同步，1-已同步)
            },
            attendance: {
                name:"考勤信息",
                entity:{},
                tableName:"biz_attendance",
                cSql:attendanceCSql,//syncStatus(0-未同步，1-已同步)
            },
    }

    //shengming----------------------
    //db数据库操作
    var dbApi = {
        createDir: createDir,
        subfile: subfile,
        closeDatabase: closeDatabase,
        openDatabase: openDatabase,
        openDatabaseSync: openDatabaseSync,
        queryTables: queryTables,
        tableExist: tableExist,
        newTable: newTable,
        newTableSync: newTableSync,
        dropTable: dropTable,
        insertRdDb: insertRdDb,
        insertRdDbBatch: insertRdDbBatch,
        updateRdDb: updateRdDb,
        deleteRdDb: deleteRdDb,
        selectRdDb: selectRdDb,
        querySqlDb: querySqlDb,
    };

    //sql语句
    var dbSql = {
        userISqlBatch: userISqlBatch,
        roleISqlBatch: roleISqlBatch,
        userRoleISqlBatch: userRoleISqlBatch,
        orgISqlBatch: orgISqlBatch,
        projectISqlBatch: projectISqlBatch,
        motorcadeISqlBatch: motorcadeISqlBatch,
        materialISqlBatch: materialISqlBatch,
        vehicleISqlBatch: vehicleISqlBatch,
        waybillISqlBatch: waybillISqlBatch,
        waybillISqlBatchNoId: waybillISqlBatchNoId,
        attendanceISqlBatch: attendanceISqlBatch,
        attendanceISqlBatchNoId: attendanceISqlBatchNoId,
    }

    //查询方法
    var queryMain = {
        projectQuListDbData: projectQuListDbData,
        waybillQuListDbData: waybillQuListDbData,
        userQuCountDbData: userQuCountDbData,
        projectQuCountDbData: projectQuCountDbData,
        motorcadeQuCountDbData: motorcadeQuCountDbData,
        materialQuCountDbData: materialQuCountDbData,
        vehicleQuCountDbData: vehicleQuCountDbData,
        materialQuListDbData: materialQuListDbData,
        vehicleQuListDbData: vehicleQuListDbData,
        waybillByStatusDbData: waybillByStatusDbData,
        usersByRoleCodeListDbData: usersByRoleCodeListDbData,
        attendanceQuListDbData: attendanceQuListDbData,
        attendanceSyncListDbData: attendanceSyncListDbData,
    }

    
    window.dbApi = dbApi;
    window.dbSql = dbSql;

    window.dictSyncDa = dictSyncDa;
    window.queryMain = queryMain;

    
})(window);
