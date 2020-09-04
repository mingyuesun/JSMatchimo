(function(card){
	'use strict'
	
	var _validSuits,
	    _rankStrings = ["?", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
	
	function PlayingCard(){
		/**
		 * 必须手动调用【父类】的构造函数，手动绑定 this;
		 */
		this.superClass = card.Card
		this.superClass.call(this)
		this.consturctor = PlayingCard
	}
  // 继承的关键是原型链，Object.create 可以直接用一个对象为原型生成新对象，不需要构造函数和 new
	PlayingCard.prototype = Object.create(card.Card.prototype)
	// 【子类的方法】
	var playingCardMethods = {
		// override【父类】的 contents 方法
		contents: function(){
      return _rankStrings[this.rank()] + this.suit()
		},
		match: function(otherCard){
			var score = 0
			if (otherCard.suit() === this.suit()){
				score = 1
			} else {
				score = 4
			}
			return score
		},
		// 牌面花色的存取器
    suit: function(v) {
			if (v === undefined) {
				return this._suit ? this._suit : "?"
			} else {
				// 改为静态方法，频繁执行的函数会生成大量一次性的数据，影响旧浏览器的 GC 性能
				if (PlayingCard.validSuits()[v]) {
					this._suit = v
				}
				return this._suit
			}
		},
		// 牌面大小的存取器
		rank: function(v) {
			if (v === undefined) {
				return this._rank
			} else {
				if (v <= PlayingCard.maxRank()){
					// 存储编号，之后查表转换
					this._rank = v
				}
				return this._rank
			}
		}
	}
  // 在【子类】原型上扩展出这些方法
	Object.keys(playingCardMethods).forEach(function(name) {
		this[name] = playingCardMethods[name]
	}, PlayingCard.prototype)

  // 静态方法
  PlayingCard.maxRank = function(){
		return _rankStrings.length - 1
	}

	PlayingCard.validSuits = function(){
		if (!_validSuits){
			_validSuits = {"♠": 1, "♥": 1, "♦": 1, "♣": 1}
		}
		return _validSuits
	}

	function exports(){
		return new PlayingCard()
	}

	exports.PlayingCard = PlayingCard
	window.playingCard = exports
})(window.card)