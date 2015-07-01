# async-stack
Async-to-sync queue stack process management - the simplest way possible.

Install: npm install async-stack

Usage:

		// ADD THE MODULE
		var asyncstack = require("async-stack"),  // A Class allowing multiple independent instances.
			Stack = new asyncstack(), // this instance of 'asyncstack'.
			self = this,
			self.sql = {};

		// BUILD THE STACK
		Stack.push(
			function(){
				// On this one, don't call 'next()' until end of inside the mysql callback!
				mysql.query('select some_data from some_table', function(err, result, fields){
					if (err) { throw err; return; }

					// Make the result accessible to the rest of this page
					self.sql.sql1 = result;
					// This would be something like:
					// {
					//		companyname: 'Stack Devs, LLC',
					//		firstname: 'John',
					//		lastname: 'Smith',
					// }

					// NOTE: We passed 'false' 2nd param to Stack.push()
					// Manually call next now that we are ready.
					Stack.next();
				});
			}
			,false  // Passing second param [false] prevents auto-call of .next(), now it must be called manually!
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
			}
		);
		Stack.pushfinish(
			function(){
				response.end();
			}
		);


		// NOTES:
		// There are two additional features, following traditional array handling:
		//  'unshift()' = pre-pend a function to the front/top of the main stack
		//  'unshiftfinish()' = pre-pend a function to the front/top of the finish stack

		// Read the asycn-stack.js code for a number of additional accessors to get the stask lengths,
		//  the current index, isstarted, and isfinished flags of your stack.


		// Make it all happen!
		// Trigger the Stack calls
		Stack.start();


		// Now, go make it better.
