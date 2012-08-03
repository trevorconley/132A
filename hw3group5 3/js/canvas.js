function eN(value)
{
    var n = parseInt(value);
	
    return n == null || isNaN(n) ? 0 : n;
}
var lru =[];
var numWidgets = 0;
var live_widgets={};
var avail_widgets= ['button', 'buttonbar', 'table', 'tablet', 'tabcontainer', 'textbox', 'rectangle', 'accordion', 'image', 'verticaltab', 'horizontaltab', 'search', 'section' , 'datepicker', 'tabbar'];
var actions = [];
actions[0] = null;
var state = 0;
var dragging = 0;
search_widget =
{
	search_content: '',
	prepare_search: function(e) {
		var evt = e || window.event;
		if (evt.keyCode == 13){
			var search_results = document.getElementById('outputResults');
			var w = document.getElementById(search_results.firstChild.textContent);
			addWidget(w,100,200,w.style.width,w.style.height,w.innerHTML);
			document.getElementById('searchfield').value = '';
			target = evt.target == null? evt.srcElement : evt.target;
			target.onkeyup = null;	
	
		    
		    evt.returnValue=false; //microsoft
		    return false; //same as evt.preventDefault(); //firefox, chrome
		}
		else {
			target = evt.target == null? evt.srcElement : evt.target;
			target.onkeyup = search_widget.focusSearch;
		}
	},
	
	focusSearch: function (e){
		var search_results = document.getElementById('outputResults');
		var search_box = document.getElementById('searchfield');
		search_content = search_box.value;
		if (search_content.length>0) {
			if(e.keyCode!=13){
				search_results.innerHTML = '';
				var matching = new RegExp(search_content,'i');
				for (var i=0;i<avail_widgets.length;i++){
					if (matching.test(avail_widgets[i])){
						search_results.innerHTML+=avail_widgets[i]+'<br/>';
					}
				}
			}

		}
		else{
			search_results.innerHTML ='';
			search_results.style.visibility ='hidden';
			return false;
		}

		if (search_results.innerHTML.length > 0){
			search_results.style.visibility = 'visible';
		}
		else{
			search_results.style.visibility ='hidden';
		}
	}
}



dropObject =
{
	target_self:undefined,
	initialLeft:undefined,
	initialTop:undefined,
	initialX:undefined,
	initialY:undefined,
	clicking : undefined,
	recent: 0,
	initDrop: function(element)
	{
		var ele = document.getElementById(element);
		ele.onmousedown = dropObject.mouseDown;
		ele.style.cursor = 'move';
	},
	mouseDown: function(e)
	{
		var evt = e || window.event;
		var pos = getPosition(evt);
		var temp = evt.target == null ? evt.srcElement : evt.target;
		while (temp.parentNode.id!='elementContainer'){
			temp = temp.parentNode;
		}
		//console.log(temp)
		var offset = getOffset(temp);
		dropObject.target_self = temp;
		dropObject.initialLeft = offset.x;
		dropObject.initialTop = offset.y;
		dropObject.initialX=pos.x;
		dropObject.initialY=pos.y;
		document.onmousemove=dropObject.mouseMove;
		document.onmouseup = dropObject.mouseUp;
		dropObject.clicking = 1;
		return false;
	},
	mouseMove: function(e)
	{
		dropObject.clicking = 0;
		var evt = e || window.event;
		var pos = getPosition(evt);
		return false;
	},
	mouseUp: function(e)
	{
		document.onmousemove = null;
		var evt = e || window.event;
		if (dropObject.clicking == 0){
			if (within(evt)){
				var pos = getPosition(evt);

				addWidget(dropObject.target_self,pos.x,pos.y,dropObject.target_self.style.width,dropObject.target_self.style.height,dropObject.target_self.innerHTML);
				actions[++state]=JSON.stringify(live_widgets);
			}
			//console.log(actions[state])
			document.onmouseup = null;
			dropObject.target_self = null;
			return false;
		}
		else {
			dropObject.initTouch(evt,dropObject.target_self);
		}
		/*
		var recent = dropObject.target_self.cloneNode(true);
		recent.dataCategory = 'recent';
		lru[dropObject.recent] = recent;
		for (var i=0;i<3;i++){
			if(lru[i]!=null){
				document.getElementById('elements').appendChild(lru[i]);
			}
		}
		dropObject.recent=(dropObject.recent++)%3;*/
	},
	initTouch: function(e,ele)
	{
		var evt = e || window.event;
		var target = evt.target == null ? evt.srcElement : evt.target;
		var pos = getPosition(evt);
		var offset = getOffset(target);

		var iLeft = offset.x;
		var iTop = offset.y;
		var iX=pos.x;
		var iY=pos.y;

		if (target!=null){
			addWidget(ele,pos.x,pos.y,ele.style.width,ele.style.height,ele.innerHTML);
			touch(evt,properties.active,iLeft,iTop,iX,iY);
		}
		dropObject.target_self = null;
		//properties.active.onmousemove = null;
		//document.onmousedown = null;
		//document.onmouseup = null;
	}
}
function touch(e,element,iL,iT,initialX,initialY){
	document.onmousemove = function(e){
		var evt = e || window.event;
		var pos = getPosition(evt);
		element.style.left = iL+pos.x-initialX+'px';
		element.style.top = iT+pos.y-initialY+'px';
		element.style.zIndex = '100';
		document.onmousedown = function(e){
			document.onmousemove = null;
			document.onmousedown = null;
		}
	}
}

dragObject =
{
	target_self:undefined,
	initialLeft:undefined,
	initialTop:undefined,
	initialX:undefined,
	initialY:undefined,
	
	initDrag: function(element)
	{
		document.getElementById(element).onmousedown = dragObject.mouseDown;
	},
	mouseDown: function(e)
	{
		var evt = e || window.event;
		var pos = getPosition(evt);
		var target = evt.target == null ? evt.srcElement : evt.target;
		while (target.parentNode != document.body){
			target = target.parentNode;
		}
		properties.active = target;

		var offset = getOffset(target);
		dragObject.target_self = target;
		dragObject.initialLeft = offset.x;
		dragObject.initialTop = offset.y;
		dragObject.initialX=pos.x;
		dragObject.initialY=pos.y;
		dragObject.target_self.onmousemove=dragObject.mouseMove;
		document.onmouseup = dragObject.mouseUp;
		//evt.cancelBubble = true;
		//if (evt.stopPropagation) evt.stopPropagation();
		return false;
	},
	mouseMove: function(e)
	{
		dragging = 1;
		var evt = e || window.event;
		//var target = evt.target == null ? evt.srcElement : evt.target;
	
		var pos = getPosition(evt);
		var zone = document.getElementById('canvas');
		var zoneOffset = getOffset(zone);
		var offset = getOffset(dragObject.target_self);
		dragObject.target_self.style.left = dragObject.initialLeft+pos.x-dragObject.initialX+'px';
		dragObject.target_self.style.top = dragObject.initialTop+pos.y-dragObject.initialY+'px';

		//bounday sane
		var offset = getOffset(dragObject.target_self);
		if(offset.x<zoneOffset.x){
			dragObject.target_self.style.left = zoneOffset.x+'px';
		}
		if(offset.y<zoneOffset.y){
			dragObject.target_self.style.top = zoneOffset.y+'px';
		}
		if(offset.y+dragObject.target_self.clientHeight>zoneOffset.y+zone.clientHeight){
			dragObject.target_self.style.top = zoneOffset.y+zone.clientHeight-dragObject.target_self.clientHeight+'px';		
		}
		if(offset.x+dragObject.target_self.clientWidth>zoneOffset.x+zone.clientWidth){
			dragObject.target_self.style.left = zoneOffset.x+zone.clientWidth-dragObject.target_self.clientWidth+'px';		
		}
		// prevent text selection in IE
        //document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        //target.ondragstart = function() { return false; };
        if (evt.preventDefault)
			evt.preventDefault();
		return false;
	},
	mouseUp: function(e)
	{
		dragObject.target_self.onmousemove = null;
		document.onmouseup = null;
		var evt = e || window.event;

		if(dragging == 0){
	    	if (live_widgets[dragObject.target_self.id]) {
				properties.change(dragObject.target_self);
			}
		}
		else {
	    	if (live_widgets[dragObject.target_self.id]) {
				live_widgets[dragObject.target_self.id] =  
				{
					origin: live_widgets[dragObject.target_self.id].origin,
					left: eN(dragObject.target_self.style.left),
					top: eN(dragObject.target_self.style.top),
					width: dragObject.target_self.clientWidth,
					height: dragObject.target_self.clientHeight,
					text: dragObject.target_self.innerHTML
				}
			}
			actions[++state]=JSON.stringify(live_widgets);
			dragging = 0;
		}
		dragObject.target_self = null;
		return false;
	}
}
resizeObject=
{
	target_self:undefined,
	origin:undefined,
	initialWidth:undefined,
	initialHeight:undefined,
	initialX:undefined,
	initialY:undefined,
	offsetX:undefined,
	offsetY:undefined,
	initResize: function(element){
		document.getElementById(element).onmouseover= resizeObject.changeCursor;
	},
	mouseDown: function(e){
		var evt = e ||window.event;
		var target = evt.target==null? evt.srcElement : evt.target;
		var pos = getPosition(evt);
		properties.active = target;
		resizeObject.origin = target;
		resizeObject.initialX =pos.x;
		resizeObject.initialY = pos.y;
		resizeObject.initialWidth= resizeObject.target_self.clientWidth;
		resizeObject.initialHeight = resizeObject.target_self.clientHeight;
		document.onmousemove = resizeObject.resize;
		//evt.cancelBubble = true;
		//if (evt.stopPropagation) evt.stopPropagation();
		return false;
		
	},
	resize: function(e){
		var evt = e||window.event;
		var pos = getPosition(evt);
		resizeObject.offsetX = pos.x - resizeObject.initialX;
		resizeObject.offsetY = pos.y - resizeObject.initialY;
		resizeObject.origin.style.width = resizeObject.initialWidth+resizeObject.offsetX+'px';
		resizeObject.origin.style.height = resizeObject.initialHeight+resizeObject.offsetY+'px';
		document.onmouseup = resizeObject.mouseUp;		
		return false;
		
	},
	mouseUp: function(e){
		document.onmousemove = null;
		document.onmouseup = null;
		resizeObject.target_self=null;
		live_widgets[resizeObject.origin.id] =
		{
			origin: live_widgets[resizeObject.origin.id].origin,
			left: eN(resizeObject.origin.style.left),
			top: eN(resizeObject.origin.style.top),
			width: eN(resizeObject.origin.style.width),
			height: eN(resizeObject.origin.style.height),
			text: resizeObject.origin.innerHTML
		}
		actions[++state]=JSON.stringify(live_widgets);
		resizeObject.origin=null;
		return false;
	},
	changeCursor: function(e){
		var evt = e ||window.event;
		resizeObject.target_self = evt == null ? evt.srcElement : evt.target;
		var pos = getPosition(evt);
		var offset = getOffset(resizeObject.target_self);
		var tempX = offset.x+resizeObject.target_self.clientWidth;
		var tempY = offset.y+resizeObject.target_self.clientHeight;
		if ((offset.x+resizeObject.target_self.clientWidth-pos.x)<17
			&& (offset.y+resizeObject.target_self.clientHeight-pos.y)<17){
			resizeObject.target_self.style.cursor = 'se-resize';
			resizeObject.target_self.onmousedown = resizeObject.mouseDown;
			return;
		}
		else{
			resizeObject.target_self.style.cursor = 'auto';
			resizeObject.target_self.onmousedown = dragObject.mouseDown;
			//document.onmousemove = null;
			return;

		}
	}

}
//here
properties =
{
	active: undefined,
	changed: undefined,
	oldHTML: undefined,
	/*
	initProperty: function(element){
		console.log(dragging);
		document.getElementById(element).onclick=properties.change;
	},*/
	change: function(element){
		//var evt = e ||window.event;
		properties.changed = false;
		properties.active = element;

		var temp = properties.active;
		if(live_widgets[properties.active.id].origin=='w0'){
			console.log('asd')
		while(temp!=null && temp.data==null)
		{
			if(temp.firstChild!=null){
				temp = temp.firstChild;
				properties.oldHTML = temp.data;
			}
			else temp = null;
		}
		var area = document.createElement('TEXTAREA');
		if (live_widgets[properties.active.id]) {		
			if (properties.active.firstChild!=null){
				area.id = 'change';
				area.style.width = 125+'px';
				area.style.height = 75+'px';
				area.innerHTML = properties.oldHTML;
				var old = properties.active.firstChild;
				properties.active.insertBefore(area,old);
				properties.active.removeChild(old);
			}
		dragging = 0;

		area.focus();
		area.onblur = properties.save;
		//document.onclick = properties.save;
		area.onkeyup = properties.textEdit;
		}}
	},
	textEdit: function(e){
		var evt = e ||window.event;
		if(e.keyCode=='13'){
			//document.getElementById('change').value+=''\n'';
		}
		properties.changed = true;
		evt.returnValue=false; 
		return false;
	},
	save: function(e){
		document.onclick=null;
		var area = document.getElementById('change');
		if(properties.changed==true){
			var val = area.value;
			var node = document.createTextNode(val);
			node.data.replace(/\r\n|\r|\n/g,'<br />');
			properties.active.insertBefore(node,area);
			properties.active.removeChild(area);
			properties.changed = false;
			if (live_widgets[properties.active.id]) {
					live_widgets[properties.active.id] =  
					{
						origin: live_widgets[properties.active.id].origin,
						left: eN(properties.active.style.left),
						top: eN(properties.active.style.top),
						width: properties.active.clientWidth,
						height: properties.active.clientHeight,
						text: properties.active.innerHTML
					}
			}
			actions[++state]=JSON.stringify(live_widgets);
			//console.log(actions[state])
			//console.log((state))
		}
		else{
			properties.active.innerHTML = properties.oldHTML;
			//properties.active.removeChild(area);
		}
	}
}

	/*
		var leftIn = document.getElementById('leftIn');
		var topIn = document.getElementById('topIn');
		var widthIn = document.getElementById('widthIn');
		var heightIn = document.getElementById('heightIn');
		properties.active.style.width = widthIn.value +'px';
		properties.active.style.height = heightIn.value +'px';
		properties.active.style.left = leftIn.value +'px';
		properties.active.style.top = topIn.value +'px';*/

/***********HELPER FUNCTIONS**************************************/
function addWidget(element,left,top,width,height,text){
	//calculate position or something
	//and create div at this position
	var working_array=[];//existing widgets
	if (left && top)
	{
		if(width<125) width = 125;
		if (height<50) height = 50;
		if (typeof element === 'string'){
			element = document.getElementById(element);
		}
		var clone = element.cloneNode(true);
		clone.id ='widget'+numWidgets;
		clone.style.left = left+'px' ;
		clone.style.top = top+'px' ;
		clone.className = 'active';
		clone.style.width = width+'px';
		clone.style.height = height+'px';
		clone.style.position = 'absolute';
		if (text.length>0){
			clone.innerHTML = text;
		}
		document.body.appendChild(clone);
		//dragObject.initDrag(clone.id);
		resizeObject.initResize(clone.id);
		live_widgets[clone.id] =  
		{
			origin: element.id,
			left: left,
			top: top,
			width: width,
			height: height,
			text: text	
		}
		//console.log(live_widgets);
		properties.active = clone;
		numWidgets++;
	}
	else if (left == null & top == null)
	{

	}
}
//within drop zone
function within(e){
	var evt = e || window.event;
	var pos = getPosition(evt);
	var zone = document.getElementById('canvas');

	var zoneOffset = getOffset(document.getElementById('canvas'));
	if (
		(pos.x>=zoneOffset.x 
		&& pos.x<zoneOffset.x+zone.clientWidth
		&& pos.y>=zoneOffset.y
		&& pos.y<zoneOffset.y+zone.clientHeight) 
		||(0)
		){
		return true;
	}
	else {
		return false;
	}
}

//limits the ability to move objects out of page
function zoneLimit(element){
	var offset = getOffset(element);
	var zone = (document.getElementById('canvas'));
	var zoneOffset = getOffset(zone);
	console.log('zone'+zoneOffset.x + ' ' +zoneOffset.y);
	console.log('widget' +offset.x + ' ' +offset.y);
	if(offset.x+2>=zoneOffset.x){
	
		return true;
	}
	else return false;
	
}
function resetPosition(element){
	var offset = getOffset(element);
	var zone = (document.getElementById('canvas'));
	var zoneOffset = getOffset(zone);
	if (offset.x<=zoneOffset.x){
		console.log('reset');
		element.style.left = zone.style.offsetLeft;

	}
	else{
		return false;
	}	
}
//get position even with page scroll
function getPosition(e){
	var evt =e || window.event;
	var position = [];
	if (e.pageX && e.pageY){
		position.x =e.pageX;
		position.y =e.pageY;
	}
	else{
		position.x = e.clientX + document.body.scrollLeft+ document.documentElement.scrollLeft;
		position.y =  e.clientY + document.body.scrollTop+ document.documentElement.scrollTop;
	}
	return position;

}

//get offset incase of nested divs
function getOffset(element){
	var position = [];
	position.x = element.offsetLeft;
	position.y = element.offsetTop;
	while (element = element.offsetParent){
		position.x += element.offsetLeft;
		position.y += element.offsetTop;
	}
	return position;

}
function showOptions(){
	var obj = document.getElementById('options');
	obj.style.visibility = 'visible';
	document.onclick = function(){
		//obj.style.visibility = 'hidden';
	}
}

function save(){
	if (!localStorage){
		createCookie('live_widgets',JSON.stringify(live_widgets),7)
	}
	else{
		localStorage['live_widgets'] = JSON.stringify(live_widgets);
	}
}
function load(){
	var old =  getElementsByClass('active');
	for (var i in old){
		old[i].style.visibility = 'hidden';
	}
	if (!localStorage){
		var data = JSON.parse(readCookie('live_widgets'));
		for (var i in data)
		{
			addWidget(data[i].origin,data[i].left,data[i].top,data[i].width,data[i].height,data[i].text);

		}
	}
	else {
		var data = JSON.parse(localStorage['live_widgets']);
		for (var i in data)
		{
			addWidget(data[i].origin,data[i].left,data[i].top,data[i].width,data[i].height,data[i].text);

		}
	}
}
function undo(){
	if (--state < 0)	{
		state=0;
		return false;
	}
	console.log(actions[state])
	var current = JSON.parse(actions[state]);
	var old =  getElementsByClass('active');
	for (var i in old){
		old[i].style.visibility = 'hidden';
	}
	live_widgets={};
	for (var w in current){
		addWidget(current[w].origin,current[w].left,current[w].top,current[w].width,current[w].height,current[w].text);
	}
}
function redo(){
	if (actions[++state] == null){
		state--;
		return false;
	}
	var current = JSON.parse(actions[state]);
	var old =  getElementsByClass('active');
	for (var i in old){
		old[i].style.visibility = 'hidden';
	}
	live_widgets={};
	for (var w in current){
		addWidget(current[w].origin,current[w].left,current[w].top,current[w].width,current[w].height,current[w].text);
	}
	return false;
}
//custom elements in class name script borrowed from stackoverflow
function getElementsByClassName(classname, node)  {
    if(!node) node = document.getElementsByTagName('body')[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName('*');
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    return a;
}
function getElementsByClass(nameOfClass) {    
	var temp, all, elements;
	all = document.getElementsByTagName('*');
	elements = [];

	for(var a=0;a<all.length;a++) {
	    temp = all[a].className.split(' ');
	    for(var b=0;b<temp.length;b++) {
	      	if(temp[b]==nameOfClass) { 
	        elements.push(all[a]); 
	        break; 
	      }
	    }
	  }
	return elements;
};



function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = '; expires='+date.toGMTString();
	}
	else var expires = '';
	document.cookie = name+'='+value+expires+'; path=/';
}

function readCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,'',-1);
}

function initPalette(){
	var p = document.getElementById('palette');
	document.getElementById('widthIn').onclick = function(){
	//	return false;
	}
	document.getElementById('heightIn').onclick = function(){
	//	return false;
	}
	document.getElementById('xIn').onclick = function(){
	//	return false;
	}
	document.getElementById('yIn').onclick = function(){
	//	return false;
	}
	p.onmousedown = function(e){
		var evt = e || window.event;
		var pos = getPosition(evt);
		var target = evt.target == null ? evt.srcElement : evt.target;
		var offset = getOffset(target);
		var initialLeft = offset.x;
		var initialTop = offset.y;	
		var initialX=pos.x;	
		var initialY=pos.y;
		var dragging = 0;
		document.onmousemove = function(e){
		    var evt = e || window.event;
		    var pos = getPosition(evt);
		    p.style.left = initialLeft+pos.x-initialX+'px';
		    p.style.top = initialTop+pos.y-initialY+'px';
		}
    		document.onmouseup = function(e){
		    document.onmousemove = null;
		    document.onmouseup = null;
		}

	}
	p.onkeyup = function(){
		document.onmousemove = null;
		if (properties.active ==null){
				alert('Please click on an element to modify its attributes');
				return;
		}
		var wIn = document.getElementById('widthIn').value;
		var hIn = document.getElementById('heightIn').value;
		var xIn = document.getElementById('xIn').value;
		var yIn = document.getElementById('yIn').value;

		if(xIn>0){
			properties.active.style.left = xIn+'px';
		}	
		if(yIn>0){
			properties.active.style.top = yIn+'px';
		}
		if(wIn>0){
			properties.active.style.width = wIn+'px';
		}
		if(hIn>0){
			properties.active.style.height = hIn+'px';
		}
		if (live_widgets[properties.active.id]) {
				live_widgets[properties.active.id] =  
				{
					origin: live_widgets[properties.active.id].origin,
					left: eN(properties.active.style.left),
					top: eN(properties.active.style.top),
					width: properties.active.clientWidth,
					height: properties.active.clientHeight,
					text: properties.active.innerHTML
				}
		}
		actions[++state]=JSON.stringify(live_widgets);
	}

}
function prevent(e){
    var ee = document.getElementById('preventt');
   // ee.onclick = function(){return false};

}
