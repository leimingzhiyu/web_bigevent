$(function() {
	initCate()
	initEditor() //富文本初始化
	//定义initCate方法获取下拉列表选项
	function initCate() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg('获取分类数据失败！')
				}
				// 调用模板引擎渲染分类的可选项
				const htmlStr = template('tpl-cate', res)
				$('[name=cate_id]').html(htmlStr)
				// 通过 layui 重新渲染表单区域的UI结构
				layui.form.render()
			}
		})
	}
	//裁剪区域相关代码
	// 1. 初始化图片裁剪器
	const $image = $('#image')

	// 2. 裁剪选项
	const options = {
		aspectRatio: 400 / 280,
		preview: '.img-preview'
	}

	// 3. 初始化裁剪区域
	$image.cropper(options)
	//为选择封面绑定事件
	$('#btnChooseImage').on('click', function() {
		$('#coverFile').click()
	})
	//将选择的图片设置到裁剪区域中
	$('#coverFile').on('change', function(e) {
		const filelist = e.target.files //获取用户选择的文件列表
		if (filelist.length === 0) return
		const file = e.target.files[0] //拿到用户选择的文件
		const newImgURL = URL.createObjectURL(file) //根据选择的文件，创建一个对应的 URL 地址
		// 为裁剪区域重新设置图片
		$image
			.cropper('destroy') // 销毁旧的裁剪区域
			.attr('src', newImgURL) // 重新设置图片路径
			.cropper(options) // 重新初始化裁剪区域
	})
	//发布文章实现
	let art_state = '已发布'
	$('#btnSave2').on('click', function() {
		art_state = '草稿'
	})
	$('#form-pub').on('submit', function(e) {
		e.preventDefault()
		// 基于 form 表单，快速创建一个 FormData 对象
		const fd = new FormData($(this)[0])
		// 将文章的发布状态，存到 fd 中
		fd.append('state', art_state)
		//将裁剪后的封面追加到FormData对象中
		$image
			.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
				width: 400,
				height: 280
			})
			.toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
				// 得到文件对象后，进行后续的操作
				// 5. 将文件对象，存储到 fd 中
				fd.append('cover_img', blob)
				publishArticle(fd)//调用发布文章的方法
			})
		/* fd.forEach(function(v, k) {
			console.log(k, v);
		}) */
	})
})
//定义发布文章的方法
function publishArticle(fd) {
	$.ajax({
		method: 'POST',
		url: '/my/article/add',
		data: fd,
		// 注意：如果向服务器提交的是 FormData 格式的数据，
		// 必须添加以下两个配置项
		contentType: false,
		processData: false,
		success: function(res) {
			if (res.status !== 0) {
				return layui.layer.msg('发布文章失败！')
			}
			layui.layer.msg('发布文章成功！')
			// 发布文章成功后，跳转到文章列表页面
			location.href = '/article/art_list.html'
		}
	})
}
