# 功能描述

本模块是移动端日期时间选择控件,实现类似按时间段查询功能,可选择日期,时间,日期时间等多种格式,可自定义插件样式。

# 快速使用

## 1.引入必要的CSS文件

```<link rel="stylesheet" type="text/css" href="css/LCalendar.css" />```

## 1.引入必要的JS文件

```<script src="js/LCalendar.js" type="text/javascript"></script>```

## 3.初始化插件

### 示例代码

```
			//初始化日期
			var calendar = new LCalendar();
			calendar.init({
				'trigger' : '#date', //标签ID
				'type' : 'date', //date 调出日期选择
				'minDate' : (new Date().getFullYear() - 5) + '-' + 1 + '-' + 1, //最小日期
				'maxDate' : (new Date().getFullYear() + 5) + '-' + 12 + '-' + 31 //最大日期
			});
			//初始化日期时间
			var calendardatetime = new LCalendar();
			calendardatetime.init({
				'trigger' : '#datetime', //标签ID
				'type' : 'datetime' //datetime 调出日期时间选择
			});
			//初始化时间
			var calendartime = new LCalendar();
			calendartime.init({
				'trigger' : '#time', //标签ID
				'type' : 'time' //time 调出时间选择
			});
			//初始化年月
			var calendarym = new LCalendar();
			calendarym.init({
				'trigger' : '#ym', //标签ID
				'type' : 'ym', //ym 调出年月选择
				'minDate' : '1900-1', //最小年月
				'maxDate' : new Date().getFullYear() + '-' + (new Date().getMonth() + 1) //最大年月
			});
```
		
# 特别说明
详细用法见index.html

