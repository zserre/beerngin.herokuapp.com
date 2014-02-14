
//Brew Model
var Brew = Backbone.Model.extend({
	urlRoot: '/brews'
});


//Brews Collection
var Brews = Backbone.Collection.extend({
	url: '/brews'
});

var BrewList = Backbone.View.extend({
	el: '.page',
	render: function(){
  		var brews = new Brews();
    	var that = this;
    	brews.fetch({
      	success: function(brews){
        		brews.models = _.sortBy(brews.models, function(item){return item.attributes.statusID});
        		var template = _.template($('#brew-list-template').html(), {brews: brews.models});

        		that.$el.html(template);
      	}
    	})
    	$("#navBrew").refreshMenu();
	}
});

var EditBrew = Backbone.View.extend({
	el: '.page',
	render: function(options){
		var that = this;
		if(options.id){
			that.brew = new Brew({id: options.id});
			that.brew.fetch({
					success: function(brew){
						var template = _.template($('#edit-brew-template').html(), {brew: brew});
    					that.$el.html(template);
    					that.addFormListners(that);
				}
			});  
		}
		else{
			var template = _.template($('#edit-brew-template').html(), {brew: null});
    		this.$el.html(template);
    		this.addFormListners(this);
		}
		$("#navBrew").refreshMenu();
	},
	events: {
		'submit .edit-brew-form': 'saveBrew',
		'click .delete': 'deleteBrew'
	},
	saveBrew: function(ev){
		var brewDetails = $(ev.currentTarget).serializeObject();
		var brew = new Brew();
		brew.save(brewDetails, {
			success: function(){
				router.navigate('#/homebrewing'), {trigger: true};
			},
			error: function(){
				alert("Unknown username.")
			}
		});   
		return false;     		
	},
	addFormListners: function(ctx){
		ctx.$("#dpBrew").datepicker();
		ctx.$("#dpBrew").on('changeDate', function(ev){
			$("#dpBrew").datepicker('hide')
		});
  		ctx.$("#brewStatusList li").click(function(e){
			ctx.$("#brewStatus").html($("a", this).text() + ' <span class="caret">');
			if(parseFloat($(this).val()) == 0){
			  	ctx.$('#tapNumber').removeClass("disabled");
			}else{
				ctx.$('#tapNumber').addClass("disabled");
				ctx.$("#tapNumber").html('None <span class="caret">');
				ctx.$("#hiddenTapNumber").val("0");
			}
			ctx.$("#hiddenBrewStatus").val($(this).val());
			ctx.$("#hiddenBrewStatusName").val($("a", this).text() + ' ');
			
		});
		ctx.$("#tapNumberList li").click(function(e){
			ctx.$("#tapNumber").html($("a", this).text() + ' <span class="caret">');
			ctx.$("#hiddenTapNumber").val($(this).val());
		});
	},
	deleteBrew: function(ev){		
		this.brew.destroy({
			success: function(){
				console.log("delete success");
				router.navigate('#/homebrewing'), {trigger: true};
			},
			error: function(){
				alert("Unknown username.")
				console.log("error");
			}
		})
		return false;
	}
});

var Home = Backbone.View.extend({
	el: '.page',
	render: function(){
		var that = this;
    	var template = _.template($('#home-template').html(), {});
    	that.$el.html(template);
    	$("#navHome").refreshMenu();
	}
});

var Code = Backbone.View.extend({
	el: '.page',
	render: function(){
		var that = this;
    	var template = _.template($('#code-template').html(), {});
    	that.$el.html(template);
    	$("#navCode").refreshMenu();
	}
});

var About = Backbone.View.extend({
	el: '.page',
	render: function(){
		var that = this;
    	var template = _.template($('#about-template').html(), {});
    	that.$el.html(template);

    	$("#navAbout").refreshMenu();
	}

});

var Router = Backbone.Router.extend({
	routes: {
    	'': 'home',
    	'newBrew': 'editBrew',
    	'code': 'code',
    	'homebrewing': 'homebrewing',
    	'about': 'about',
    	'edit/:id' : 'editBrew'
	}
});

var home = new Home();
var code = new Code();
var brewList = new BrewList();
var editBrew = new EditBrew();
var about = new About();

var router = new Router();

router.on('route:home', function(){
	home.render();
});

router.on('route:code', function(){
	code.render();
});

router.on('route:homebrewing', function(){
	brewList.render();
});

router.on('route:editBrew', function(id){
	editBrew.render({id:id});
});

router.on('route:about', function(){
	about.render();
});

Backbone.history.start();