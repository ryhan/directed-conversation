/* tracker.js */

var smoother = new Smoother(0.85, [0, 0, 0, 0, 0]);

var video;

var TRACKER = {
  running: false,
  detected: false,
  proximity: 0
}

var tick = function(){
  setTimeout(function(){compatibility.requestAnimationFrame(tick);}, 300);

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    $(video).objectdetect("all", {scaleMin: 3, scaleFactor: 1.1, classifier: objectdetect.frontalface}, function(coords) {
      if (coords[0]) {
        coords = smoother.smooth(coords[0]);
        $("#face").css({
          "left":    ~~(coords[0] + coords[2] * 1.0/8 + $(video).offset().left) + "px",
          "top":     ~~(coords[1] + coords[3] * 0.8/8 + $(video).offset().top) + "px",
          "width":   ~~(coords[2] * 6/8) + "px",
          "height":  ~~(coords[3] * 6/8) + "px",
          "opacity": "1"
        });

        $('#mic').addClass('recording');

        TRACKER.detected = true;
        TRACKER.proximity = parseInt( coords[2]*6/8/640*100 );

      } else {
        $("#face").css("opacity", "0");

        $('#mic').removeClass('recording');

        TRACKER.proximity = 0;
        TRACKER.detected = false;

      }
    });
  }
}


$(window).load(function() {

  video = $("#video").get(0);

  try {
    compatibility.getUserMedia({video: true}, function(stream) {
      try {
        video.src = compatibility.URL.createObjectURL(stream);
      } catch (error) {
        video.src = stream;
      }
      video.play();
      compatibility.requestAnimationFrame(tick);

      TRACKER.running = true;
      console.log("running tracker");

    }, function (error) {
      alert("WebRTC not available");
    });
  } catch (error) {
    alert(error);
  }

});