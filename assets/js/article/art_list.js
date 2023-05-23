$(function() {
	//定义一个查询的参数对象如下：
	//需要将请求参数对象提交到服务器
	const q = {
		pagenum: 1, // 页码值，默认请求第一页的数据
		pagesize: 2, // 每页显示几条数据，默认每页显示2条
		cate_id: '', // 文章分类的 Id
		state: '' // 文章的发布状态
	}
	// 获取文章列表数据的方法
	initTable() //先调用
	function initTable() {
		//发起请求获取列表数据
		$.ajax({
			method: 'GET',
			url: '/my/article/list',
			data: q,
			success: function(res) {
				if (res.status === 1) return layui.layer.msg('获取文章列表失败！')
				const htmlStr = template('tpl-table', res)
				$('tbody').html(htmlStr)
				// 调用渲染分页的方法
				renderPage(res.total)
			}
		})
	}
	// 定义美化时间的过滤器
	template.defaults.imports.dataFormat = function(date) {
		const dt = new Date(date)

		var y = dt.getFullYear()
		var m = padZero(dt.getMonth() + 1)
		var d = padZero(dt.getDate())

		var hh = padZero(dt.getHours())
		var mm = padZero(dt.getMinutes())
		var ss = padZero(dt.getSeconds())

		return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
	}
	// 定义补零的函数
	function padZero(n) {
		return n > 9 ? n : '0' + n
	}

	// 初始化文章分类的方法
	initCate()

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
				$('#cate1').html(htmlStr)
				// 通过 layui 重新渲染表单区域的UI结构
				layui.form.render()
			}
		})
	}
	//为筛选表单绑定 submit 事件
	$('#form-search').on('submit', function(e) {
		e.preventDefault()
		// 获取表单中选中项的值
		const cate_id = $('[name=cate_id]').val()
		const state = $('[name=state]').val()
		// 为查询参数对象 q 中对应的属性赋值
		q.cate_id = cate_id
		q.state = state
		// 根据最新的筛选条件，重新渲染表格的数据
		initTable()
	})
	//定义渲染分页的方法renderPage，形参为数据总数
	function renderPage(total) {
		//调用 laypage.render() 方法来渲染分页的结构：
		layui.laypage.render({
			elem: 'pageBox' //注意，elem属性值是 ID，不用加 # 号
				,
			count: total || 1, //数据总数，从服务端得到
			limit: q.pagesize, // 每页显示几条数据，从q默认查询对象获取
			curr: q.pagenum, // 设置默认被选中的分页
			jump: function(obj, first) { //jump回调函数是在分页发生切换时触发
				//obj包含了当前分页的所有参数，比如：
				q.pagenum = obj.curr //得到当前页，以便向服务端请求对应页的数据。
				q.pagesize = obj.limit //得到每页显示的条数 
				//通过点击分页按钮调用jump回调才会触发的代码
				if (!first) {
					initTable() // 根据最新的筛选条件，重新渲染表格的数据
				}
			},
			// 自定义分页的功能项
			layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
			limits: [2, 5, 8, 10]
		})
	}
	//删除事件
	$("tbody").on('click', '.btn-delete', function() {
		const len = $('.btn-delete').length // 获取删除按钮的个数
		const id = $(this).attr('data-id') //获得被操作数据的id号
		layer.confirm('确认删除该文章?', {
			icon: 3,
			title: '提示'
		}, function(index) {
			$.ajax({
				method: 'GET',
				url: '/my/article/delete/' + id,
				success: function(res) {
					if (res.status !== 0) {
						return layui.layer.msg(res.message)
					}
					layui.layer.msg('删除文章成功！')
					// 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
					// 页码值最小必须是 1
					if (len === 1) {
						q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
					}
					initTable()
				}
			})
			layui.layer.close(index)
		})

	})
	//通过事件委派为编辑按钮绑定点击事件
	//预先保存弹出层的索引
	let indexEdit = null
	$('tbody').on('click', '.btn-edit', function() {
		indexEdit = layer.open({
			type: 1,
			title: '修改文章内容',
			content: $('#dialog-edit').html(),
			area: ['1000px', '600px'],
			zIndex:10,
			success: function(){
				//弹出层的业务逻辑代码
				
				initCate2()

			}
		})

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
		//获得被操作数据的id号
		const id = $(this).attr('data-id')
		$.ajax({
			method: 'GET',
			url: '/my/article/' + id,
			success: function(res) {
				if (res.status !== 0) return layui.layer.msg(res.msg)
				//调用 `form.val()` 方法为表单快速赋值
				layui.form.val('formEdit', res.data)
				
				initEditor() //富文本初始化
				// $('[name = content]').val(res.data.content)
				// console.log(res.data.cover_img);
				// $image.cropper('destroy').attr('src', 'http://127.0.0.1:3007'+res.data.cover_img).cropper(options);
				// $('#image')[0].src=res.data.cover_img
			}
		})
		//为选择封面绑定事件
		$('body').on('click', '#btnChooseImage', function() {
			$('#coverFile').click()
		})
		//将选择的图片设置到裁剪区域中
		$('body').on('change', '#coverFile', function(e) {
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
		$('body').on('click', '#btnSave2', function() {
			art_state = '草稿'
		})
		$('body').on('submit', '#form-edit', function(e) {
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
					updateArticle(fd) //调用更新文章的方法
				})
		})
	})
	//定义initCate2方法获取弹出层下拉列表选项
	function initCate2() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg('获取分类数据失败！')
				}
				// 调用模板引擎渲染分类的可选项
				const htmlStr = template('tpl-cate2', res)
				$('#cate2').html(htmlStr)
				// 通过 layui 重新渲染表单区域的UI结构
				layui.form.render()
			}
		})
	}
	//定义更新文章的方法
	function updateArticle(fd) {
		$.ajax({
			method: 'POST',
			url: '/my/article/edit',
			data: fd,
			// 注意：如果向服务器提交的是 FormData 格式的数据，
			// 必须添加以下两个配置项
			contentType: false,
			processData: false,
			success: function(res) {
				if (res.status !== 0) {
					return layui.layer.msg('更新文章失败！')
				}
				layui.layer.msg('更新文章成功！')
				layui.layer.close(indexEdit)
				initTable()
			}
		})
	}
})
