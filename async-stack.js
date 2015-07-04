module.exports = (function(){

	function asyncstack() {

		//private
		var flagstarted = false,
			flagfinished = false,
			mainqueue = [],
			mainindex = 0,
			mainauto = [],
			finishqueue = [],
			finishindex = 0,
			finishauto = [],
			bool = function(v){return (typeof(v)==="undefined"?true:!!v)},  // default to true
			self = this;

		this.isstarted = function(){
			return flagstarted;
		};
		this.isfinished = function(){
			return flagfinished;
		};
		this.getpushlength = function(){
			return mainqueue.length;
		};
		this.getpushindex = function(){
			return mainindex;
		};
		this.getpushfinishlength = function(){
			return finishqueue.length;
		};
		this.getpushfinishindex = function(){
			return finishindex;
		};
		this.push = function(func,autonext){
			var autonext = bool(autonext);
			if (typeof(func)==='function') {
				mainqueue.push(func);
				mainauto.push(autonext);
				return true;
			}
			return false;
		};
		this.unshift = function(func,autonext){
			var autonext = bool(autonext);
			if (typeof(func)==='function') {
				mainqueue.unshift(func);
				mainauto.unshift(autonext);
				return true;
			}
			return false;
		};
		this.pushfinish = function(func,autonext){
			var autonext = bool(autonext);
			if (typeof(func)==='function') {
				finishqueue.push(func);
				finishauto.push(autonext);
				return true;
			}
			return false;
		};
		this.unshiftfinish = function(func,autonext){
			var autonext = bool(autonext);
			if (typeof(func)==='function') {
				finishqueue.unshift(func);
				finishauto.unshift(autonext);
				return true;
			}
			return false;
		};
		this.next = function(){
			if (mainindex<mainqueue.length) {
				flagfinished = false;
				setTimeout(
					function () {
						if (typeof(mainqueue[mainindex])==="function") {
							mainqueue[mainindex]();
						}
						mainindex++;
						if (mainauto[mainindex-1]){
							self.next();
						}
					}
					,1
				);
				return true;
			} else if (finishindex<finishqueue.length) {
				flagfinished = false;
				setTimeout(
					function () {
						finishqueue[finishindex]();
						finishindex++;
						if (finishauto[finishindex-1]){
							self.next();
						}
					}
					,1
				);
				return true;
			}
			flagfinished = true;
			return true;
		};
		this.start = function(){
			if (!flagstarted) {
				flagstarted = true;
				self.next();
				return true;
			}
			return false;
		};
	};

	return asyncstack;

})();
