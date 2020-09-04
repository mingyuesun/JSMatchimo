(function(){
	'use strict'

	function Deck(){
		
	}

	Deck.prototype = {

    cards: function(){
			return this._cards || (this._cards = [])
		},

		addCard: function(card, opt){
			opt = opt || {}
			if (opt.atTop) {
        this.cards().unshift(card)
			} else {
        this.cards().push(card)
			}
		},

		drawRandomCard: function(){
			/**
			 * 
			 */
			var randomCard,
					cards = this.cards(); // 缓存作用域链上层的变量或函数结果，常用于性能热点优化或节省字符
			if (cards.length) {
				var index = parseInt(Math.random() * cards.length, 10)
				randomCard = cards[index]
				cards.splice(index, 1) // 从 array 中删除
			}	
			return randomCard	
		}

	}

	function exports(){
		return new Deck()
	}

	exports.Deck = Deck
	window.deck = exports
})()