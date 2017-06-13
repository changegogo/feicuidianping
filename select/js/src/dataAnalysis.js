$(function(){
	// 全局变量
	var GLOBAL = GLOBAL || {};
	
	/**页面进来之后的三个下拉框大区+校区+专业，从数据库拿来数据复制给大区**/
    //预置字符串
    GLOBAL.selectTips= '<option value="" text="请选择">请选择</option>';
    var url = "/SearchServer/recentServlet";
    $.ajax({
		url: url,
        type: "get",
		success : function(data) {
			if(data.code==200){
				GLOBAL.selectData = data.results;
				var bigAreaArray = data.results.bigarea;
				var html = GLOBAL.selectTips;
				for(var i=0;i<bigAreaArray.length;i++){
					html += '<option text="'+bigAreaArray[i].name+'"value="'+ bigAreaArray[i].schoolcode +'">'+  bigAreaArray[i].name  +'</option>'
					$("#bigArea").html(html);
				}
                // 专业赋值
                var html=GLOBAL.selectTips;
                for(var i=0;i<GLOBAL.selectData.subject.length;i++){
                    html += '<option value="'+ i +'">'+ GLOBAL.selectData.subject[i]  +'</option>';
                    $("#profession").html(html);
                }	
			}else{
				alert('没有数据');
			}
		},
        error: function (XMLHttpRequest, textStatus, errorThrown) {      
            alert("请求失败！");
        }
     });
     
    //当点击大区时，申请每个大区的所有学校的数据，并赋值给学校的下来框
	$("#bigArea").change(function(){
		$("#schools").empty();
		var code = $("#bigArea").find('option:selected').val();
        if(code == ""){
            var html='<option value="" txt="请选择" selected>请选择</option>';
            $("#schools").html(html);
        }else{
            var schools = GLOBAL.selectData.schools[code];
            var html='<option value="" txt="请选择" selected>请选择</option>';
            for(var i=0;i<schools.length;i++){
                html += '<option txt="'+schools[i].sch+'"value="'+ schools[i].schID +'" text="'+ schools[i].subcode+""+'">'+  schools[i].sch  +'</option>';
                /**默认下来框的赋值**/
                $("#schools").html(html);
            }
        }
		
	});	
	// 折线图初始化
	GLOBAL.zxOption = {
	    title: {
	        text: '学校专业'
	    },
	    tooltip: {
	        trigger: 'item'
	    },
	    legend: {
	        data:[/*'张三','李思思'*/],
	        top: "6%"
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [
	        /*{
	            name:'张三',
	            type:'line',
	            data:[0, 1, 2, 3, 4, 5, 5, 5, 5, 4, 3, 2]
	        },
	        {
	            name:'李思思',
	            type:'line',
	            data:[5, 5, 4, 3, 2, 1, 0, 4, 3, 2, 1, 4]
	        }*/
	    ]
	};
	GLOBAL.zxChart = echarts.init(document.getElementById('zxChart'));
    // 使用刚指定的配置项和数据显示图表
    GLOBAL.zxChart.setOption(GLOBAL.zxOption);
    
    // 雷达图初始化
    GLOBAL.ldOption = {
	    title: {
	        text: 'XXX'
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    legend: {
	        data: ['']
	    },
	    radar: {
	        indicator: [
	           { name: '', max: 5},
	           { name: '', max: 5},
	           { name: '', max: 5},
	           { name: '', max: 5},
	           { name: '', max: 5},
	           { name: '', max: 5},
	           { name: '', max: 5},
	           { name: '', max: 5},
	           { name: '', max: 5},
	           { name: '', max: 5}
	        ]
	    },
	    series: [{
	        name: '分布',
	        type: 'radar',
	        areaStyle: {normal: {}},
	        data : [
	            /*{
	                value : [3, 3, 3, 3.5, 3, 3, 3, 3, 3, 3.5],
	                name : '张三'
	            }*/
	        ]
	    }]
	};
    GLOBAL.ldChart = echarts.init(document.getElementById('ldChart'));
    // 使用刚指定的配置项和数据显示图表
    GLOBAL.ldChart.setOption(GLOBAL.ldOption);
    // 查询按钮的点击事件,更新折线图内容
    $("#searchBtn").on('click', function(){
    	$('#searchBtn').attr('disabled', true);
    	// 点击之后获取查询条件数据
    	GLOBAL.bigArea = $("#bigArea").find('option:selected').html();
    	GLOBAL.school = $("#schools").find('option:selected').html();
    	GLOBAL.subject = $("#profession").find('option:selected').html();
    	GLOBAL.role = $("#role").val();
    	GLOBAL.year = "2017";
    	// 非空校验
    	if(GLOBAL.bigArea=="请选择"){
    		alert("请选择大区");
    		$('#searchBtn').attr('disabled', false);
    		return;
    	}
    	if(GLOBAL.school=="请选择"){
    		alert("请选择学校");
    		$('#searchBtn').attr('disabled', false);
    		return;
    	}
    	if(GLOBAL.subject=="请选择"){
    		alert("请选择专业");
    		$('#searchBtn').attr('disabled', false);
    		return;
    	}
    	if(GLOBAL.role==""){
    		alert("请选择角色");
    		$('#searchBtn').attr('disabled', false);
    		return;
    	}
    	if(GLOBAL.year=="请选择"){
    		alert("请选择年份");
    		$('#searchBtn').attr('disabled', false);
    		return;
    	}
    	var _url = "/SearchServer/brokenLineServlet?largeArea="+GLOBAL.bigArea+"&school="+GLOBAL.school+"&major="+GLOBAL.subject+"&role="+GLOBAL.role;
    	_url = encodeURI(_url);
    	$.ajax({
    		type:"get",
    		url: _url,
    		async:true,
    		success: function(data){
    			$('#searchBtn').attr('disabled', false);
    			if(data.code != 200){
	    			alert(data.msg);
	    			return;
	    		}
	    		// 组装数据
	    		var teachers = data.result.teachers;
	    		if(teachers.length <= 0){
	    			alert("还没有数据");
	    			return;
	    		}
	    		GLOBAL.zxOption.title.text = GLOBAL.school+GLOBAL.subject;
	    		GLOBAL.zxOption.xAxis.data = data.result.xAxis;
	    		GLOBAL.zxOption.legend.data.splice(0,GLOBAL.zxOption.legend.data.length);
	    		GLOBAL.zxOption.series.splice(0,GLOBAL.zxOption.series.length);
	    		for(var i=0;i<teachers.length;i++){
	    			GLOBAL.zxOption.legend.data[i] = teachers[i].name;
	    			// 将后台数据中的-1改为""
	    			for(var n=0;n<teachers[i].scores.length;n++){
	    				if(teachers[i].scores[n]==-1){
	    					teachers[i].scores[n] = "";
	    				}else{
	    					teachers[i].scores[n] = teachers[i].scores[n];
	    				}
	    			}
	    			var item = {
	    				name: teachers[i].name,
	    				type: "line",
	    				data: teachers[i].scores
	    			};
	    			GLOBAL.zxOption.series[i] = item;
	    		}
	    		GLOBAL.zxChart.clear();
	    		GLOBAL.zxChart.setOption(GLOBAL.zxOption);
    		},
    		error: function(err){
    			alert("请求失败");
    			$('#searchBtn').attr('disabled', false);
    		}
    	});
    });
    /*
     * 讲师题目
     * 班主任题目
     * 就业题目
     * 在线老师题目
     * */
    GLOBAL.titles = [
    	["老师出勤情况","项目讲解","培训提问","培训期间回答培训生问题","老师指导","把握培训纪律","老师讲解技巧","培训进度","实例讲解","培训后作品"],
    	["班主任出勤情况","关心程度","巡堂","找学员沟通","缺勤关注","班级纪律","受理投诉","组织活动","资料的及时收发","整体工作评分"],
    	["企业信息发布","企业宣讲","行业宣讲","学员活动","职业素养课程","学员沟通","简历撰写指导","模拟面试","就业服务","整体工作评分"],
    	["老师出勤情况789","项目讲解","培训提问","培训期间回答培训生问题","老师指导","把握培训纪律","老师讲解技巧","培训进度","实例讲解","培训后作品"]
    ];
    // 折线图点击事件,更新雷达图内容
    GLOBAL.zxChart.on('click', function (params) {
    	console.log(params);
	    // 月份
	    var month = params.name;
	    var mon  = month.replace(/月/,"");
	    if(mon.length == 1){
	    	mon = "0"+mon;
	    }
	    // 姓名
	    var name = params.seriesName;
  		var _url = "/SearchServer/radarServlet?largeArea="+GLOBAL.bigArea+"&school="+GLOBAL.school+"&name="+name+"&major="+GLOBAL.subject+"&year=2017"+"&month="+mon+"&role="+GLOBAL.role;
	    _url = encodeURI(_url);
	    $.ajax({
	    	url: _url,
	    	type: "get",
	    	success: function(data){
	    		if(data.code != 200){
		    		return;
		    	}
		    	//雷达图的顶部信息
		    	GLOBAL.ldOption.title.text = name+" "+month+"评分分布";
		    	GLOBAL.ldOption.radar.indicator.splice(0,GLOBAL.ldOption.radar.indicator.length);
		    	//if(GLOBAL.role==0){
		    		for(var i=0; i<GLOBAL.titles[GLOBAL.role].length; i++){
		    			var item = {
		    				name: GLOBAL.titles[GLOBAL.role][i],
		    				max: 5
		    			};
		    			GLOBAL.ldOption.radar.indicator[i] = item;
		    		}
		    	//}
		    	GLOBAL.ldOption.series[0].data[0] = {
		    		value: data.result.scores,
		    		name: name
		    	};
		    	GLOBAL.ldChart.clear();
		    	GLOBAL.ldChart.setOption(GLOBAL.ldOption);
	    	},
	    	error: function(){
	    		alert("error");
	    	}
	    });
	});
});
