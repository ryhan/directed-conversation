/* listen.js */

var recognition;

var interimResult, textArea, textAreaID;

$(window).load(function() {

  try {
    recognition = new webkitSpeechRecognition();
  } catch(e) {
    recognition = Object;
  }

  recognition.continuous = true;
  recognition.interimResults = true;

  interimResult = '';
  textArea = $('#speech-page-content');
  textAreaID = 'speech-page-content';

  recognition.onresult = function (event) {
    var pos = textArea.getCursorPosition() - interimResult.length;
    textArea.val(textArea.val().replace(interimResult, ''));
    interimResult = '';
    textArea.setCursorPosition(pos);
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            insertAtCaret(textAreaID, event.results[i][0].transcript);
        } else {
            isFinished = false;
            insertAtCaret(textAreaID, event.results[i][0].transcript + '\u200B');
            interimResult += event.results[i][0].transcript + '\u200B';
        }
    }
  };

  recognition.onend = function() {
    // foo;
  };

  setTimeout(startRecognition, 400);

});

var startRecognition = function() {
  textArea.focus();
  recognition.start();
};





$(window).load(function() {

  var update = function(){
    if (TRACKER.detected == true){
      textArea.focus();
      textArea.addClass('listening');
      textArea.removeClass('nolisten');
    }else{
      setTimeout(isStillGone, 500);
      // textArea.removeClass('listening');
    }

    setTimeout(update, 800);
  }

  var isStillGone = function(){
    if (TRACKER.detected == true){
      textArea.focus();
      // do nothing
    }else{
      textArea.val("");
      textArea.removeClass('listening');
      textArea.addClass('nolisten');

    }
  }

  setTimeout(update, 1000);


});