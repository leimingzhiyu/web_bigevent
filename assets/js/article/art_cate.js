$(function() {
	//定义方法来获取文件分类的列表
	function initArtCateList() {
		//发起请求
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function(res) {
				const htmlStr = template('tpl-table', res) //获得处理好的模板引擎字符串
				$('tbody').html(htmlStr) //渲染数据
			}
		})
	}
	initArtCateList()
	// 为添加类别按钮绑定点击事件
	//预先保存弹出层的索引
	let indexAdd = null
	$('#btnAddCate').on('click', function() {
		indexAdd = layer.open({
			type: 1,
			title: '添加文章分类',
			content: $('#dialog-add').html(),
			area: ['500px', '250px']
		})
	})
	//通过事件委派的形式，为弹出层中的表单绑定提交事件
	$('body').on('submit', '#form-add', function(e) {
		e.preventDefault() //阻止表单默认行为
		//发起ajax请求
		$.ajax({
			method: 'POST',
			url: '/my/article/addcates',
			data: $(this).serialize(),
			success: function(res) {
				if (res.status === 1) return layui.layer.msg(res.message)
				initArtCateList() //调用成功后重新渲染页面
				layui.layer.msg('新增分类成功！')
				layui.layer.close(indexAdd)
			}
		})
	})
	//通过事件委派为编辑按钮绑定点击事件
	//预先保存弹出层的索引
	let indexEdit = null
	$('tbody').on('click', '.btn-edit', function() {
		indexEdit = layer.open({
			type: 1,
			title: '修改文章分类',
			content: $('#dialog-edit').html(),
			area: ['500px', '250px']
		})
		//获得被操作数据的id号
		const id = $(this).attr('data-id')
		$.ajax({
			method: 'GET',
			url: '/my/article/cates/' + id,
			success: function(res) {
				//调用 `form.val()` 方法为表单快速赋值
				layui.form.val('formEdit', res.data)
			}
		})
	})
	//通过事件委派的形式，为修改分类弹出层中的表单绑定提交事件
	$('body').on('submit', '#form-edit', function(e) {
		e.preventDefault() //阻止表单默认行为
		//发起ajax请求
		$.ajax({
			method: 'POST',
			url: '/my/article/updatecate',
			data: $(this).serialize(),
			success: function(res) {
				if (res.status === 1) return layui.layer.msg(res.message)
				initArtCateList() //调用成功后重新渲染页面
				layui.layer.msg('更新分类数据成功！')
				layui.layer.close(indexEdit)
			}
		})
	})
	//通过事件委派为删除按钮绑定点击事件
	//预先保存弹出层的索引 
	$('tbody').on('click', '.btn-delete', function() {
		const id = $(this).attr('data-id') //获得被操作数据的id号
		layer.confirm('确认删除?', {
			icon: 3,
			title: '提示'
		}, function(index) {
			$.ajax({
				method: 'GET',
				url: '/my/article/deletecate/' + id,
				success: function(res) {
					if (res.status !== 0) {
						return layui.layer.msg(res.message)
					}
					layui.layer.msg('删除分类成功！')
					layui.layer.close(index)
					initArtCateList()
				}
			})
		});
	})
})
