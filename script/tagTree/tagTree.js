///////////////////////////////////////////////
/// 树型标签
/// V 1.0
/// creat by lee
/// https://github.com/miracleren/tagTree
/// 20190529
/// 运行库 juqery
/// //////////////////////////////////////////


;(function($){

	var defaults ={
		id:"",
		data:[],
		fold:true,
		multiple:false,
		check:function(){},
		done:function(){}
	};

    $.fn.tagTree = function(options){
        var that = $(this);
		options.id = "#" + that.attr("id");
		//继承传过来的值
        var opts = $.extend(defaults, options);

        that.addClass("tagtree");
        setTree(defaults.data,that);

        $(' li:has(ul)').addClass('li-top');
        if(defaults.fold)
        	$(" .li-top li").hide('fast');

        $(' li > span').parent('li.li-top').find(' > ul > li').hide('fast');
        $(' li > a > i.left_nav_name ').on('click', function (e) {
            e.stopPropagation();
            var open = $(this).hasClass('i_open');
            if(open){
                $(this).removeClass("i_open");
                $(this).removeClass("roate");

            }else{
                $(this).addClass("i_open");
                $(this).addClass("roate");
            }
            var children = $(this).parent().parent('li.li-top').find(' > ul > li');
            if (children.is(":visible")) {
                children.hide('fast');
            } else {
                children.show('fast');
                $(this).parent().parent('li.li-top').siblings().find(' > ul > li').hide('fast')
            }
		});
	    $(' li > a ').on('click', function (e) {
	    	e.stopPropagation()
            var open = $(this).hasClass('nav_open');
            if(open){
                $(this).removeClass("nav_open");
                $(this).find('i.left_nav_name').addClass("roate");
			}else{
                $(this).addClass("nav_open");
                $(this).find('i.left_nav_name').removeClass("roate");
			}
            var checkId = $(this).find('span').attr("data-val");
            //拿到选中的id 将当前选中的id数据返回
			var json = []
            GetSubJson(defaults.data, checkId,json);
            var curData = {}
            for(var item in json[0]){
            	if(item != 'children'){
                    curData[item] = json[0][item]
				}
             }
			//点击拿到当前点击的数据
            defaults.check(curData);
            // defaults.check($(this).find('span').attr("data-val"))
            var children = $(this).parent('li.li-top').find(' > ul > li');

            if (children.is(":visible")) {
                children.hide('fast');
            } else {
                children.show('fast');
                $(this).parent('li.li-top').siblings().find(' > ul > li').hide('fast')
            }
            return false;
        });
	    $(' li span').hover(function() {
	    	if (!$(this).find('i').hasClass('i-check'))
	    		$(this).find('i').show(200);
	    }, function() {
	    	if (!$(this).find('i').hasClass('i-check'))
	    		$(this).find('i').hide(100);
	    });

	    defaults.done();
	}

	$.fn.tagTreeValues =function(){
		var vals = [];
		$(" .i-check").each(function(index, el) {
			vals.push($(el).attr('data-val'));
		});
		return vals;
	}

	//递归生成树
	function setTree(data,that)
	{
		var ul = $('<ul class="nav_"></ul>');
		that.append(ul);

		$.each(data,function(index,value){
            if(value.nav_open) {
                var li = $('<li><a href="#"><i  class="icon iconfont icon-gengduo left_nav_name i_open roate"></i><span class=" nav_open" data-val="' + value.id + '">' + value.projectName2 + '</span></a></li>');
            }else{
                var li = $('<li><a href="#"><i  class="icon iconfont"></i><span class="" data-val="' + value.id + '">' + value.projectName2 + '</span></a></li>');

            }
            ul.append(li);
		    if(value.children)
		    {
		    	setTree(value.children,li);
		    }
		});
	}
	//获取当前点击的li的数据
    function GetSubJson(jsonData, destID,json) {
        for (var i = 0; i < jsonData.length; i++) {
            if (jsonData[i].id == destID){
                json.push(jsonData[i]);
			}
            else {
                if (jsonData[i].hasOwnProperty("children")) {
                    GetSubJson(jsonData[i].children, destID,json);
                }
            }
        }
    }

})(jQuery);
