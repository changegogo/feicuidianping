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
				var html = GLOBAL.selectTips;
				profGiveVal();
				for(var i=0;i<bigAreaArray.length;i++){
					html += '<option text="'+bigAreaArray[i].name+'"value="'+ bigAreaArray[i].schoolcode +'">'+  bigAreaArray[i].name  +'</option>'
					$("#bigArea").html(html);
					$("#bigRegion").html(html);
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
	//当点击学校时，申请每个专业的所数据，并赋值给专业的下来框
	/*$("#schools").change(function(){
		if($("#schools").find('option:selected').val()==""){
			return;
		}
		$("#profession").empty();
		var text = $("#schools").find('option:selected').attr("text");
		var arr = text.split(",");
		var subjects = GLOBAL.selectData.subject;
		var schools = GLOBAL.selectData.schools;
		var html=GLOBAL.selectTips;
		for(var i=0;i<arr.length;i++){
			html += '<option value="'+ i +'">'+ subjects[arr[i]]  +'</option>';
			$("#profession").html(html);
		}
	});	*/
	
	/********************************编辑按钮的模态框------开始*************************************/
	/**点击编辑按钮**/
	window.dictActionEvents = {
         'click #update': function (e, value, row) {
         	    GLOBAL.row = row ;
         	    GLOBAL.type = "编辑";
         	    //ajax加载，得到请求的数据，在成功后加载数据并显示在dialog中
         	    //id赋值
         	    $("#teacherId").html(row.id);
         	    //大区
         	    /*$("#bigRegion option").removeAttr("selected");*/ //移除属性selected
         	    $("#bigRegion").find("option[text="+row.largeAreaName+"]").attr("selected",true);
         	    //学校
         	    //$("#school").find("option[txt="+row.schoolName+"]").attr("selected",true);
         	    changeModelSchool();
         	    $("#school").find("option:selected").html(row.schoolName);
	            //专业
	            /*$("#prof option").removeAttr("selected");*////移除属性selected
	            $("#prof").find("option[text="+row.majorName+"]").attr("selected",true);
	            //角色
	            $("#leixing").find("option[text="+row.role+"]").attr("selected",true);
	            //班级
	            $('#banji').val(row.className);
	            //姓名
	            $("#name").val(row.teacherName);
	            //弹出模态框
	            $('#myModal').modal('show');
	            /**同时，大区和校区有下拉框的数据**/
	            $("#myModalLabel").text("编辑");    
         },/**点击删除按钮**/
         'click #remove': function (e, value, row) {
            if(confirm("确定要删除吗？")==true){
             	/**删除数据函数**/
			   		var url = "/SearchServer/deleteEditPageServlet?id="+row.id;
				    $.ajax({
						url: url,
			            type: "get",
						success : function(data) {
							if(data.code==200){
								alert(data.msg);
								$("#tb_departments").bootstrapTable('refresh');
							}else{
								alert(data.msg);
								/*alert("删除失败");*/
							}
						},
				        error: function (XMLHttpRequest, textStatus, errorThrown) {      
				            alert("请求失败！");
				        }
				   });
			}
        }
     }; 
    function changeModelSchool(){
		$("#school").empty();
		var code = $("#bigRegion").find('option:selected').val();
        if(code==""){
            var html='<option value="" txt="请选择" selected>请选择</option>';
            $("#school").html(html);
        }else{
            var school = GLOBAL.selectData.schools[code];
            var html='<option value="" txt="请选择" text="请选择" selected>请选择</option>';
            for(var i=0;i<school.length;i++){
                html += '<option txt="'+school[i].sch+'"value="'+ school[i].schID +'" text="'+ school[i].subcode+""+'">'+  school[i].sch  +'</option>';
                /**弹出框的下拉框赋值**/
                $("#school").html(html);
            }
        }
	}
    /**"编辑"下边的模态框的大区下拉框点击事件，校区的下拉框的数据会跟着变化**/
    $("#bigRegion").change(function(){
    	changeModelSchool();
    });    
    /**“编辑按钮”的模态框中的专业下拉框的赋值**/
    function profGiveVal(){
		var subjects = GLOBAL.selectData.subject;
		console.log(GLOBAL.selectData);
		//var html=GLOBAL.selectTips;
		var html = '<option value="" text="请选择" selected>请选择</option>';
		for(var i=0;i<subjects.length;i++){
			html += '<option text="'+subjects[i]+'"value="">'+ subjects[i]  +'</option>';
			$("#prof").html(html);
		}
	}
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
				id: Number.parseInt($("#teacherId").html()),
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
					$("#tb_departments").bootstrapTable('refresh');
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
    /********************************编辑按钮的模态框------结束*************************************/
    /**新增按钮**/
    $("#btnAdd").click(function(){
    	
    	GLOBAL.type = "新增";
        $("#myModalLabel").text("新增");
        var pleaseTxt = '请选择';
    	// 大区
     /*   $("#bigRegion").find("option").removeAttr("selected");*/
 	    $("#bigRegion").find("option[text="+pleaseTxt+"]").attr("selected",true);
 	    $("#bigRegion option").attr("selected",false);
 	    // 学校
 	    $("#school").empty();
 	    var html = '<option value="" txt="请选择" selected>请选择</option>';
 	    $("#school").html(html);
        // 专业
         $("#prof").find("option[text="+pleaseTxt+"]").attr("selected",true);
         $("#prof option").attr("selected",false);
        // 类型
        /*$("#leixing").find("option").removeAttr("selected");*/
        $("#leixing").find("option[text="+pleaseTxt+"]").attr("selected",true);
        $("#leixing option").attr("selected",false);
        // 班级
        $('#banji').val("");
        // 姓名
        $("#name").val("");
        $('#myModal').modal('show');
    });
    /**点击提交按钮上传数据**/
     $("#subm").click(function(){
     	updateAndAddSubm();	
    })
    /********************************新增按钮-----结束*************************************************/
    /********************************点击查询按钮----开始***************************************************/
    $("#search").click(function(){
    	/*var blankbigArea = $("#bigArea").find("option:selected").text()=="请选择";
    	var blankSchool = $("#schools").find("option:selected").text()=="请选择";
    	var blankProfession = $("#profession").find("option:selected").text()=="请选择";
    	if(blankbigArea){
    		alert("请选择大区!");
            return;
    	}else if (blankSchool){
    		alert("请选择学校!");
            return;
    	}else if (blankProfession){
    		alert("请选择专业!");
            return;
    	}*/
    	$("#tb_departments").bootstrapTable('refresh');
    });
    /********************************点击查询按钮----结束***************************************************/
   
   
   
    /*******************************初始化bootstraptable -----开始************************************/
    function actionFormatter(value) {
         return [
             '<button id="update"  class="btn btn-info btn-sm rightSize detailBtn" type="button"><i class="fa fa-paste"></i> 编辑</button>',
             '<button id="remove" class="btn btn-danger btn-sm rightSize packageBtn" type="button"><i class="fa fa-envelope"></i> 删除</button>'
         ].join('');
	}				
	/**bootstraptable 点击查询按钮，加载数据并显示在table表格里**/
    function initTable() {
      $('#tb_departments').bootstrapTable({
            url: "/SearchServer/editPageServlet",	//数据源
            dataField: "results",					
            sidePagination: "server",				//服务端分页
            contentType: "application/json",		//请求数据内容格式 默认是 application/json
            dataType: "json",						//期待返回数据类型
            method: "get",							//请求方式
            height: 360,
            cache: false,
            queryParamsType: "limit",				//查询参数组织方式
            queryParams: function getParams(params) {
            	params.largeName=$("#bigArea").find('option:selected').html()=="请选择"?"":$("#bigArea").find('option:selected').html();
				params.schoolName=$("#schools").find('option:selected').html()=="请选择"?"":$("#schools").find('option:selected').html();
				params.majorName=$("#profession").find('option:selected').html()=="请选择"?"":$("#profession").find('option:selected').html();
				params.roleLevel=$("#jueSe").find('option:selected').html()=="请选择"?"":$("#jueSe").find('option:selected').html();
                console.log(params);
                return params;
            },
            showToggle: false,
            showRefresh: true,//刷新按钮
            showColumns: true,//列选择按钮
            buttonsAlign: "left",//按钮对齐方式
            toolbar: "#toolbar",//指定工具栏
            toolbarAlign: "right",//工具栏对齐方式
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
                title: '老师类型',
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
            	width: 200,
	            title: '操作',
	            align: 'center',
	            valign: 'middle',
	            events: dictActionEvents,
	            formatter: actionFormatter
            }]
        });
    }
    initTable();
});