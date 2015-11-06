(function(window, document){
  //SETUP THE COOL STICKY HEADER
  var stickyHeader = document.getElementById("sticky-header");
  if (window.myScroll.y >= 400) {
    stickyHeader.style.display = 'block';
  }

  function toggleHeader() {
    window.myScroll.once('offsetY', function(){
      stickyHeader.style.display = 'block';
      this.once('offsetY', function() {
        stickyHeader.style.display = 'none';
        toggleHeader();
      }, -350);
    }, 350);
  }

  // Tweaking detection speed
  window.myScroll.setScrollDelay(100);

  toggleHeader();

  //BUTTON DEMO - TOGGLING HOVER ANIMATIONS
  var btn = document.getElementById("toggleAnimationBtn");
  var disabled = false;
  btn.addEventListener("click", function(){
    if (disabled) {
      btn.innerHTML = 'Disable hover animations';
      window.myScroll.enableHoverOnScroll();
      disabled = false;
    }
    else {
      btn.innerHTML = 'Enable hover animations';
      window.myScroll.disableHoverOnScroll();
      disabled = true;
    }
  }, false);

  //EXAMPLE 1
  var circle1 = document.getElementById('offset-example1-circle');
  new ScrollProxy(document.getElementById('offset-example1'))
  .on('offsetX', function(){
    circle1.className = 'circle blue';
  })
  .on('offsetY', function(){
    circle1.className = 'circle green';
  });

  //EXAMPLE 2
  var box = document.getElementById('offset-example2-box');
  new ScrollProxy(document.getElementById('offset-example2'))
  .once('offsetY', function(){
    box.className = 'bigDiv green';
  }, 300);

  //EXAMPLE 3
  var box2 = document.getElementById('bound-example1-box');
  new ScrollProxy(document.getElementById('bound-example1'))
  .once('bottom', function(){
    box2.style.color = 'green';
  });

  //EXAMPLE 4
  var box3 = document.getElementById('bound-example2-box');
  new ScrollProxy(document.getElementById('bound-example2'))
  .once('bottom', function(){
    box3.style.color = 'yellow';
  }, 250)
  .once('bottom', function(){
    box3.style.color = 'green';
  });

  //EXAMPLE 5
  var square = document.getElementById('visibility-example-square');
  var outputLog = document.getElementById('visibility-example-log');
  new ScrollProxy(document.getElementById('visibility-example'))
  .on('visible', function(){
    outputLog.innerHTML = 'SQUARE VISIBLE :-)';
  }, square)
  .on('invisible', function(){
    outputLog.innerHTML = 'SQUARE NOT VISIBLE :-(';
  }, square);

  //EXAMPLE 6
  var outputLog2 = document.getElementById('metadata-example-log');
  new ScrollProxy(document.getElementById('metadata-example'))
  .on('scroll', function(){
    var output = 'X: ' + this.x + '<br>';
    output +=    'Y: ' + this.y + '<br>';
    output +=    'Element Width: ' + this.width + '<br>';
    output +=    'Element Height: ' + this.height + '<br>';
    output +=    'Scroll Width: ' + this.scrollWidth + '<br>';
    output +=    'Scroll Height: ' + this.scrollHeight;
    outputLog2.innerHTML = output;
  });

})(window, document);
