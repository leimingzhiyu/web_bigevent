$(function() {
	//自定义密码校验规则
	const form = layui.form
	form.verify({
		pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
		samepwd: function(value) { //value：表单的值
			const oldpwd = $('.layui-form-item [name=oldPwd]').val() //获取密码框的值
			if (oldpwd === value) {
				return '新旧密码不能相同！'
			}
		},
		repwd: function(value) { //value：表单的值
			const pwd = $('.layui-form-item [name=newPwd]').val() //获取密码框的值
			if (pwd !== value) {
				return '两次密码不一致！'
			}
		}
	})
	//表单提交
	const layer = layui.layer
	$('.layui-form').on('submit', function(e) {
		e.preventDefault()
		//发起ajax请求
		$.ajax({
			method: 'POST',
			url: '/my/updatepwd',
			data:$(this).serialize(),
			success:function(res){
				if(res.status === 1) return layer.msg('更新密码失败！')
				layer.msg('更新密码成功！')
				$('.layui-form')[0].reset() //表单重置
			}
		})
	})
})
