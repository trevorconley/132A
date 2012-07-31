/********************************************************************************************
 *  HOW TO INTEGRATE 
 *  ----------------------------------------------------------------------------------------
 *  Change the class name of each element you want to drog to 'drag'.
 *  In the css, add this: 
 *  .drag 
 *  {
 *     position: relative; 
 *     // other style sttributes
 *  }
 ********************************************************************************************/
/* Global Variables */
var start_x = 0;             // x coordinate of mouse starting position
var start_x = 0;             // y coordinate of mouse starting position
var offset_x = 0;            // original offset of the object in the x direction
var offset_y = 0;            // original offset of object in y direction
var old_z_index = 0;
var targetInfo; 
var objectContent = [];      // keeps track of the content of the objects 
                             // that are dropped
var numDropped = 1;          // number of objects dropped


/* Deals with what happens when you first click on a draggable object */
function draggableClick(e)
{
   // Deal with IE
   if (e == null) 
      e = window.event; 

   var target = e.target != null ? e.target : e.srcElement;

   // only continue on if the user left clicked AND the object is 
   // draggable
   if( (e.button == 1 && window.event != null || e.button == 0) && target.className === "drag" || target.className == "inDropZone")
   {
        // mouse position in canvas
        start_x = e.clientX;
        start_y = e.clientY;

        // original position of draggable object
        offset_x = ExtractNumber(target.style.left); 
        offset_y = ExtractNumber(target.style.top);

        old_z_index = target.style.zIndex;
        target.style.zIndex = 10000;
        targetInfo = target;

        document.onmousemove = dragObject;

        // cancel out any text selections 
        document.body.focus(); 
        // prevent text selection in IE 
        document.onselectstart = function () { return false; }; 
        // prevent IE from trying to drag an image 
        target.ondragstart = function() { return false; }; 

        return false;
   }
}

function dragObject(e)
{
  if (e == null) 
    var e = window.event; 
   // move the element to the new position of the mouse. Seems like dragging but
   // is really updating with each small movement of the mouse.
   targetInfo.style.left = (offset_x + e.clientX - start_x) + 'px'; 
   targetInfo.style.top = (offset_y + e.clientY - start_y) + 'px';
}

function dragEnd(e)
{
  if( targetInfo != null )
  {
    // get information about the position of the dropzone so you can determine if you are in it
    dz = document.getElementById("canvasGrid");
    dropzone_y = dz.offsetTop + dz.offsetHeight;
    dropzone_x = dz.offsetLeft + dz.offsetWidth; 

    // are you in the drop zone?
    if( targetInfo.offsetTop < dropzone_y && targetInfo.offsetLeft < dropzone_x && targetInfo.className != "inDropZone" && targetInfo.id != "palette")
    { 
       // add element to drop zone 
       newDiv = document.createElement("div");
       divNum = numDropped + 4;
       newDiv.setAttribute("id", "dragobj" + divNum);
       numDropped = numDropped + 1;
       newDiv.setAttribute("class", "inDropZone");
       newDiv.innerHTML = targetInfo.innerHTML;
       dz.appendChild(newDiv);

       // after putting the element on the canvas, move element back to its original positoin 
      targetInfo.style.left = "0px";
      targetInfo.style.top = "0px";

      // register what has been duplicated
      /*objectContent[objectContent.length] = targetInfo.innerHTML;

      // delete all existing child nodes
      var curNode = document.getElementById("recentlyDropped");

      while( curNode.childElementCount !== 0 )
      {
           curNode.removeChild(curNode.firstChild);
      }

      // determine the end of the recently added array
      var endIndex = objectContent.length - 1; 

      var numPrint;
      // determine how many elements to print out 
      if( objectContent.length <= 5 )
        numPrint = objectContent.length;
      else
        numPrint = 5;

      var i; 
      for( i = 0; i < numPrint; i++)
      {
         // add the element to the recently added section
         newDiv = document.createElement("div");
         newDiv = document.createElement("div");
         newDiv.setAttribute("class", "drag");
         newDiv.innerHTML = objectContent[endIndex];
         document.getElementById("recentlyDropped").appendChild(newDiv);
         endIndex = endIndex - 1;
      }*/
    } 

    // reset everything so the object won't stick to your mouse!
    targetInfo.style.zIndex = old_z_index;
    document.onmousemove = null;
    document.onselectstart = null;
    targetInfo.ondragstart = null;
    targetInfo = null;
  }
}

/* Converts the coordinates of the currently selected draggable object */
function ExtractNumber(value) 
{ var n = parseInt(value); 
  return n == null || isNaN(n) ? 0 : n; 
}
