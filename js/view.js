(function(doc){
	'use strict'
	
	// 兼容性封装，生成统一的变量
	var MATCHES_SELECTOR = [
		'webkitMatchesSelector',
		'mozMatchesSelector',
		'matchesSelector'
	].filter(function(name){
		return this[name]
	}, doc.body)[0]

	var TPL_CARD = '<div class="front">{{contents}}</div>'

	// 跳转表，将不同 UI 对象上的交互动作通过选择器分发给不同的 handler 函数
	var clickEvents = {
		'.card, .card *': function(){
			var sender = this
			// 分发给 handler 函数的事件可能来自不同的 UI 子元素，需要统一
			if (!sender.classList.contains('card')) {
				sender = sender.parentNode
			}
			// 利用 button 元素原生的状态
			if (sender.disabled){
				return
			}
			var index = Array.prototype.indexOf.call(view.cardButtons, sender)
			// 广播消息，传递视图自己加工处理过的交互信息(index)
      view.action.fire('card:filp', [index])
		}
	}

	var view = {
		action: pubsub(),

		init: function(opt) {
			this.flipsLabel = doc.querySelector('.count')
			this.scoreLabel = doc.querySelector('.score')
			this.cardButtons = doc.querySelectorAll('.card')
			this.updateCardButtons(function(){
				return opt.cardData && opt.cardData() || {}
			})
			// 事件代理捕获整个应用范围的交互事件，用跳转表分发
			delegate(doc.body, 'click', clickEvents)
		},
		
		updateCardButtons: function(fn, context){
			Array.prototype.forEach.call(this.cardButtons, function(cardButton, i){
				var data = fn.call(context, i)
				cardButton.innerHTML = format(TPL_CARD, data)
				cardButton.classList.add('animated')
				if (data.isFaceUp){
					cardButton.classList.add('selected')
          cardButton.classList.add('flipInY')
				} else {
					cardButton.classList.remove('selected')
					cardButton.classList.remove('flipInY')
				}
				cardButton.disabled = data.isUnplayable
			})
		},
		
		updateScoreLabel: function(data){
			// 更新状态栏里的积分
      this.scoreLabel.innerHTML = format("Score: {{score}}", data)
		},

		updateFlipsLabel: function(data) {
			// 更新状态栏里的次数统计
      this.flipsLabel.innerHTML  = format("Flip: {{count}}", data)
		}
	}

	function format(str, data) {
		return str.replace(/\{\{(\w+)\}\}/g, function($0, $1){
			return data[$1] != null ? data[$1] : ""
		})
	}
	
	// 实现事件代理
	function delegate(ele, subject, table) {
		var selectors = Object.keys(table)
		ele.addEventListener(subject, function(e) {
			var target = e.target
			selectors.forEach(function(selector){
				// 原生的 matchesSelector 方法在不同浏览器里名称不同，需要解决兼容性问题
				if (target[MATCHES_SELECTOR](selector)){
					this[selector].call(target, e)
				}
			}, table)
		})
	}

	function pubsub(){
		/**
		 * 对象工厂：
		 *   缺点：每次生成新对象都需要重复生成这些函数，且不能继承。
		 */
		var lib = {}
		return {
			// 广播瞬时消息
			fire: function(subject, args){
        if (lib[subject]){
					lib[subject].forEach(function(handler){
						handler.apply(this, args)
					})
				}
			},
			// 监听/订阅/观察消息
			on: function(subject, handler){
				var observer = lib[subject]
				if (!observer) {
					observer = lib[subject] = []
				}
				observer.push(handler)
			},
			// 取消订阅
			off: function(subject, handler){
				var observer = lib[subject]
				if (observer){
					if (handler){
						var i = observer.indexOf(handler)
						if (i !== -1) {
							observer.splice(i, 1)
						}
					} else {
						observer.length = 0
					}
				}
			}
		}
	}
	
	window.view = view
})(window.document)