        var recent = [];

        var componentsArray = ["button", "browser", "image", "textfield", 
                               "button bar", "search", "section title", "checkbox", 
                               "radio button", "combobox", "accordion", "tab bar", "link bar",
                               "vertical tab", "table", "format bar", "menu", "text box", 
                               "date picker", "list", "date stepper", 'mobile'];

        var associatedDivIds = new Array();
        associatedDivIds["button"] = "drag_button";
        associatedDivIds["browser"] = "drag_browser";
        associatedDivIds["image"] = "drag_image";
        associatedDivIds["textfield"] = "drag_textfield";
        associatedDivIds["button bar"] = "drag_button_bar";
        associatedDivIds["search"] = "drag_search";
        associatedDivIds["section title"] = "drag_section_title";
        associatedDivIds["checkbox"] = "drag_checkbox";
        associatedDivIds["radio button"] = "drag_radio_button";
        associatedDivIds["combobox"] = "drag_combobox";
        associatedDivIds["accordion"] = "rag_accordin";
        associatedDivIds["tab bar"] = "drag_tab_bar";
        associatedDivIds["link bar"] = "drag_link_bar";
        associatedDivIds["vertical tab"] = "drag_vertical_tab";
        associatedDivIds["table"] = "drag_table";
        associatedDivIds["format bar"] = "drag_format_bar";
        associatedDivIds["menu"] = "drag_menu";
        associatedDivIds["text box"] = "drag_text_box";
        associatedDivIds["date picker"] = "drag_date_picker";
        associatedDivIds["list"] = "drag_list";
        associatedDivIds["date stepper"] = "drag_date_stepper";
        associatedDivIds["mobile"] = "drag_mobile";


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
        			window.selected = this.id;

        			document.getElementById("canvasGrid").innerHTML += document.getElementById(getComponentId(window.selected)).innerHTML;
                    window.recent[window.recent.length] = document.getElementById(getComponentId(window.selected)).innerHTML;

        			setTimeout(function(){ removeElements(document.getElementById("outputResults"))},100);
        		}
        		curNode = curNode.nextSibling;
        	}       	
        }