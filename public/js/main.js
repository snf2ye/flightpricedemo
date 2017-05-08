function OnClick() {
    location.reload();
  }
  var departData;
  var returnData;
  var HttpClient = function(){
    this.get = function(aUrl, async, aCallback) {
      var anHttpRequest = new XMLHttpRequest();
      anHttpRequest.onreadystatechange = function () {
        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
          aCallback(anHttpRequest.responseText);
      }
    anHttpRequest.open("GET", aUrl, async);
    anHttpRequest.send(null);
    }
  }
  function loadDepartData() {
      var client = new HttpClient();
      client.get('/departing', false, function(response) {
      departData = JSON.parse(response);
    })
  }

  function loadReturnData() {
      var client = new HttpClient();
      client.get('/returning', true, function(response) {
        returnData = JSON.parse(response);
    })
  }

$(document).ready( function() {
  loadReturnData();
  loadDepartData();
    $('#calendar').datepicker({
        inline: true,
        defaultDate: new Date(2016, 6, 1),
        numberOfMonths: 6,
        firstDay: 1,
        showOtherMonths: false,
      monthNames: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                 "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
        beforeShowDay: function(date) {
        var date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#input1").val());
        var date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#input2").val());
        return SetDayStyle(date, date1, date2);
      },
    onSelect: function(dateText, inst) {
        var date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#input1").val());
        var date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#input2").val());
        if (!date1 || date2) {
          $("#input1").val(dateText);
          $("#input2").val("");
                    $(this).datepicker();
        } else {
          $("#input2").val(dateText);
                    $(this).datepicker();
        }
      }
    });
});
  function SetDayStyle(date, date1, date2) {
      var enabled = true;
      var cssClass = "";
      var toolTip = "";
      var departcolor = "";
      var returncolor = "";

      var day = date.getDate();
      if (parseInt(day) < 10) {
        day = "0" + day;
      }
      var month = date.getMonth() + 1; //0 - 11
      if (parseInt(month) < 10) {
        month = "0" + month;
      }
      var year = date.getFullYear();
      var compare = year + "-" + month + "-" + day;


      //SET DEPART COLOR PRICES
      var departprice =  departData[compare].price;
      if(departprice < 275 ) {
        cssClass = cssClass + " green";
        departcolor = "Green";
      }
      else if(departprice >=275 && departprice < 300) {
        cssClass = cssClass + " yellow";
        departcolor = "Yellow";
      }
      else if(departprice >=300 && (departprice < 325)) {
        cssClass = cssClass + " orange";
        departcolor = "Orange";
      }
      else if(departprice >=325 ){
        cssClass = cssClass + " red";
        departcolor = "Red";
      }


      if (date1 && ((date.getTime() == date1.getTime()) || (date2 && (date.getTime() == date1.getTime())))) { 
      cssClass = cssClass + " startDateRange"+departcolor;
       }
        if(date2 == null && returnData){
          //SET DEPART COLOR PRICES
          if (returnData[compare] == null){
            cssClass = cssClass + " gray";
            enabled = false; 
          }
          else {
            var returnprice = returnData[compare][departData[compare].airline];
            if(returnprice){
              if(returnprice < 275 ) {  //Hopper: 425+
                cssClass = cssClass + " green";
              }
              else if(returnprice >=275 && returnprice < 300) { //475+
                cssClass = cssClass + " yellow";
              }
              else if(returnprice >=300 && (returnprice < 325)) { //525+
                cssClass = cssClass + " orange";
              }
              else if(returnprice >=325 ){ //575+
                cssClass = cssClass + " red";
              }
            }
          }

        }
      if(((date1 && date < date1) && (date2 == null))) {
        cssClass = cssClass + " beforeDateRange"; 
        enabled = false;
      }

    
        

      //Set styles for date ranges
      else if ((date1 && (date2 && date > date1 && date < date2))) {  
          cssClass = cssClass + " inDateRange";
          }
      
      else if (date2 == null) {cssClass = cssClass}
      else if (date1 && (date.getTime() == date2.getTime())) {      
          //SET END DATE ARROW COLOR
          var returnprice = returnData[compare][departData[compare].airline];
          console.log(returnprice)
            if(returnprice < 275 ) {
              returncolor = "Green";
            }
            else if(returnprice >=275 && returnprice < 300) {
              returncolor = "Yellow";
            }
            else if(returnprice >=300 && (returnprice < 325)) {
              returncolor = "Orange";
            }
            else if(returnprice >=325 ){
              returncolor =  "Red";
            }
          
        
        cssClass = cssClass + " endDateRange"+returncolor;
      }


      else if (date1 && (date2 && date < date1)) {cssClass =  cssClass + " beforeDateRange"; }
      else if (date1 && (date2 && date > date2)) {cssClass =  cssClass + " afterDateRange"; }

      return new Array(enabled, cssClass, toolTip);
    }