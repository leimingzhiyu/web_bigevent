$(function() {
	// 1.1 获取裁剪区域的 DOM 元素
	var $image = $('#image')
	// 1.2 配置选项
	const options = {
		// 纵横比
		aspectRatio: 1,
		// 指定预览区域
		preview: '.img-preview'
	}
	// 1.3 创建裁剪区域
	$image.cropper(options)
	//为上传绑定点击事件
	$('#btnChooseImage').on('click', function() {
		$('#file').click() //让程序模拟点击所隐藏的文件选择框
	})
	//为文件上传框绑定change状态改变事件
	$('#file').on('change', function(e) {
		//获取用户选择的文件列表 
		const filelist = e.target.files
		console.log(filelist);
		//判断用户是否选择了图片
		if (filelist.length === 0) return layui.layer.msg('请选择图片！')
		//获得用户选择的图
		const file = filelist[0]
		//根据选择的文件，创建一个对应的 URL 地址
		const newImgURL = URL.createObjectURL(file)
		//先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
		$image
			.cropper('destroy') // 销毁旧的裁剪区域
			.attr('src', newImgURL) // 重新设置图片路径
			.cropper(options) // 重新初始化裁剪区域
	})
	//为“确定”按钮绑定点击事件，实现将图片上传到服务器的功能
	$('#btnUpload').on('click', function() {
		//将裁剪后的图片，输出为 base64 格式的字符串,dataURL就是剪裁后的图片路径
		const dataURL = $image
			.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
				width: 100,
				height: 100
			})
			.toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
		//发起ajax请求，上传图片路径
		$.ajax({
			method:'POST',
			url:'/my/update/avatar',
			data:{
				avatar:dataURL
			},
			success:function(res){
				if(res.status === 1) layui.layer.msg('更换头像失败！')
				layui.layer.msg('更换头像成功！')
				//重新更新渲染修改后的页面
				window.parent.getUserInfo()
			}
		})
	})
})
