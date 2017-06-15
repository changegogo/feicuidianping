$(function(){
    /**页面进来之后的三个下拉框大区+校区+专业，从数据库拿来数据复制给大区**/
    var url = "/SearchServer/recentServlet";
    var GLOBAL = GLOBAL || {};
    //预置字符串
    GLOBAL.selectTips= '<option value="" text="请选择" selected>请选择</option>';
    $.ajax({
		url: url,
        type: "get",
		success : function(data) {
			if(data.code==200){
				GLOBAL.selectData = data.results;
				var bigAreaArray = data.results.bigarea;
				var html=GLOBAL.selectTips;
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
	
    $("#search").click(function(){
    	/*var blankbigArea = $("#bigArea").find("option:selected").text()=="请选择";
    	var blankSchool = $("#schools").find("option:selected").text()=="请选择";
    	var blankProfession = $("#profession").find("option:selected").text()=="请选择";
        var blankRole = $("#role").find("option:selected").text()=="请选择";
    	if(blankbigArea){
    		alert("请选择大区!");
    	}else if (blankSchool){
    		alert("请选择学校!");
    	}else if (blankProfession){
    		alert("请选择专业!");
    	}else if(blankRole){
            alert("请选择角色!");
        }*/
    	/**日期为空的校验**/
    	var startDate = $("#startDate").val();
    	var endtDate = $("#endDate").val();
    	if (startDate == "") { //验证用户名是否为空
			alert("请输入起始日期！");
			$("#startDate").focus();
			return false;
		}
		if (endtDate == "") { //验证密码是否为空
			alert("请输入结束日期！");
			$("#endtDate").focus();
			return false;
		}
		
		var largeName = $("#bigArea").find('option:selected').html()=="请选择"?"":$("#bigArea").find('option:selected').html();
        var schoolName = $("#schools").find('option:selected').html()=="请选择"?"":$("#schools").find('option:selected').html();
        var majorName = $("#profession").find('option:selected').html()=="请选择"?"":$("#profession").find('option:selected').html();
        var roleLevel = $("#role").find('option:selected').html()=="请选择"?"":$("#role").find('option:selected').html();
        var startDate = $("#startDate").val()==""?"":$("#startDate").val();
        var endDate = $("#endDate").val()==""?"":$("#endDate").val();
		var _url = "/SearchServer/exceptionBeanServlet?largeName="+largeName+"&schoolName="+schoolName+"&majorName="+majorName+"&roleLevel="+roleLevel+"&startDate="+startDate+"&endDate="+endDate;
		_url = encodeURI(_url);
		$.ajax({
			url: _url,
			type: "get",
			success: function(data){
				if(data.code == 200){
					$('#tb_departments').bootstrapTable('load', data.results);
				}else{
					alert(data.msg);
				}
			},
			error: function(err){
				alert("网络错误");
				$('#tb_departments').bootstrapTable('load', []);
			}
		});
    });	
    // 初始化table
	$('#tb_departments').bootstrapTable({
		dataType: "json",
	    cache: false, 	// 不缓存
	    height: 535, 	// 设置高度，会启用固定表头的特性
	    striped: true, 	// 隔行加亮
	    //是否显示分页（*） 
		pagination: true,
		pageList: [10, 25, 50, 100, 'All'],
		//分页方式：client客户端分页，server服务端分页（*）
		sidePagination: "client",
		//是否显示搜索
		search: true,
		searchAlign: "left",
		// 导出excel
		showExport: true,
		exportDataType: "all",
		exportTypes: ['excel'],
		exportOptions: {
	        fileName: '评分异常数据'
	    },
	    showRefresh: false,//刷新按钮
        showToggle: false, // 切换视图
        showColumns: false,//列选择按钮
        buttonsAlign: "left",//按钮对齐方式
		columns: [{
            field: 'largeAreaName',
            width: 100,
            align: 'center',
            valign: 'middle',
            title: "大区"
        }, {
            field: 'schoolName',
            width: 100,
            title: '学校',
            align: 'center',
            valign: 'middle',
        },{
            field: 'majorName',
            width: 100,
            title: '专业',
            align: 'center',
            valign: 'middle',
        },{
            field: 'roleLevel',
            width: 100,
            title: '角色',
            align: 'center',
            valign: 'middle',
        },{
            field: 'teacherName',
            width: 100,
            align: 'center',
            valign: 'middle',
            title: "姓名"
        },{
            field: 'className',
            width: 100,
            title: '班级名',
            align: 'center',
            valign: 'middle'
        },{
            field: 'userNick',
            width: 100,
            align: 'center',
            valign: 'middle',
            title: "微信昵称",
            formatter: function(value, row, index){
            	return "<div style='width:100px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;' title="+value+">"+value+"</div>";
            }
        },{
            field: 'average',
            width: 100,
            title: '分数',
            align: 'center',
            valign: 'middle'
        },{
            field: 'advice',
            title: '建议',
            width: 100,
            align: 'center',
            valign: 'middle',
            formatter: function(value, row, index){
            	return "<div style='width:100px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;' title="+value+">"+value+"</div>";
            }
        },{
            field: 'fillDate',
            width: 100,
            title: '月份',
            align: 'center',
            valign: 'middle'
        }],
        data: []
	});
});