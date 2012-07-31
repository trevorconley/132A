		$(document).ready(function(){
			
			//library tabs register
			$("#tabs nav ul li").each(function(){
				//register event for each tab
				var placeholder = $(this);
				var cat = placeholder.attr("data-category");
				
				//set it all hidden
				
				placeholder.bind("click",function(){
					
					$("#tabs nav ul li").removeClass("selected");
					$(this).addClass("selected");
					
					$("#elementContainer .draggable .resizeable").parent().hide();
				
					$("#elementContainer .draggable .resizeable").each(function(){
						var target = $(this);
						var target_cat = target.attr("data-category").split(' ');
						for(var j=0; j < target_cat.length; j++){
							if(cat == target_cat[j]){
								target.parent().show();
								break;
							}
						}
					});
				});
				
			});	
			
			//palette tabs register
			$("#palette fieldset").hide();
			$("#palette fieldset[data-category=coord]").show();
			$("#palette footer ul li").each(function(){
				//register event for each tab
				var placeholder = $(this);
				var cat = placeholder.attr("data-category");
				
				//set it all hidden
				
				placeholder.bind("click",function(){
					
					$("#palette footer ul li").removeClass("selected");
					$(this).addClass("selected");
					
					$("fieldset").hide();
				
					$("#palette fieldset").each(function(){
						var target = $(this);
						var target_cat = target.attr("data-category");
							if(cat == target_cat){
								target.show();
							}
					});
				});
				
			});					
			
			//tool tips!
			$("label#width").qtip({
				content: 'Width of the element', 
				position: {
					my: 'bottom left',
					at: 'top right'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			$("label#height").qtip({
				content: 'Height of the element', 
				position: {
					my: 'bottom left',
					at: 'top right'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			$("label#x").qtip({
				content: 'X coordinate of the element', 
				position: {
					my: 'bottom left',
					at: 'top right'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			$("label#y").qtip({
				content: 'Y coordinate of the element', 
				position: {
					my: 'bottom left',
					at: 'top right'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			
			//Tooltips for quickadd
			$("i.icon-plus-sign").qtip({
				content: 'Quickly add any element to your website just by typing the name', 
				position: {
					my: 'bottom left',
					at: 'top right'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			
			//Tooltips for search
			$("div#searchBox").qtip({
				content: 'Search for any element', 
				position: {
					my: 'bottom left',
					at: 'top left'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			
			//Tooltips for library elements
			$("span.sbtntext").qtip({
				content: 'Button - try dragging to the canvas!', //button text
				position: {
					my: 'bottom left',
					at: 'top left'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			
			$("div#libBrowserOuterFrame").qtip({ //mock browser
				content: 'Web browser - try dragging to the canvas!', 
				position: {
					my: 'bottom left',
					at: 'top left'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			
			$("div#libImage").qtip({
				content: 'Image - try drgging to the canvas!', //image
				position: {
					my: 'bottom left',
					at: 'top left'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			
			$("div#libDummyContainer").qtip({
				content: 'Text box - try dragging to the canvas!', //text box
				position: {
					my: 'bottom left',
					at: 'top left'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			
			$("div#libButtonBarBox").qtip({
				content: 'Button bar box - try dragging to the canvas!', //button bar
				position: {
					my: 'bottom left',
					at: 'top left'
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			
			$("div#libSearchBox").qtip({
				content: 'Search box - try dragging to the canvas!', //search box
				position: {
					my: 'bottom left',
					at: 'top left' 
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
			
			$("h1.libHeader").qtip({
				content: 'Header - try dragging to the canvas!', //header box
				position: {
					my: 'bottom left',
					at: 'top left' 
				},
				show: 'mouseover', 
				hide: 'mouseout'
			});
		});