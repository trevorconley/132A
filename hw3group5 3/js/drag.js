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
		var temp = evt.target == null ? evt.srcElement : evt.target;
		var offset = getOffset(temp);
		dragObject.target_self = evt == null ? evt.srcElement : evt.target;
		dragObject.initialLeft = offset.x;
		dragObject.initialTop = offset.y;
		dragObject.initialX=pos.x;
		dragObject.initialY=pos.y;
		document.onmousemove=dragObject.mouseMove;
		document.onmouseup = dragObject.mouseUp;
		return false;
	},
	mouseMove: function(e)
	{
		var evt = e || window.event;
		var pos = getPosition(evt);
		var zone = document.getElementById('canvas');
		var zoneOffset = getOffset(zone);
		var offset = getOffset(dragObject.target_self);
		dragObject.target_self.style.left = dragObject.initialLeft+pos.x-dragObject.initialX+'px';
		dragObject.target_self.style.top = dragObject.initialTop+pos.y-dragObject.initialY+'px';

		//bounday sane
		var offset = getOffset(dragObject.target_self);
		if(offset.x<zoneOffset.x){
			dragObject.target_self.style.left = zoneOffset.x+"px";
		}
		if(offset.y<zoneOffset.y){
			dragObject.target_self.style.top = zoneOffset.y+"px";
		}
		if(offset.y+dragObject.target_self.clientHeight>zoneOffset.y+zone.clientHeight){
			dragObject.target_self.style.top = zoneOffset.y+zone.clientHeight-dragObject.target_self.clientHeight+"px";		
		}
		if(offset.x+dragObject.target_self.clientWidth>zoneOffset.x+zone.clientWidth){
			dragObject.target_self.style.left = zoneOffset.x+zone.clientWidth-dragObject.target_self.clientWidth+"px";		
		}
	},
	mouseUp: function(e)
	{
		document.onmousemove = null;
		document.onmouseup = null;
		var evt = e || window.event;
		live_widgets[dragObject.target_self.id] =  
		{
			origin: live_widgets[dragObject.target_self.id].origin,
			left: eN(dragObject.target_self.style.left),
			top: eN(dragObject.target_self.style.top),
			width: dragObject.target_self.clientWidth,
			height: dragObject.target_self.clientHeight,
		}
		actions[++state]=JSON.stringify(live_widgets);
		dragObject.target_self = null;
		return false;
	}
}