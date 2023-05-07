$(function() {
	//1.表单验证
	const form = layui.form
	form.verify({
		nickname: function(value) {
			if (value.length > 6) return '昵称长度必须在 1 ~ 6 个字符之间！'
		}
	})
	//2.定义初始化用户信息的函数并调用
	const layer = layui.layer

	function initUserInfo() {
		$.ajax({
			method: 'GET',
			url: '/my/userinfo',
			success: function(res) {
				if (res.status === 1) return layer.msg('获取用户信息失败！')
				console.log(res)
				//调用 `form.val()` 方法为表单快速赋值
				form.val('formUserInfo', res.data)
			}
		})
	}
	initUserInfo()
	//3.重置表单按钮的功能
	$('#btnReset').on('click', function(e) {
		e.preventDefault() //先阻止表单默认重置行为
		initUserInfo() //初始化用户信息
	})
	//4.发起请求更新用户的信息
	//监听表单的提交事件
	$('.layui-form').on('submit', function(e) {
		// 阻止表单的默认提交行为
		e.preventDefault()
		// 发起 ajax 数据请求
		$.ajax({
			method: 'POST',
			url: '/my/userinfo',
			data:$(this).serialize(),//快速获取表单数据
			success:function(res){
				if(res.status === 1) return layer.msg('更新用户信息失败！')
				layer.msg('更新用户信息成功！')
				//调用父页面的方法重新渲染页面
				window.parent.getUserInfo()
			}
		})
	})
})
