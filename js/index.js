$(function() {
	window.onload = function() {
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 10.8 + 'px';
		var deviceWidth = document.documentElement.clientWidth;
		if (deviceWidth > 1080) {
			deviceWidth = 1080;
		}
		//100px = 1rem
		document.documentElement.style.fontSize = deviceWidth / 10.8 + 'px';
	};

	function getQueryString(name){
		 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		 var r = decodeURI(window.location.search).substr(1).match(reg);
		 if(r!=null)return  unescape(r[2]); return null;
	}
		//判断输入的字符是否满足要求
	function isMatch() {
		var user = $("#uName").val();
		var patten = new RegExp("^([\u4E00-\u9FA5]{2,5})$");
		return patten.test(user);
	}
	//隐藏弹框
	function hidebox() {
		$('.box').hide();
	}
	//显示弹框
	function showbox(info) {
		$('.info').text(info);
		$('.box').show();
	}
	// 隐藏旋转动画
	function hideRotatebox(){
		$('.rotatebox').hide();
	}
	// 显示旋转动画
	function showRotatebox(){
		$('.rotatebox').show();
	}
	//点击确定隐藏弹框
	$(".cont .yes").on("click", function() {
		hidebox();
	});
    

	//这里我们给个定时器来实现页面加载完毕再进行字体设置
	var now = {
			row : 1,
			col : 1
		},
		last = {
			row : 0,
			col : 0
		};
	const towards = {
		up : 1,
		right : 2,
		down : 3,
		left : 4
	};
	var isAnimating = false;

	s = window.innerHeight / 500;
	ss = 250 * (1 - s);

	$('.wrap').css('-webkit-transform', 'scale(' + s + ',' + s + ') translate(0px,-' + ss + 'px)');

	function pageMove(tw) {
		var lastPage = ".page-" + last.row + "-" + last.col;
		var nowPage = ".page-" + now.row + "-" + now.col;
		switch (tw) {
			case towards.up:
				outClass = 'pt-page-moveToTop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case towards.right:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
			case towards.down:
				outClass = 'pt-page-moveToBottom';
				inClass = 'pt-page-moveFromTop';
				break;
			case towards.left:
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
		}
		isAnimating = true;
		$(nowPage).removeClass("hide");

		$(lastPage).addClass(outClass);
		$(nowPage).addClass(inClass);

		setTimeout(function() {
			$(lastPage).removeClass('page-current');
			$(lastPage).removeClass(outClass);
			$(lastPage).addClass("hide");
			$(lastPage).find("img").addClass("hide");
			$(nowPage).addClass('page-current');
			$(nowPage).removeClass(inClass);
			$(nowPage).find("img").removeClass("hide");
			isAnimating = false;
		}, 500);
	}

	// 全局对象，取到所有字段的值
	var temp = {};
	$(".headingBtn").on("singleTap", function() {
		if (isAnimating) return;
		last.row = now.row;
		last.col = now.col;
		if (last.row != 16) {
			now.row = last.row + 1;
			now.col = 1; pageMove(towards.up);
		}
	});

	// 获取职位信息，取得对应的json文件路径
	function getJobName(type) {
		var tag = type;
		var path = "";
		switch (tag) {
		case "讲师":
			path = "json/projectManager.json";
			break;
		case "班主任":
			path = "json/headmaster.json";
			break;
		case "在线老师":
			path = "json/employmentManager.json";
			break;
		}
		return path;
	}

	// 配置大区字段
	function confBigAreaText(bArea) {
		var areaLength = $(".area").length;
		for (var i = 0; i < areaLength; i++) {
			$($(".area")[i]).html(bArea[i].name);
		}
	}
	// 配置大区字段
	(function confAllJsonData() {
		$.ajax({
			async : false,
			method : "GET",
			traditional : true,
			url : "recentServlet",
			timeout:  5000,
			success : function(data) {
				if(data.code == 200){
					// 大区
					confBigAreaText(data.results.bigarea);
					// 学校
					schoolChoice(data.results.schools);
					// 专业
					confSubjectText(data.results.subject);
					// 历史数据
					updateClassAndTeaName(data.results.history);
				}else{
					showbox('没有数据');
				}
				
			},
			error : function(err) {
				showbox('数据请求失败');
			},
			complete : function(XMLHttpRequest,status){ 
		　　　　if(status=='timeout'){
		 		showbox('数据请求失败');
		　　　　}
		　　}
		});
	})();

	function updateClassAndTeaName(tcs) {
		var classSpans = $(".classListOne span");
		var min = Math.min(tcs.classList.length, classSpans.length);
		for (var i = 0; i < min; i++) {
			$(classSpans[i]).html(tcs.classList[i]);
		}
		// 隐藏没有内容的span
		if (min < classSpans.length) {
			for (var i = min; i < classSpans.length; i++) {
				$(classSpans[i]).hide();
			}
		}
		var teaNameSpans = $(".nameList span");
		min = Math.min(tcs.teacherName.length, teaNameSpans.length);
		for (var i = 0; i < min; i++) {
			$(teaNameSpans[i]).html(tcs.teacherName[i]);
		}
		if (min < teaNameSpans.length) {
			for (var i = min; i < teaNameSpans.length; i++) {
				$(teaNameSpans[i]).hide();
			}
		}
	}

	// 配置专业数据
	//var subs = [];
	function confSubjectText(sub) {
		temp.subs = sub;
	}

	//点击大区选项进入校区选项
	function schoolChoice(d) {
		$(".area").on("singleTap", function() {
			// 得到大区的字段
			console.log($(this).html());
			temp.large_Area = $(this).html();
			// 修改选中项的显示颜色
			$(".area").css({
				"background" : "",
				"color" : "#14c6d0"
			});
			$(this).css({
				"background" : "#14c6d0",
				"color" : "#fff"
			});
			$("#confirm").css({
				"display" : "block",
				"background" : "#878787"
			});
			//显示校区弹框
			$(".kuang").show(5000);
			$("#schools").css({
				"display" : "block"
			});
			$(this).css("display", "block");

			var index = $(this).index(); //大区的下标
			var list = "";
			for (var i = 0; i < d[index].length; i++) {
				list += "<li>" + d[index][i].sch + "</li>" + "<span style='display: none;'>" + d[index][i].subcode + "</span>";
				$("#schools").html(list);
				$("li").unbind();
				$("li").on("singleTap", function() {
					$("li").css({
						"border" : "",
						"color" : ""
					});
					$(this).css({
						"border" : "1px solid #14c6d0",
						"color" : "#14c6d0"
					});
					$("#confirm").css("background-color", " #14c6d0");
					//得到每个校区名字
					var liIndex = $(this).index();
					var schoolName = $(this).html();
					temp.sch_Name = schoolName;
					temp.subcode = $(this).next().html().split(',');
				})
			}
		});
	}
	// 选择学校界面的确定按钮监听事件
	$("#confirm").on("singleTap", function() {
		if(!temp.subcode){
			showbox("请选择学校");
			return;
		}
		// 根据选择的学校，配置专业数据
		var codes = temp.subcode;
		for (var i = 0; i < codes.length; i++) {
			console.log(temp.subs);
			var sub = temp.subs[codes[i]];
			$($(".profession")[i]).html(sub);
			$($(".profession")[i]).show();
		}
		// 向上滑动
		if (isAnimating) return;
		last.row = now.row;
		last.col = now.col;
		if (last.row != 12) {
			now.row = last.row + 1;
			now.col = 1; pageMove(towards.up);
		}
	});


	//点击学校名称页面的×号，关闭页面
	$(".modal-close-btn").on("singleTap", function() {
		$("#schools").css("display", "none");
		$(".kuang").css("display", "none");
		$("#confirm").css("display", "none");
		// 关闭学校界面时,将temp中保存的学校数据删除
		delete temp.subcode;
	});

	//得到专业的value值
	$(".profession").on("singleTap", function() {
		$(".profession").css({
			"border" : "",
			"color" : ""
		});
		$(this).css({
			"border" : "1px solid #14c6d0",
			"color" : "#14c6d0"
		});

		$(".professionBtn").css("background", "#14c6d0");
		temp.cus_Name = $(this).html();
	});
	var GLOBAL = GLOBAL || {};
	//预置字符串
    GLOBAL.selectTips= '<option value="" disabled selected style="display:none;">请选择</option>';
	// 点击专业页面的确定按钮的监听事件
	$(".professionBtn").on("singleTap", function() {
		if(!temp.cus_Name){
			showbox("请选择专业");
			return;
		}
		//获取老师的类型
		var typeValue = $('input[name="tachertype"]:checked').val();
		if(confirm('评论老师的类型: '+typeValue)){
			var jsonpath = getJobName(typeValue);
			$.getJSON(jsonpath, function(titles) {
				// 布置题目
				recycleDiv(titles);
			});
			// 类型
			if (typeValue == "讲师") {
				temp.role_Level = 0;
			} else if (typeValue == "班主任") {
				temp.role_Level = 1;
			}else if(typeValue == "在线老师"){
				temp.role_Level = 2;
			}
			// 提交数据获取班级和老师姓名数据
			console.log('类型-->'+typeValue+',学校名称-->'+temp.sch_Name+',专业-->'+temp.cus_Name);
			showRotatebox();
			
			//TODO 获取班级和老师名称信息 schoolName majorName, role_Level
			$.ajax({
				async : true,
				method : "GET",
				traditional : true,
				url : "ClassAndTeacherServlet?schoolName="+temp.sch_Name+"&majorName="+temp.cus_Name+"&role_Level="+typeValue,
				timeout:  5000,
				success : function(data) {
					if(data.code==200){
						GLOBAL.selectData = data.results;
			            var ctStr = GLOBAL.selectTips;
			            for (var i = 0; i < GLOBAL.selectData.length; i++) {
			                if (GLOBAL.selectData[i].fatherid == 0) {
			                	ctStr += '<option text="'+ GLOBAL.selectData[i].title +'"value="'+ GLOBAL.selectData[i].uuid +'">'+ GLOBAL.selectData[i].title +'</option>';
			                }
			            };
			            $("#classInput").html(ctStr);
			            hideRotatebox();
						if (isAnimating) return;
						last.row = now.row;
						last.col = now.col;
						if (last.row != 12) {
							now.row = last.row + 1;
							now.col = 1; pageMove(towards.up);
						}
					}else{
						hideRotatebox();
						showbox('没有数据');
					}
				},
				error : function(err) {
					hideRotatebox();
					showbox('数据请求失败');
				},
				complete : function(XMLHttpRequest,status){ 
			　　　　if(status=='timeout'){
					hideRotatebox();
			 		showbox('数据请求失败');
			　　　　}
			　　}
			});
			
			
			//获取下拉列表信息
			/*$.getJSON('json/class.json',function(data){
				if(data.code == 200){
		        	GLOBAL.selectData = data.results;
		            var ctStr = GLOBAL.selectTips;
		            for (var i = 0; i < GLOBAL.selectData.length; i++) {
		                if (GLOBAL.selectData[i].fatherid == 0) {
		                	ctStr += '<option text="'+ GLOBAL.selectData[i].title +'"value="'+ GLOBAL.selectData[i].uuid +'">'+ GLOBAL.selectData[i].title +'</option>';
		                }
		            };
		            $("#classInput").html(ctStr);
		            hideRotatebox();
					if (isAnimating) return;
					last.row = now.row;
					last.col = now.col;
					if (last.row != 12) {
						now.row = last.row + 1;
						now.col = 1; pageMove(towards.up);
					}
		        }else{
		        	showbox('获取数据失败');
		        }
			});*/
		}
	});
	// 二级联动
	function twoToggle(){
		var fId = $(classInput).val();
        $("#uName").empty();
        var ctStr = GLOBAL.selectTips;
        for (var i = 0; i < GLOBAL.selectData.length; i++) {
            if (GLOBAL.selectData[i].fatherid == fId) {
                ctStr += '<option text="'+ GLOBAL.selectData[i].title +'"value="'+ GLOBAL.selectData[i].uuid +'">'+ GLOBAL.selectData[i].title +'</option>';
            }
        };
        $("#uName").html(ctStr);
	}

	// 选择班级select添加change事件
	$("#classInput").change(twoToggle);
	// 选择老师change事件
	$("#uName").change(function(){
		$(".btn").css("background", "#14c6d0");
	});

	function lightBtnAndAjax() {	
		var classValue = $('#classInput').val();
		if(classValue == ''){
			showbox('请选择班级');
			return;
		}
		var teacherValue = $('#uName').val();
		if(teacherValue == ''){
			showbox('请选择老师');
			return;
		}
		// 得到班级的名字
		temp.stu_Class = jQuery("#classInput option:selected").text();
		// 得到教师的名字
		temp.tea_Name = jQuery("#uName option:selected").text();
		alert(temp.stu_Class+'-->'+temp.tea_Name);
		var postdata = {
			"large_Area" : temp.large_Area,
			"sch_Name" : temp.sch_Name,
			"cus_Name" : temp.cus_Name,
			"tea_Name" : temp.tea_Name,
			"role_Level" : temp.role_Level,
			"uid" : getQueryString('uid'),
			"nickName" : getQueryString('tid')
		};
		postComment(postdata, function(isComment, err) {
			if (err) {
				showbox("网络开小差了");
			} else {
				isComment = Number.parseInt(isComment)
				if (isComment == 0) {
					showbox("您本月度对此老师评论过了！");
				} else {
					//向上滑动到下一页
					if (isAnimating) return;
					last.row = now.row;
					last.col = now.col;
					if (last.row != 12) {
						now.row = last.row + 1;
						now.col = 1; pageMove(towards.up);
					}
					return true;
				}
			}
		});
	}
	
	$(".btn").click(lightBtnAndAjax);

	//ajax请求，判断是否已经评论过了
	function postComment(postdata, callback) {
		// 显示旋转动画
		showRotatebox();
		$.ajax({
			async : false,
			timeout: 5000,
			method : "POST",
			traditional : true,
			url : "CheckServlet",
			data : {
				checkJson : JSON.stringify(postdata)
			},
			async : true,
			success : function(data) {
				callback(data, null);
				// 隐藏旋转动画
				hideRotatebox();
			},
			error : function(err) {
				callback(null, err);
				// 隐藏旋转动画
				hideRotatebox();
			},
			complete : function(XMLHttpRequest,status){ 
				// 隐藏旋转动画
				hideRotatebox();
		　　　　if(status=='timeout'){
					showbox("请求超时");
		　　　　}
		　　}
		});
	}

	//建议框的提示文字
	$("#suggestions").bind("input propertychang", function() {
		var taValue = $("#suggestions").val();
		temp.stu_Advice = taValue;
	});

	//获得字符串的字符数
	function getCharSize(str) {
		var realLength = 0,
			len = str.length,
			charCode = -1;
		for (var i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128)
				realLength += 1;
			else
				realLength += 2;
		}
		return realLength;
	}

	//单选框中name的值的数组
	//单选框中id的值的数组
	var dataObj = [
		[ "alway", "sometimes", "nolate", "always", "everyday", "every" ],
		[ "noOrder", "canBut", "canUnderstan", "tuChu", "mindClea", "bothClear" ],
		[ "noQuestion", "strangeQuestion", "rareQuestion", "goodQuestions", "goodQuestion", "excellentQuestion" ],
		[ "noResponse", "noAblility", "avoid", "hard", "patient", "patientAndGood" ],
		[ "tutorAfterClass", "noCare", "solvedOnClass", "farFetched", "patientButNoAccurate", "patientAndAccurate" ],
		[ "disOrder", "noGood", "noInfluence", "somePersons", "good", "goodOrder" ],
		[ "noSkills", "ownOpinin", "arrange", "onAccept", "rangeFromResponse", "active" ],
		[ "noThinkAboutClass", "noThinkAboutFact", "goodButGood", "goodContentButDifficult", "burden", "goodContent" ],
		[ "noExample", "rare", "normalInfluence", "goodInfluence", "rich", "oneAndThree" ],
		[ "never", "s", "everyDayButNever", "everydaySome", "everydayAndAlways", "accurate" ]
	];

	// 单选框的name属性取出来循环
	var nameArr = [ "attendance", "onClass", "questions", "answers", "tutorAfterClass",
		"discipline", "skills", "progress", "explain", "works" ];
	var scoreNames = {
		attendance : "tea_Attendance",
		onClass : "cls_Explain",
		questions : "cls_Quesions",
		answers : "ques_Answer",
		tutorAfterClass : "cls_Coach",
		discipline : "cls_Discipline",
		skills : "cls_Skill",
		progress : "cls_Progress",
		explain : "exam_Explain",
		works : "class_Homework"
	};
	var titles = {};
	function recycleDiv(data) {
		titles = data;
		// 根据json文件修改第1、2题的内容
		$('.page-title.one').html(titles.subject[0].title);
		$('.page-title.two').html(titles.subject[1].title); //siblings
		// 根据json文件修改第1、2题内容
		var labelArr = $('.page-title.one').siblings(".pageChoice").find("label");
		labelArr.each(function(index, item) {
			$(item).html(titles.subject[0].options[index]);
		});
		labelArr = $('.page-title.two').siblings(".pageChoice").find("label");
		labelArr.each(function(index, item) {
			$(item).html(titles.subject[1].options[index]);
		});

		for (var h = 0; h < nameArr.length; h++) {
			var arrStr = nameArr[h];
			$("input[name =" + arrStr + "]").click(radioClickEvent);
		}
	}
	// 点击单选框触发事件
	function radioClickEvent() {
		//选中的单选框题目是几分
		var key = $(this).attr('name');
		var val = scoreNames[key];
		// 设置全局变量中对应属性的分数值
		temp[val] = parseInt($(this).val());

		//点击单选框选项的时候，下一题的按钮颜色变化&& 页面滑动到下一页
		$(".nextQuestion").css("background", "");
		$(this).parent(".pageChoice").siblings('.nextQuestion').css("background", "#14c6d0");
		//点击下一题
		$(this).parent(".pageChoice").siblings('.nextQuestion')
			.on("singleTap", nextQuestionEvent);
	}
	// 点击下一题触发事件，更新题卡内容
	function nextQuestionEvent() {
		//取到当前页面的value值，来改变页码数
		var value = Number.parseInt($(this).parents(".page").attr('value'));
		//改变当前页面的class的page-5-1的值
		var nowDiv = $(this).parents(".page")
			.removeClass()
			.addClass("page-" + (value + 2) + "-1")
			.addClass("hide")
			.addClass("page")
			.attr('value', value + 2);
		setTimeout(function() {
			$(this).parents(".page").next().after(nowDiv);
		}, 1000);

		// 题卡到第十题的时候，停止循环
		if (value > 12) {
			nowDiv.removeClass("page-" + (value + 2) + "-1");
		}
		// 点击下一题页面滑动
		if (isAnimating) return;
		last.row = now.row;
		last.col = now.col;
		if (last.row != 15) {
			now.row = last.row + 1;
			now.col = 1;
			pageMove(towards.up);
		}
		//题卡的页数1/10
		var pageNum = nowDiv.find(".pageNum");
		var page = $(pageNum).html(value - 2);

		// 修改input的name值
		var inputArr = nowDiv.find("input");
		for (var i = 0; i < inputArr.length; i++) {
			inputArr[i].name = nameArr[value - 3];
		}
		//修改题卡的标题
		if (value < 13) {
			nowDiv.find('.page-title').html(titles.subject[value - 3].title);
			//改变单选框id的值
			var labelArr = nowDiv.find("label");
			labelArr.each(function(index, item) {
				$(item).attr("for", dataObj[value - 3][index]);
			});

			//改变题卡的选项内容
			labelArr.each(function(index, item) {
				$(item).html(titles.subject[value - 3].options[index]);
			});

			//清除所有被选中的单选框
			var radios = $("input[type='radio']");
			for (var i = 0; i < radios.length; i++) {
				if (radios[i].checked) {
					radios[i].checked = false;
				} else {
					$(".nextQuestion").unbind();
				}
			}
			//改变单选框id的值
			var inputArr = nowDiv.find("input[type='radio']");
			$(inputArr).each(function(index, item) {
				$(item).attr("id", dataObj[value - 3][index]);
			});
		}
	}

	//全部提交按钮，传输数据
	$(".lastSubmit").click(function() {
		//如果建议没有填的话，传空字符传上去
		if (!(temp.stu_Advice)) {
			temp.stu_Advice = "";
		}
		var jslength = 0;
		for (var js2 in temp) {
			jslength++;
		}
		// 删除专业代码属性
		delete temp.subcode;
		// 删除专业数组属性
		delete temp.subs;
		console.log(temp);
		temp.uid = getQueryString('uid');
		temp.nickName = getQueryString('tid');
		showRotatebox();
		var url = "SaveServlet";
		$.ajax({
			async : true,
			timeout: 5000,
			method : "POST",
			traditional : true,
			url : url,
			data : {
				name : JSON.stringify(temp)
			},
			success : function(data) {
				hideRotatebox();
				data = Number.parseInt(data);
				if (data.code == 200) {
					if (isAnimating) return;
					last.row = now.row;
					last.col = now.col;
					if (last.row != 12) {
						now.row = last.row + 1;
						now.col = 1; pageMove(towards.up);
					}
					showbox("点评成功！");
				} else {
					showbox("点评失败！");
				}
			},
			error : function(err) {
				hideRotatebox();
				showbox("网络开小差了！点评失败！");
			},
			complete : function(XMLHttpRequest,status){ 
				// 隐藏旋转动画
				hideRotatebox();
		　　　　if(status=='timeout'){
				  showbox("请求超时");
		　　　　}
		　　}
		});
	});

	// 返回第一屏
	$(".returnFirstPage").click(function() {
		window.location = "index.jsp?uid="+getQueryString("uid")+"&tid="+getQueryString("tid")+"&r=" + Math.random();

	});

	/***第四屏班级输入框+教师姓名输入框**/
	$(".classListOne span").click(function() {
		var txt = $(this).html();
		var len = jQuery("#classInput").find("option[text="+txt+"]").length;
		if(len==0){
			showbox('您已经不在此班级');
		}else{
			jQuery("#classInput").find("option[text="+txt+"]").attr("selected",true);
			twoToggle();
		}
	});

	$(".nameList span").click(function() {
		// 首先判断班级是否已经选择了
		var v= $("#classInput").val();
		if($("#classInput").val()==''){
			showbox('请首先选择班级');
			return;
		}
		var txt = $(this).html();
		var len = jQuery("#uName").find("option[text="+txt+"]").length;
		if(len==0){
			showbox('您对此老师不需要评论');
		}else{
			jQuery("#uName").find("option[text="+txt+"]").attr("selected",true);
			$(".btn").css("background", "#14c6d0");
		}
	});
});