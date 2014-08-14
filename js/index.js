$(function(){

	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};


	//model of one calculation
	App.Models.Сalculation = Backbone.Model.extend({
		defaults: {
			firstNumber: 0,
			operand: '+',
			secondNumber: 0,
			result: 0
		},

		add: function () {
			this.set({result: this.get('firstNumber') + this.get('secondNumber')});
			return this.get('result')
		},

		sub: function () {
			this.set({result: this.get('firstNumber') - this.get('secondNumber')});
			return this.get('result')
		},

		mul: function () {
			this.set({result: this.get('firstNumber') * this.get('secondNumber')});
			return this.get('result')
		},

		div: function () {
			this.set({result: this.get('firstNumber') / this.get('secondNumber')});
			return this.get('result')
		},

		calc: function () {
			if(this.get('operand') == "+") this.add();
			if(this.get('operand') == "-") this.sub();
			if(this.get('operand') == "*") this.mul();
			if(this.get('operand') == "/") this.div();
		}

	});

	// colection of calculations

	App.Collections.Сalculation = Backbone.Collection.extend({
		model: App.Models.Сalculation
	});

	//View for calculation

	App.Views.Сalculation = Backbone.View.extend({
		tagName: 'li',
		template: _.template('<%= firstNumber %> <%= operand %> <%= secondNumber %> = <%= result %>'),


		initialize: function () {
		 this.render();
		},

		render: function () {
			this.model.calc();
			//console.log(this.model);
			this.$el.html( this.template( this.model.toJSON() ) );

		}

	});

	var calculation = new App.Models.Сalculation();

	//view for calculations of colection

	App.Views.HistoryCollections = Backbone.View.extend({
		tagName: 'ul',
		id: 'historyUl',

		initialize: function () {
			//console.log(this.collection);
		},

		render: function () {

			this.collection.each(function (num) {
				calculation=this.collection.get(num);
				var calculationView = new App.Views.Сalculation({model: calculation});
								

				this.$el.append(calculationView.el);
			}, this);
			return this;
		}

	});


	
		var calculationCollection = new App.Collections.Сalculation([
			// {firstNumber: 2, operand: "*", secondNumber: 1},
			// {firstNumber: 2, operand: "-", secondNumber: 1},
			// {firstNumber: 2, operand: "+", secondNumber: 1},
			// {firstNumber: 2, operand: "/", secondNumber: 1}
			]);


		var historyView = new App.Views.HistoryCollections({collection: calculationCollection});

		var numbers = '';
		var firstNumber = '';
		var secondNumber = '';
		var operand = '';
		var result = '';

		$(".numbers").click(function () {

			if(result == 1) {$("#display").val(''); result = '';}
			numbers += $(this).text();
			$("#display").val($("#display").val() + $(this).text());

			//console.log(numbers);
		});

		$(".operations").click(function () {
					
			if(operand == '')
			{
				firstNumber = +(numbers);
				if(firstNumber != '')
				{					
					numbers = '';
					operand = $(this).text();

					$("#display").val($("#display").val() + $(this).text());

					//console.log(numbers + "ope" + operand);
				}
			}
				
		});

		$("#equal").click(function () {
			secondNumber = +(numbers);
			numbers = '';

			var calculationAdd = new App.Models.Сalculation({firstNumber: firstNumber, secondNumber: secondNumber, operand: operand});
			var calculationView = new App.Views.Сalculation({model: calculationAdd});

			$("#historyUl").append(calculationView.el);
			$("#display").val(calculationAdd.get('result'));

			calculationCollection.add(calculationAdd);
			operand = '';
			result = 1;
		});

		$("#clear").click(function () {
			$("#display").val('');

			firstNumber = '';
			secondNumber = '';
			operand = '';
			numbers = '';

		});



		$("#history").html(historyView.render().el);

	
});



