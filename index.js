window.global = new Proxy(
	{
		sets(o) {
			for (n in o) zdjl.setVar(n, o[n])
		},
		gets: zdjl.getVars.bind(zdjl),
	},
	{
		get: (_, k) => zdjl.getVar(k) ?? _[k],
		set: (_, k, v) => zdjl.setVar(k, v),
		deleteProperty: (_, k) => (zdjl.getVars()[k] == null ? false : (zdjl.deleteVar(k), true)),
		has: (_, k) => Object.keys(zdjl.getVars()).includes(k),
	}
)

global.button = function (callBack = () => {}, isClose = true) {
	return {
		varType: 'ui_button',
		action: {
			type: '运行JS代码',
			jsCode: `(${callBack.toString()})()`,
		},
		closeDialogOnAction: isClose,
	}
}

global.tag = {
	async init(tag) {
    this.allPage = Object.keys(tag).map(k => tag[k].desc ?? k)
    // 设置标题
		for (const k in tag) {
			const varName = tag[k]
			varName.__vars = varName.__vars ?? {}
			varName.__vars.dialogTitle = varName.__vars?.dialogTitle ?? {
				varType: 'expression',
				valueExp: 'global.tag.title',
			}
		}
	},
	title: `#MD
  <div align='center'>
    <font color='#cccccc'>global.nowPage</font>&nbsp;&nbsp;&nbsp;
    <a href='button:global.button(()=>global.tag.select(global.tag.allPage))'>菜单</a>
  </div>`,
	nowPage: '曲目列表',
	allPage: ['收藏夹', '曲目列表', '上传曲谱', '设置和关于'],
	select(items) {
		const res = zdjl.select({ title: '菜单', items: items ?? global.tag.allPage })
		if (res) global.tag.nowPage = res.item
		zdjl.runActionAsync({})
	},
}
