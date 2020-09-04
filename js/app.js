(function(view, playingCardDeck, cardMathingGame) {
	'use strict'

	var _flipCount = 0

	/**
	 * 设计视图接口，视图不能依赖和主动调用 controller，只能广播消息，类似 Cocoa 的 UI 组件向 target 转发 action
	 */
	view.action.on('card:filp', function(index) {
		app.game().flipCardAtIndex(index)
		_flipCount++
		app.updateUI() // 生成数据、更新视图的代码不属于主要业务逻辑，应该单独组织到一起

		// // controller 监听消息，操作数据
		// _flipCount++
		// // controller 操作数据之后，需要通知视图组件用新的数据更新 UI
		// view.updateFlipsLabel({
		// 	count: _flipCount
		// })
		// view.updateCardButtons(function(i){
		// 	if (i === index){
		// 		var card = app.deck().drawRandomCard()
		// 		card.isFaceUp = true
		// 		card.isUnplayable = true
		// 		return { // 每次翻牌时随机填充内容
		// 			contents: card.contents(),
		// 			isFaceUp: card.isFaceUp,
		// 			isUnplayable: card.isUnplayable
		// 		}
		// 	} else {
		// 		return {}
		// 	}
		// })
	})

  /**
	 * 约定：不允许在 app.js 中直接操作 DOM 
	 * 
	 * app.js 仅用于调用和组合 view 和 model 模块、监听消息、公开接口，也就是 controller
	 */
	var app = {
		init: function() {
			view.init({})
		},

		// 牌桌被组合到游戏规则里之后，controller 不需要维护自己的牌桌
		// deck: function(){
    //   return this._deck || (this._deck = playingCardDeck())
		// },

		game: function(){
      return this._game || (this._game = cardMatchingGame({
				count: view.cardButtons.length,
				usingDeck: playingCardDeck()
			}))
		},

		updateUI: function(){
			view.updateFlipsLabel({
				count: _flipCount
			})
			view.updateScoreLabel({
				score: this.game().score()
			})
			view.updateCardButtons(function(i){
				var card = this.game().cardAtIndex(i)
				return {
					contents: card.contents(),
					isFaceUp: card.isFaceUp,
					isUnplayable: card.isUnplayable
				}
			}, this)
		}
	}

	window.app = app
})(window.view, window.playingCardDeck, window.cardMatchingGame)