
       var componentsArray = ["text", "button bar", "tab container", "square", 
                               "rounded rectangles", "circle", "horizontal scrollbar", 
                               "vertical scrollbar"];

        var associatedDivIds = new Array();
        associatedDivIds["text"] = "w0";
        associatedDivIds["button bar"] = "w1";
        associatedDivIds["tab container"] = "w2";
        associatedDivIds["square"] = "w3";
        associatedDivIds["rounded rectangles"] = "w4";
        associatedDivIds["circle"] = "w5";
        associatedDivIds["horizontal scrollbar"] = "w6";
        associatedDivIds["vertical scrollbar"] = "w7";
  
         var selected = "";
         var numDropped = 0;

         // Determine if the sequence the user entered is in the array
         function findSequence(s)
         {
            s = s.toLowerCase();
         	if( s.charAt(0) === " " || s === "" ) 
         		return "";

         	var i;
         	var matches = [];
         	for( i = 0; i < componentsArray.length; i++ )
         	{
         		// if the component name contains the sequence, store the component in the array matches
         		if( componentsArray[i].indexOf(s) !== -1 )
         		{
         			matches[matches.length] = componentsArray[i];
         		}
         	}

            if( matches.length === 0 )
            {
            	return "";
            }

         	return matches;
         }

         function printMatches(m)
         {
         	// If there was a previous suggestion, get rid of it by deleting 
         	// all of the nodes associated with it. 
          	var displayArea = document.getElementById("outputResults");
            removeElements(displayArea);

         	// Create an ul with the matches 
         	var newUL = document.createElement("ul");
         	newUL.setAttribute("id", "matchList");
         	displayArea.appendChild(newUL);

         	// go through each match and make it a li 
         	var i;
         	var newLi; 
         	for( i = 0; i < m.length; i++ )
         	{
                newLi = document.createElement("li");
                newLi.setAttribute("id", m[i]);
                newUL.appendChild(newLi);
                newText = document.createTextNode(m[i]);
                newLi.appendChild(newText);
         	}

            if( m.length > 0 )
            {
            	displayArea.removeAttribute("style");
         	    newUL.setAttribute("style", "background-color: white; width: 150px; margin-top: 0; padding-right: 0; padding-left: 0; color: black");
         	}
         	else
         	{
         		newUL.removeAttribute("style");
         		displayArea.setAttribute("style", "display: none;");
         	}
         }

        function removeElements(da)
        {
        	// determine if a list has already been generated 
        	if( da.childElementCount > 0 )
        	{
        		// If a list has already been created, then remove the 
        		// elements
        		while( da.childElementCount !== 0 )
        		{
        	        da.removeChild(da.firstChild);
        		}
        	}

        }

        function getComponentId(humanReadableName)
        {
            elementId = associatedDivIds[humanReadableName];
            return elementId;
        }


        function autoSuggest()
        {
         	printMatches(findSequence(document.getElementById("searchfield").value));

        	var curNode = document.getElementById("matchList");
        	var numChildren = curNode.childElementCount;
        	curNode = curNode.firstChild;
        	for( var i = 0; i < numChildren; i++ )
        	{
        		curNode.onmousedown = function()
        		{
        			cur = this.id;

                    //component id
                    var ci = getComponentId(cur);
                    var c = document.getElementById(ci).cloneNode(true);
                    c.id = "widget" + numDropped;
                    numDropped = numDropped + 1;
                    c.className = "active";
                    c.style.position = 'absolute';
                    document.getElementById("pad").appendChild(c);

        			setTimeout(function(){ removeElements(document.getElementById("outputResults"))},100);
        		}
        		curNode = curNode.nextSibling;
        	}       	
        }