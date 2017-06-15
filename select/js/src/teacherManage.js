$(function(){
	
    /**页面进来之后的三个下拉框大区+校区+专业，从数据库拿来数据复制给大区**/
    var GLOBAL = GLOBAL || {};
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
				// model框中专业下拉框的赋值
				profGiveVal();
				// 查询条件上面大区赋值
				var html = GLOBAL.selectTips;
				for(var i=0;i<bigAreaArray.length;i++){
					html += '<option text="'+bigAreaArray[i].name+'"value="'+ bigAreaArray[i].schoolcode +'">'+  bigAreaArray[i].name  +'</option>'
					$("#bigArea").html(html);
					$("#bigRegion").html(html);
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
	
	/********************************编辑按钮的模态框------开始*************************************/
	/**点击编辑按钮，模态框显示此行的所有数据**/
	window.dictActionEvents = {
         'click #update': function (e, value, row) {
         	    GLOBAL.type = "编辑";
         	    //弹出模态框
	            $('#myModal').modal('show');
            	//ajax加载，得到请求的数据，在成功后加载数据并显示在dialog中
         	    //id赋值
         	    $("#teacherId").html(row.id);
         	    //大区
         	    $("#bigRegion option").removeProp("selected"); //移除属性selected
         	    $("#bigRegion").find("option[text="+row.largeAreaName+"]").prop("selected",true);
         	    //学校
         	    // 根据model框中设置的大区设置学校的内容
         	    changeModelSchool();
         	    $("#school option").removeProp("selected"); //移除属性selected
         	    $("#school").find("option[text="+row.schoolName+"]").prop("selected",true);
	            //专业
	            $("#prof option").removeProp("selected");// 移除属性selected
	            $("#prof").find("option[text="+row.majorName+"]").prop("selected",true);
	            //角色
	            $("#leixing option").removeProp("selected");// 移除属性selected
	            $("#leixing").find("option[text="+row.role+"]").prop("selected",true);
	            //班级
	            $('#banji').val(row.className);
	            //姓名
	            $("#name").val(row.teacherName);
	            /**同时，大区和校区有下拉框的数据**/
	            $("#myModalLabel").text("编辑老师");
         	    
         },
         'click #remove': function (e, value, row) {
            if(confirm("确定要删除吗？")==true){
             	// 删除数据函数
		   		var url = "/SearchServer/deleteEditPageServlet?id="+row.id;
			    $.ajax({
					url: url,
		            type: "get",
					success : function(data) {
						if(data.code==200){
							alert("删除成功");
							refreshTable();
						}else{
							alert(data.msg);
						}
					},
			        error: function (XMLHttpRequest, textStatus, errorThrown) {      
			            alert("请求失败！");
			        }
			   });
			}
        }
     }; 
     //点击编辑按钮的模态框， 根据模态框中设置的大区设置学校的内容
    function changeModelSchool(){
		$("#school").empty();
		var code = $("#bigRegion").find('option:selected').val();
        if(code==""){
            var html='<option value="" text="请选择" selected>请选择</option>';
            $("#school").html(html);
        }else{
            var school = GLOBAL.selectData.schools[code];
            //console.log(GLOBAL.selectData);
            var html='<option value="" text="请选择" selected>请选择</option>';
            for(var i=0;i<school.length;i++){
                html += '<option value="'+ school[i].schID +'" text="'+ school[i].sch+""+'">'+  school[i].sch  +'</option>';
                /**弹出框的下拉框赋值**/
                $("#school").html(html);
            }
        }
	}
    
    /**"编辑"下边的模态框的大区下拉框点击事件，校区的下拉框的数据会跟着变化**/
    $("#bigRegion").change(function(){
    	changeModelSchool();
    });    
    
	//判断输入的字符是否满足要求
	function isMatch() {
		var user = $("#name").val();
		var patten = new RegExp("^([\u4E00-\u9FA5]{2,5})$");
		return patten.test(user);
	}
    /***点击编辑的模态框的提交按钮**/
    function updateAndAddSubm(){
    	//校验大区是否为空
    	var blankSel = $("#bigRegion").find("option:selected").text()=="请选择";
        if (blankSel){
        	alert("请选择大区");
        	return;
        }
        //学校的验证
    	var blankSchool = $("#school").find("option:selected").text()=="请选择";
        if (blankSchool){
        	alert("请选择学校");
        	return;
        }
    	//专业的验证
    	var blankProfession = $("#prof").find("option:selected").text()=="请选择";
        if (blankProfession){
        	alert("请选择专业");
        	return;
        }
        //角色的验证
        var blankLeixing = $("#leixing").find("option:selected").text()=="请选择";
        if (blankLeixing){
        	alert("请选择角色");
        	return;
        }
        //姓名的验证&&非法字符和长度
        var blankname = $("#name").val()=="";
        if (blankname){
        	alert("请填写老师姓名");
        	return;
        }
        if(!isMatch()){
        	alert("请填写2-5个中文字符");
        	return;	
        }
        //班级的验证
        var blankClass = $("#banji").val()=="";
        if (blankClass){
        	alert("请填写班级名称");
        	return;
        }
        var _url = "";
        var _data = {};
        if(GLOBAL.type == "编辑"){
        	_url = "/SearchServer/updateEditInfoServlet";
	   		_data = {
				id: $("#teacherId").html(),
				newSchoolName: $("#school").find('option:selected').html().trim(), 	//学校
				newTeacherName: $('#name').val().trim(),  							//新姓名
				newClassName: $('#banji').val().trim(),    							//新班级
				newRole: $('#leixing').find('option:selected').html().trim(), 		//新类型
				newMajorName: $('#prof').find('option:selected').html().trim(), 	//新专业
			};
        }else{
        	_url = "/SearchServer/editPageInsertServlet";
        	_data = {
            	schoolName: $('#school').find('option:selected').text(),
				role: $('#leixing').find('option:selected').text(),
				majorName: $('#prof').find('option:selected').text(),
				teacherName: $('#name').val(),
				className: $('#banji').val()
            };
        }
	    $.ajax({
			url: _url,
            type: "post",
            data: _data,
			success : function(data) {
				if(data.code==200){
					alert(data.msg);
					refreshTable();
					$('#myModal').modal('hide');
				}else{
					alert(data.msg);
				}
			},
	        error: function (XMLHttpRequest, textStatus, errorThrown) {      
	            alert("请求失败！");
	        }
	   });	
    }
    // 新增按钮事件
    $("#btnAdd").click(function(){
    	GLOBAL.type = "新增";
    	$('#myModal').modal('show');
		var pleaseText = "请选择";
    	// 大区
        $("#bigRegion option").removeProp("selected");
 	    $("#bigRegion").find("option[text="+pleaseText+"]").prop("selected",true);
 	    
 	    //学校
		// 根据model框中设置的大区设置学校的内容
		changeModelSchool();
		$("#school option").removeProp("selected"); //移除属性selected
		$("#school").find("option[text="+pleaseText+"]").prop("selected",true);
		
        // 专业
		$("#prof option").removeProp("selected");// 移除属性selected
		$("#prof").find("option[text="+pleaseText+"]").prop("selected",true);
        
        //角色
		$("#leixing option").removeProp("selected");// 移除属性selected
		$("#leixing").find("option[text="+pleaseText+"]").prop("selected",true);
		
        // 班级
        $('#banji').val("");
        // 姓名
        $("#name").val("");
        $("#myModalLabel").text("新增老师");
		
    });
    /**点击提交按钮上传数据**/
     $("#subm").click(function(){
     	updateAndAddSubm();	
    }) 
   
    //加载等待图片
	function hideModal(){
		$('#loadingImg').modal('hide');
	}
	function showModal(){
		$('#loadingImg').modal({backdrop:'static',keyboard:false});
	}	
    //加载数据过程中的ui样式
    function actionFormatter(value) {
         return [
             '<button id="update"  class="btn btn-success btn-xs rightSize detailBtn" type="button"><i class="fa fa-edit"></i> 编辑</button>',
             '<button id="remove" class="btn btn-danger btn-xs rightSize packageBtn" style="margin-left: 2px;" type="button"><i class="glyphicon glyphicon-remove"></i> 删除</button>'
         ].join('');
	}
    
    // 通过ajax 获取当前查询条件最新的数据
    function refreshTable(){
		var blankbigArea = $("#bigArea").find("option:selected").text()=="请选择";
    	var blankSchool = $("#schools").find("option:selected").text()=="请选择";
    	var blankProfession = $("#profession").find("option:selected").text()=="请选择";
    	if(blankbigArea){
    		alert("请选择大区!");
            return;
    	}else if (blankSchool){
    		alert("请选择学校!");
            return;
    	}/*else if (blankProfession){
    		alert("请选择专业!");
            return;
    	}*/
    	var largeName=$("#bigArea").find('option:selected').html()=="请选择"?"":$("#bigArea").find('option:selected').html();
		var schoolName=$("#schools").find('option:selected').html()=="请选择"?"":$("#schools").find('option:selected').html();
		var majorName=$("#profession").find('option:selected').html()=="请选择"?"":$("#profession").find('option:selected').html();
		var roleLevel=$("#jueSe").find('option:selected').html()=="请选择"?"":$("#jueSe").find('option:selected').html();
 		var _url = "/SearchServer/editPageServlet?largeName="+largeName+"&schoolName="+schoolName+"&majorName="+majorName+"&roleLevel="+roleLevel+"&r="+Math.random();
		_url = encodeURI(_url);
		$.ajax({
			url: _url,
			type: "get",
			beforeSend:function (){
				showModal();
			},
			success: function(data){
				if(data.code == 200){
					if(data.results.length>0){
						$('#tb_departments').bootstrapTable('load', data.results);
					}else{
						$('#tb_departments').bootstrapTable('load', []);
					}
				}else{
					alert(data.msg);
				}
				hideModal();
			},
			error: function(err){
				alert("网络错误");
				$('#tb_departments').bootstrapTable('load', []);
				hideModal();
			}
		});
	}
    
    // 查询按钮
	$("#searchBtn").click(refreshTable);
    // 初始化table
	$('#tb_departments').bootstrapTable({
		dataType: "json",
		showRefresh: false,//刷新按钮
        showToggle: false, // 切换视图
        showColumns: false,//列选择按钮
        buttonsAlign: "left",//按钮对齐方式
	    cache: false, 	// 不缓存
	    height: 555, 	// 设置高度，会启用固定表头的特性
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
    		field: 'id',
    		width: 100,
    		align: 'center',
    		valign: 'middle',
    		title: "id"
        },{
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
            field: 'role',
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
            valign: 'middle',
        },{
        	field: 'operate',
        	width: 100,
            title: '操作',
            align: 'center',
            valign: 'middle',
            events: dictActionEvents,
            formatter: actionFormatter
        }],
        data: []
	});
});