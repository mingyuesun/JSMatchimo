(function() {
	'use strict'

  // Constructor(构造函数)是普通函数，不是 Class
	function Card(){
		/**
		 * this 是 late binding 的
		 * prototype 只应该用来定义方法，属性必须在构造函数内定义才能保证每个实例都持有自己的属性（引用类型）
		 */
		
		this.isFaceUp = false;
		this.isUnplayable = false;
	}

  // prototype 是普通对象
	Card.prototype = {
		/**
		 * (new Card().contents)()时，this 指向新对象;
		 * (false || new Card().contents)()时，this 指向 Global Object;
		 * 
		 * 用下划线前缀显式声明 private member，但不存在真正的约束；
		 * this._contents 使用前不需要声明，因为 JS 的 object 都是 dynamic mutable object, 不存在的属性、没有实参的形参、未赋值的变量，访问得到的都是 undefied
		 */
    contents: function(v){
			if (v === undefined) {
				return this._contents
			} else {
				return this._contents = v
			}
		},
		/**
		 * 自省/类型判断: typeof, Array.isArray, toString, constructor, instanceof,.....
		 */
		match: function(otherCards) {
			var score = 0
			if (Array.isArray(otherCards)) {
        otherCards.forEach(compare, this)
			} else {
        compare.call(this, otherCards)
			}
			function compare(card) {
				/**
				 * 函数内的函数，都会形成 Closure(闭包)，通过自己的 Scope 存储上层函数的 "Variable object" (因此也能访问到上层函数的 Scope 存储的更上 "Variable object")
				 * 
				 * 假如 compare 被暴露给外部访问，则 match 的上下文会一直保留不会被 GC（垃圾回收）
				 */
				if (card.contents() === this.contents()) {
					score = 1
				}
			}
			return score
		}
	}
  
	function exports(){
		/**
		 * new 操作符用函数的 prototype 属性作为模板，复制出新的对象，Card 本身的 return 只要不是对象就被忽略
		 * 用 new 调用 Card 时，在进入 Card 函数上下文的阶段，this 被指向复制出来的新对象
		*/
		return new Card()
	}

	exports.Card = Card
  // 以工厂函数 / Wrapper / 模块对象作为 public API，避免紧耦合等问题
	window.card = exports
})()

/**
 * Card 和 contents 被作为属性(property)形式的引用值被调用时，this 指向属性所属的对象，当作为 Identifier(比如变量名)形式的引用值或实际值被调用时，this被默认填充为 Global Object
 */