$(function() {
	//调用获取用户信息的函数
	getUserInfo()
	//实现退出用户登录功能
	$('#btnLogout').on('click', function() {
		//提示用户是否确认退出？
		layer.confirm('确定退出登录?', {
			icon: 3,
			title: '提示'
		}, function(index) {
			//清空本地存储中的 token
			localStorage.removeItem('token')
			//重新跳转到登录页面
			location.href = './login.html'
			// 关闭 confirm 询问框
			layer.close(index);
		});
	})
	//指定头部用户信息子菜单的快速跳转
	for (let i = 0; i < $('#userHeadList a').length; i++){
		$('#userHeadList a').eq(i).on('click', function() {
		$('#userLeftList a')[i].click()
		})
	}
		
})
//定义获取用户信息的函数
function getUserInfo() {
	$.ajax({
		method: 'GET',
		url: '/my/userinfo',
		success: function(res) {
			// console.log(res)
			if (res.status === 1) return layui.layer.msg('获取用户信息失败！')
			renderAvatar(res.data)
		}
	})
}
//定义 renderAvatar 函数,渲染用户头像
function renderAvatar(data) {
	//1.获取用户名称
	const uname = data.nickname || data.username
	//2.如果用户有设置头像，则使用用户头像，反之使用带有用户名首字母的文本头像
	if (data.user_pic) {
		$('.text-avatar').hide().siblings('.layui-nav-img').show().prop('src', data.user_pic)
	} else {
		$('.layui-nav-img').hide().siblings('.text-avatar').show().html(uname[0].toUpperCase())
	}
	$('#welcome').html(`欢迎&nbsp;&nbsp;${uname}`)
}
