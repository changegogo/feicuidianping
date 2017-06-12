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
		var schools = GLOBAL.selectData.schools[code];
		var html='<option value="" txt="请选择" selected>请选择</option>';
		for(var i=0;i<schools.length;i++){
			html += '<option txt="'+schools[i].sch+'"value="'+ schools[i].schID +'" text="'+ schools[i].subcode+""+'">'+  schools[i].sch  +'</option>';
			/**默认下来框的赋值**/
			$("#schools").html(html);
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
			html += '<option value="'+ schools[i].schID +'">'+ subjects[arr[i]]  +'</option>';
			$("#profession").html(html);
		}
	});*/	
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
		/**刷新table表格**/
    	$("#tb_departments").bootstrapTable('refresh');
    });	
    function initTable() {
          $('#tb_departments').bootstrapTable({
            url: '/SearchServer/exceptionBeanServlet',
            method: 'get',
            height: 535,
            dataField: 'results',
            sidePagination: "server",//服务端分页
            showColumns: true,
            showRefresh: true,
            showToggle: true,
            buttonsAlign: "left",//按钮对齐方式
            toolbar: "#toolbar",//指定工具栏
            toolbarAlign: "right",//工具栏对齐方式
            showColumns: true,//列选择按钮
            showExport: true,
			exportDataType: "basic",
			exportTypes: ['excel'],
			exportOptions: {
		        fileName: '评分异常数据'
		    },
            queryParams: function getParams(params) {
                params.largeName = $("#bigArea").find('option:selected').html()=="请选择"?"":$("#bigArea").find('option:selected').html();
                params.schoolName = $("#schools").find('option:selected').html()=="请选择"?"":$("#schools").find('option:selected').html();
                params.majorName = $("#profession").find('option:selected').html()=="请选择"?"":$("#profession").find('option:selected').html();
                params.roleLevel = $("#role").find('option:selected').html()=="请选择"?"":$("#role").find('option:selected').html();
                params.startDate = $("#startDate").val()==""?"":$("#startDate").val();
                params.endDate = $("#endDate").val()==""?"":$("#endDate").val();
                //console.log(params);
                return params;  
            },
            detailView: false,
            detailFormatter: function(index, row) {
                return '<p>id:'+row.id+'</p><p>姓名:'+row.name+'</p><p>性别:'+row.sex+'</p>';
            },
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
                title: "微信昵称"
            },{
                field: 'average',
                width: 100,
                title: '分数',
                align: 'center',
                valign: 'middle'
            },{
                field: 'advice',
                width: 100,
                title: '建议',
                align: 'center',
                valign: 'middle'
            },{
                field: 'fillDate',
                width: 100,
                title: '月份',
                align: 'center',
                valign: 'middle'
            }]
        });
    }
    initTable();

});