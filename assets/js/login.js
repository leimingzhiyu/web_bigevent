$(function () {
	//1.控制登录/注册区域切换
	$('#link_reg').on('click', function () {
		$('.login-box').hide().siblings('.reg-box').show()
	})
	$('#link_login').on('click', function () {
		$('.reg-box').hide().siblings('.login-box').show()
	})
	//2.自定义校验规则
	const form = layui.form
	form.verify({
		pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
		repwd: function (value) { //value：表单的值
			const pwd = $('.reg-box [name=password]').val() //获取密码框的值
			if (pwd !== value) {
				return '两次密码不一致！'
			}
		}
	})
	//3.监听表单注册事件
	const layer = layui.layer
	$('#from_reg').on('submit', function (e) {
		e.preventDefault() //阻止默认行为
		//发起post请求
		const data = {
			username: $('.reg-box [name=username]').val(),
			password: $('.reg-box [name=password]').val()
		}
		$.post('/api/reguser', data, function (res) {
			if (res.status !== 0) return layer.msg(res.message)
			layer.msg('恭喜你，注册成功！')
			$('#link_login').click() //自动跳转到登录页面
		})
	})
	//4.监听表单登录事件
	$('#from_login').submit(function(e){
		e.preventDefault() //阻止默认行为
		//发起ajax的post请求
		$.ajax({
			method:'POST',
			url:'/api/login',
			data:$(this).serialize(),
			success:function(res){
				if(res.status === 1) return layer.msg('登录失败！请核对用户名或者密码')
				layer.msg('登录成功！')
				localStorage.setItem('token',res.token) //存储token值，用于身份认证
				location.href='./index.html'//跳转到首页
			}
		})
	})
})
