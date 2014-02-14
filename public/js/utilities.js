function todayString() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
  return today;
};

$.fn.refreshMenu = function() {
  $("#navHome").removeClass('active'); 
  $("#navCode").removeClass('active'); 
  $("#navBrew").removeClass('active'); 
  $("#navAbout").removeClass('active'); 

  this.addClass('active');

  $('#btnNavBar').addClass('collapse');
  $('#btnNavBar').removeClass('in').css('height', '0');
};

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};

$.ajaxPrefilter(function(options, originalOptions, jqXHR){
  options.url = options.url
});

function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}
