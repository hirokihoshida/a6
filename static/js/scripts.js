$(document).ready(function(){
    M.AutoInit();
    $('#start-stop-btn').click(function(){
      $('#start-stop-btn').text($('#start-stop-btn').text() == "Start" ? "Stop" : "Start");
    });
  });