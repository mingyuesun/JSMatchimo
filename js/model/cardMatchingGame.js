(function(){
	'use strict'
	
	var FLIP_COST = 1,
			MATCH_BONUS = 4,
			MISMATCH_PENALTY = 2;

	function CardMatchingGame(opt){
		this._cards = []
		this._score = 0
		var card;
		for (var i = 0; i < opt.count; i++){
			// 通过参数传递把 Deck 或其【子类】的实例【组合】进来，避免当前模块依赖具体的 Deck 模块
			card = opt.usingDeck.drawRandomCard()
			this._cards.push(card)
		}
	}
	
	CardMatchingGame.prototype = {
		
		score: function(){
			return this._score
		},

		cardAtIndex: function(index){
			return this._cards[index]
		},

		flipCardAtIndex: function(index) {
				// 翻牌时的游戏规则，游戏规则需要调用 playingCard 的 match 方法
			var card = this.cardAtIndex(index)
			if (!card.isUnplayable){
				if (!card.isFaceUp){
					var otherCard, matchScore;
					for (var i = 0; i < this._cards.length; i++){
						otherCard = this._cards[i]
						if (otherCard.isFaceUp && !otherCard.isUnplayable){
							matchScore = card.match(otherCard)
							if (matchScore){
								otherCard.isUnplayable = true
								card.isUnplayable = true
								this._score += matchScore * MATCH_BONUS
							} else {
								otherCard.isFaceUp = false
								this._score -= MISMATCH_PENALTY
							}
							break
						}
					}
					this._score -= FLIP_COST
				}
				// 改变 model 的状态
				card.isFaceUp = !card.isFaceUp
			}
		}
	}

	function exports(opt){
		return new CardMatchingGame(opt)
	}
	
	exports.CardMatchingGame = CardMatchingGame
	
	window.cardMatchingGame = exports
})()