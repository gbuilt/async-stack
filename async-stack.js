/*
	Stack:		Async-to-sync queue stack process management - the simplest way possible.
	Install: 	npm install async-stack
	Usage: 		// ADD THE MODULE
				var Stack = require("async-stack"),
					self = this,
					self.sql = {};
				// BUILD THE STACK
				Stack.push(
					function(){
						// On this one, don't call 'next()' until end of inside sql callback!
						require("./path/somesql.js")(1, function(err, result, fields){
							if (err) { throw err; return; }

							// Make the result accessible to the rest of this page
							self.sql.sql1 = result;
							// This would be something like:
							// {
							//		companyname: 'Stack Devs, LLC',
							//		firstname: 'John',
							//		lastname: 'Smith',
							// }

							// Manually call next now that we are ready.
							// We passed 'false' 2nd param to Stack.push()
							// so we can call this here.
							Stack.next();
						});
					}, false
				);
				Stack.push(
					function(){
						// Header
						var header_html = "<!DOCTYPE html><html><head></head><body><header><div class="bold"><span class="data_companyname">{{companyname}}</span></div><br /><br />Welcome, <span class="data_firstname">{{firstname}}</span></header><section>"; // Get/Set your hearder html somehow
						// Then parse/template/dynamic content from sql1 into the html
						// ...
						// ...

						response.write(header_html);
					}
				);
				Stack.push(
					function(){
						// body content
						var body_html = "<b>This would be page header content!</b>"; // Get/Set your hearder html somehow

						// then parse/template/dynamic content with some middleware to insert data from sql1 into the html

						response.write(body_html);
					}
				);
				Stack.push(
					function(){
						// Footer
						var footer_html = "</section><footer>&copy;<span class="data_companyname">{{companyname}}</span> All rights reserved. "; // Get/Set your hearder html somehow
						// Then parse/template/dynamic content from sql1 into the html
						// ...
						// ...

						response.write(footer_html);
						response.end()
					}
				);
				Stack.pushFinish(
					function(){
						response.end()
					}
				);

				// Trigger the Stack calls
				Stack.start();
 */
module.exports = {
	started: false,
	finished: false,
	queue: [],
	queueIndex: 0,
	queueAuto: [],
	finish: [],
	finishIndex: 0,
	finishAuto: [],
	push: function(func,queueAuto){
		var queueAuto = (typeof(queueAuto)=="undefined" ? true : !!queueAuto);
		if (typeof(func)==='function') {
			this.queue.push(func);
			this.queueAuto.push(queueAuto);
		}
	},
	unshift: function(func,queueAuto){
		var queueAuto = (typeof(queueAuto)=="undefined" ? true : !!queueAuto);
		if (typeof(func)==='function') {
			this.queue.push(func);
			this.queueAuto.push(queueAuto);
		}
	},
	pushFinish: function(func,finishAuto){
		var finishAuto = (typeof(finishAuto)=="undefined" ? true : !!finishAuto);
		if (typeof(func)==='function') {
			this.finish.push(func);
			this.finishAuto.push(finishAuto);
		}
	},
	unshiftFinish: function(func,finishAuto){
		var finishAuto = (typeof(finishAuto)=="undefined" ? true : !!finishAuto);
		if (typeof(func)==='function') {
			this.finish.push(func);
			this.finishAuto.push(finishAuto);
		}
	},
	start: function(prefunc){
		if (!this.started) {
			this.started = true;
			if (typeof(prefunc)=='function') {
				prefunc();
			}
			this.next();
		}
	},
	next: function(){
		var _next = this;
		_next.qi = (this.queueIndex++);  // Doing ++ after the variable increments after it's set, so it's one less.
		if (_next.qi<this.queue.length) {
			if (typeof(this.queue[_next.qi])=='function') {
				// Increment the queueIndex and Execute the next function on the stack
				setTimeout(
					function (_next) {
						_next.queue[_next.qi]();
						if (_next.queueAuto[_next.qi]){
							_next.next();
						}
					}
					,1
					,_next
				);
			}
		} else if (this.queueIndex>=this.queue.length) {
			_next.fi = (this.finishIndex++);  // Doing ++ after the variable increments after it's set, so it's one less.
			if (_next.fi<this.finish.length) {
				if (typeof(this.finish[_next.fi])=='function') {
					// Increment the finishIndex and Execute the next function on the stack
					setTimeout(
						function (_next) {
							_next.finish[_next.fi]();
							if (_next.finishAuto[_next.fi]){
								_next.next();
							}
						}
						,1
						,_next
					);
				}
			}
		}
	}
};
