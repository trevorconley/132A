        var componentsArray = ["button", "browser", "image", "textfield", 
                               "button bar", "search", "section title", "checkbox", 
                               "radio button", "combobox", "accordion", "tab bar", "link bar",
                               "vertical tab", "table", "format bar", "menu", "text box", 
                               "date picker", "list", "date stepper"];

        var associatedDivIds = new Array();
        associatedDivIds["button"] = "sbtn";
        associatedDivIds["browser"] = "libBrowserOuterFrame";
        associatedDivIds["image"] = "libImage";
        associatedDivIds["textfield"] = "libDummyContainer";
        associatedDivIds["button bar"] = "libButtonBarBox";
        associatedDivIds["search"] = "libSearchBox";
        associatedDivIds["section title"] = "libHeaderBox";
        associatedDivIds["checkbox"] = "libCheckBox";
        associatedDivIds["radio button"] = "libRadioBox";
        associatedDivIds["combobox"] = "libComboBox";
        associatedDivIds["accordion"] = "libAccordin";
        associatedDivIds["tab bar"] = "libTabber";
        associatedDivIds["link bar"] = "libLinkbar";
        associatedDivIds["vertical tab"] = "libVerticalTab";
        associatedDivIds["table"] = "libTable";
        associatedDivIds["format bar"] = "libFormatBar";
        associatedDivIds["menu"] = "libMenu";
        associatedDivIds["text box"] = "libTextBox";
        associatedDivIds["date picker"] = "libDatePickerBox";
        associatedDivIds["list"] = "libList";
        associatedDivIds["date stepper"] = "libNumStepper";


         var selected = "";

         // Determine if the sequence the user entered is in the array
         function findSequence(s)
         {
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
         	    newUL.setAttribute("style", "background-color: #f0f0f0; width: 150px; margin-top: 0; padding-right: 0; padding-left: 0;");
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
        			window.selected = this.id;

        			document.getElementById("frame").innerHTML += window.selected;

        			setTimeout(function(){ removeElements(document.getElementById("outputResults"))},100);
        		}
        		curNode = curNode.nextSibling;
        	}       	
        }