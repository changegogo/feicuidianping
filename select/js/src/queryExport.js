$(function(){
	//加载等待图片
	function hideModal(){
		$('#myModal').modal('hide');
	}
	function showModal(){
		$('#myModal').modal({backdrop:'static',keyboard:false});
	}
	/**页面进来之后的三个下拉框大区+校区+专业，从数据库拿来数据复制给大区**/
    var GLOBAL = GLOBAL || {};
	//预置字符串
    GLOBAL.selectTips= '<option value="" text="请选择">请选择</option>';
    var url = "../recentServlet";
    $.ajax({
		url: url,
        type: "get",
		success : function(data) {
			if(data.code==200){
				GLOBAL.selectData = data.results;
				var bigAreaArray = data.results.bigarea;
				// model框中专业下拉框的赋值
				profGiveVal();
				// 查询条件上面大区赋值
				var html = GLOBAL.selectTips;
				for(var i=0;i<bigAreaArray.length;i++){
					html += '<option text="'+bigAreaArray[i].name+'"value="'+ bigAreaArray[i].schoolcode +'">'+  bigAreaArray[i].name  +'</option>'
					$("#bigArea").html(html);
					
				}
                // 查询条件上面专业赋值
                var html = GLOBAL.selectTips;
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
     
    // model框中专业下拉框的赋值
    function profGiveVal(){
		var subjects = GLOBAL.selectData.subject;
		var html = '<option text="请选择" value="" selected>请选择</option>';
		for(var i=0;i<subjects.length;i++){
			html += '<option text="'+subjects[i]+'"value="'+i+'">'+ subjects[i] +'</option>';
			$("#prof").html(html);
		}
	}
     
    // 查询条件出 当点击大区时，申请每个大区的所有学校的数据，并赋值给学校的下来框
	$("#bigArea").change(function(){
		var code = $("#bigArea").find('option:selected').val();
		// 查询条件上面的学校下拉框清空
		$("#schools").empty();
        if(code == ""){
            var html='<option value="" txt="请选择" selected>请选择</option>';
            $("#schools").html(html);
        }else{
            var schools = GLOBAL.selectData.schools[code];
            var html='<option value="" text="请选择" selected>请选择</option>';
            for(var i=0;i<schools.length;i++){
                //html += '<option txt="'+schools[i].sch+'"value="'+ schools[i].schID +'" text="'+ schools[i].subcode+""+'">'+  schools[i].sch  +'</option>';
                html += '<option value="'+ schools[i].schID +'" text="'+ schools[i].sch+""+'">'+  schools[i].sch  +'</option>';
                /**默认下来框的赋值**/
                $("#schools").html(html);
            }
        }
	});
		
	// 查询按钮
	$("#searchBtn").click(function(){
		var startDate = $("#startDate").val();
		if( startDate== ""){
			alert("请输入起始日期");
			return;
		}
		var endDate = $("#endDate").val();
		if(endDate == ""){
			alert("请输入结束日期");
			return;
		}
		if( Date.parse(new Date(startDate)) > Date.parse(new Date(endDate)) ){
			alert("起始日期不能大于结束日期");
			return;
		}
		
		var conditionData = {
    		largeArea :$("#bigArea").find('option:selected').html(),
			schName : $("#schools").find('option:selected').html(),
			cusName : $("#profession").find('option:selected').html(),
			role : $("#role").find('option:selected').html(),
				startDate : startDate,
				endDate : endDate
        };
 
		$.ajax({
			url: "../selectServlet",
			type: "post",
			data: {
				name: JSON.stringify(conditionData)
			},
			beforeSend:function (){
				showModal();
			},
			success: function(data){
				if(data.code == 200){
					if(data.selectInfo.length>0){
						//$("#export").show();
					}else{
						//$("#export").hide();
					}
					$('#tb_departments').bootstrapTable('load', data.selectInfo);
					hideModal();
				}else{
					alert(data.msg);
					hideModal();
				}
			},
			error: function(err){
				alert("网络错误");
				$('#tb_departments').bootstrapTable('load', []);
				hideModal();
			}
		});
	});
	
	$("#exportli").click(function(){
		if(confirm("确定导出表格")){
			var conditionData = {
				largeArea : $("#bigArea").find('option:selected').html(),
				schName : $("#schools").find('option:selected').html(),
				cusName : $("#profession").find('option:selected').html(),
				role : $("#role").find('option:selected').html(),
				startDate : $("#startDate").val()==""?"":$("#startDate").val(),
				endDate : $("#endDate").val()==""?"":$("#endDate").val()
	        };
	        var url = "../ExportssServlet";
			$.ajax({
				async : false,
				method : "get",
				traditional : false,
				data : {
					name : JSON.stringify(conditionData)
				},
				url : url,
				success : function(data) {
					// alert(data);
					if (data == "当前导出无结果！") {
						alert(data);
						return;
					} else {
						//location.href = "/SearchServer/xlsx/" + data;
						location.href = 'http://tp.feicuiedu.com:8081/WebRoot1/xlsx/' + data;
					}
				},
				error : function(err) {
					alert('error');
				}
			});
		}
	})
	// 初始化table
	$('#tb_departments').bootstrapTable({
		dataType: "json",
		showRefresh: false,//刷新按钮
        showToggle: false, // 切换视图
        showColumns: false,//列选择按钮
        buttonsAlign: "left",//按钮对齐方式
        toolbar: "#toolbar",
        toolbarAlign: "left",
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
		columns: [{
			field: 'large_Area',
			align: 'center',
    		valign: 'middle',
    		title: "大区"
		},{
    		field: 'sch_Name',
    		align: 'center',
    		valign: 'middle',
    		title: "校区"
        },{
    		field: 'tea_Name',
    		align: 'center',
    		valign: 'middle',
    		title: "教师姓名"
        },{
    		field: 'role_Level',
    		align: 'center',
    		valign: 'middle',
    		title: "角色"
        },{
    		field: 'cus_Name',
    		align: 'center',
    		valign: 'middle',
    		title: "专业"
        },{
    		field: 'stu_Class',
    		align: 'center',
    		valign: 'middle',
    		title: "班级"
        },{
    		field: 'peopleCount',
    		align: 'center',
    		valign: 'middle',
    		title: "投票人数"
        },{
    		field: 'average',
    		align: 'center',
    		valign: 'middle',
    		title: "平均分"
        },{
    		field: 'fill_Date',
    		align: 'center',
    		valign: 'middle',
    		title: "月份"
        }],
        data: []
	});
});