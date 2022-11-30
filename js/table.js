/*
File: table.js
GUI Assignment: HW4
Created on: 11/28/2022
Description: Contains javascript code for validating input, slider and tab ui, and to create dynamic multiplication table
Kyle Gaudet, UMass Lowell Computer Science, kyle_gaudet@student.uml.edu
Copyright (c) 2022 by Kyle Gaudet. All rights reserved.
Updated by KG on 11/29/2022
*/

// resources used:
// https://api.jqueryui.com/
// https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch03_TabsWidget.pdf
// https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch03_TabsWidget.pdf
// https://www.youtube.com/watch?v=3-pOP4mUsjI&t=287s

/****************************** code for sliders *************************************/


// create sliders
$("#minXslider").slider({
    min: -50,
    max: 50,
    step: 1,
    slide: function(event, ui) {
        // update value in input field
        $("#minX").val(ui.value);
        // trigger events to validate input
        $("#inputForm").trigger('input');
    }
});


$("#maxXslider").slider({
    min: -50,
    max: 50,
    step: 1,
    slide: function(event, ui) {
        // update value in input field
        $("#maxX").val(ui.value);
        // trigger events to validate input
        $("#inputForm").trigger('input');
    }
});


$("#minYslider").slider({
    min: -50,
    max: 50,
    step: 1,
    slide: function(event, ui) {
        // update value in input field
        $("#minY").val(ui.value);
        // trigger events to validate input
        $("#inputForm").trigger('input');
    }
});


$("#maxYslider").slider({
    min: -50,
    max: 50,
    step: 1,
    slide: function(event, ui) {
        // update value in input field
        $("#maxY").val(ui.value);
        // trigger events to validate input
        $("#inputForm").trigger('input');
    }
});


// change slider values when there is input in input boxes
$("#minX").on('input', function() {
    $( "#minXslider" ).slider( "option", "value", parseInt($(this).val()) );
});

$("#maxX").on('input', function() {
    $( "#maxXslider" ).slider( "option", "value", parseInt($(this).val()) );
});

$("#minY").on('input', function() {
    $( "#minYslider" ).slider( "option", "value", parseInt($(this).val()) );
});

$("#maxY").on('input', function() {
    $( "#maxYslider" ).slider( "option", "value", parseInt($(this).val()) );
});


/*************************************** code for validation *******************************************/


// create new rule for min's to check that their value is greater than max's
$.validator.addMethod('lessOrEqual', function(value, element, max) {
    // if max is not filled return true so no error pops up
    if(!$(max).is(":filled"))
        return true;
    var i = value;
    var j = parseInt($(max).val());
    return i <= j;
});


// create new rule for max's to check that their value is greater than min's
$.validator.addMethod('greaterOrEqual', function(value, element, min) {
    // if min is not filled return true so no error pops up
    if(!$(min).is(":filled"))
        return true;
    var i = value;
    var j = parseInt($(min).val());
    return i >= j;
});


// validation for input form
$("#inputForm").validate({
    errorPlacement: function(label, element) {
        // add warning class to apply css styling
        label.addClass('warning');
        label.insertAfter(element);
    },
    // rules for different input fields
    rules: {
        minX: {
            required: true,
            number: true,
            min: -50, 
            max: 50,
            lessOrEqual: ("#maxX")
        },
        maxX: {
            required: true,
            number: true,
            min: -50,
            max: 50,
            greaterOrEqual: ("#minX")
        },
        minY: {
            required: true,
            number: true,
            min: -50,
            max: 50,
            lessOrEqual: ("#maxY")
        },
        maxY: {
            required: true,
            number: true,
            min: -50,
            max: 50,
            greaterOrEqual: ("#minY")
        }
    },
    // error messages for different rules
    messages: {
        minX: {
            required: "Please enter a number",
            number: "Please enter a number",
            min: "Min X must be greater than -50",
            max: "Min X must be less than 50",
            lessOrEqual: "Min X must be less than or equal to Max X"
        },
        maxX: {
            required: "Please enter a number",
            number: "Please enter a number",
            min: "Max X must be greater than -50",
            max: "Max X must be less than 50",
            greaterOrEqual: "Max X must be greater than or equal to Min X"
        },
        minY: {
            required: "Please enter a number",
            number: "Please enter a number",
            min: "Min Y must be greater than -50",
            max: "Min Y must be less than 50",
            lessOrEqual: "Min Y must be less than or equal to Max Y"
        },
        maxY: {
            required: "Please enter a number",
            number: "Please enter a number",
            min: "Max Y must be greater than -50",
            max: "Max Y must be less than 50",
            greaterOrEqual: "Max Y must be greater than or equal to Min Y"
        }
    }
})


// validate input whenever the input form is changed
$("#inputForm").on('input', function(){
    if(!$("#inputForm").valid())
        return false;
    makeTable('tablediv');
});


/******************************************* code for tab ui ******************************************/


// create tab ui
$("#tabdiv").tabs();

// running count of all tabs ever created on current site visit
// prevents issues with duplicate tab indicies/ids when deleting
var tabcount = 0;

// on input button click create new tab
$("#inputButton").click( function() {
    // input must be valid to create new tab
    if(!$("#inputForm").valid())
        return false;
    // create tab name from input values
    var name = "[" + $("#minX").val() + " to " + $("#maxX").val() + "] x [" + $("#minY").val() + " to " + $("#maxY").val() + "]";

    // append new tab/li to ul
    $("#tabdiv ul").append("<li class ='tab' id='tab"+ tabcount + "'><a href='#tab" + tabcount + "content'>" + name + 
                           "</a><span class='ui-icon ui-icon-radio-off ui-closable-tab'></span></li>");

    // append div with id of tab
    var name = 'tab' + tabcount + 'content';
    $("#tabdiv").append("<div class = 'tabcontent' id= 'tab" + tabcount + "content'></div>");

    // make table in tabcontent div for new tab
    makeTable(name);

    // refresh tabs and increment count
    $("#tabdiv").tabs("refresh");
    tabcount++;
});


// function to run on click event for remove button
$("#removeButton").click( function() {
    // remove elements marked for deletion
    $(".mustDelete").remove();
    // refresh tabs to show changes
    $("#tabdiv").tabs( "refresh" );
});


// function to run on click of radio button event
$("#tabdiv").tabs().delegate( "span.ui-icon-radio-off", "click", function() {
    // get the tab id that the icon is inside of 
    var tabname = $( this ).closest( "li" ).attr("id");

    // set icon to check
    $(this).removeClass("ui-icon-radio-off");
    $(this).addClass("ui-icon-check");

    // add class for tabs, content, and tables that must be deleted
    $("#"+ tabname).addClass("mustDelete");
    $("#"+ tabname + "content").addClass("mustDelete");
    $("#"+ tabname + "contenttable").addClass("mustDelete");
});


/************************************************** code to make table **************************************************************/


// function to make table in div based on form input
function makeTable(divName) {
    // remove previous warning messages
    var warnings = Array.from(document.getElementsByClassName('warning'));
    warnings.forEach(warning => {
        warning.remove();
    });

    // remove previous table if one exists
    var mainTable = $("#tablediv table");
    // if there is a previous table and the new table being made is 
    // being added to the main tablediv
    if (mainTable != null && divName == 'tablediv')
        mainTable.remove();

    // get values from the table as floats
    var minX = parseFloat(document.getElementById('minX').value);
    var maxX = parseFloat(document.getElementById('maxX').value);
    var minY = parseFloat(document.getElementById('minY').value);
    var maxY = parseFloat(document.getElementById('maxY').value);

    // if number has decimal convert to integer and display warning message
    minX = convertIfDouble("minX", minX);
    maxX = convertIfDouble("maxX", maxX);
    minY = convertIfDouble("minY", minY);
    maxY = convertIfDouble("maxY", maxY);

    // create table
    var table = document.createElement('table');
    table.setAttribute('id', divName+'table');

    // if inputs are valid fill table 
    
    // create top row and top left td
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.appendChild(document.createTextNode(""));
    tr.appendChild(th);

    // fill first row with minX - max X
    for(var j = minX; j <= maxX; j++) {
        var th = document.createElement('th');
        var temp = j;
        var tempstr = temp.toString();
        th.appendChild(document.createTextNode(tempstr));
        tr.appendChild(th);
    }
    table.appendChild(tr);


    // create all other trs and tds
    for(var i = minY; i <= maxY; i++) {
        tr = document.createElement('tr');
        // create first th with vals from minY - maxY
        th = document.createElement('th');
        temp = i;
        tempStr = temp.toString();
        th.appendChild(document.createTextNode(tempStr));
        tr.appendChild(th);

        // create tds with multiplied values for each row
        for(var j = minX; j <= maxX; j++) {
            td = document.createElement('td');
            temp = i * j;
            tempstr = temp.toString();
            td.appendChild(document.createTextNode(tempstr));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    // add the table to its div
    var tablediv = document.getElementById(divName);
    tablediv.appendChild(table);
}


// function to convert inputted numbers to integers
// and to add warning label to let user know conversion was necessary 
function convertIfDouble(varName, num) {
    // if number is not an integer
    if (num % 1 != 0) {
        var label = document.getElementById(varName += "label");
        label.insertAdjacentHTML('afterend', '<div class="warning" <br>Warning! Decimal portion of value entered was removed');
        return Math.trunc(num);
    }
    return num;
}
