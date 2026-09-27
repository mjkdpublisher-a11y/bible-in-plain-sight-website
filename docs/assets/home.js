// Motion on the home page. The phones come in one after another when the gallery scrolls into
// view. Each phone's screen scrolls gently, like someone reading: with a mouse while the pointer is
// over it, on a touch screen when the phone stands in the middle of the view. Nothing here is
// needed to read the page, and with "reduce motion" switched on it does nothing.
(function () {
  var gallery = document.querySelector(".screens");
  if (!gallery) return;
  var figures = Array.prototype.slice.call(gallery.querySelectorAll("figure"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none)").matches;
  var observe = "IntersectionObserver" in window;

  // The screen inside the phone is its own small page (docs/screens/*.html). "play" on its <html>
  // starts the scroll in screens/motion.css.
  function setPlaying(figure, on) {
    figure.classList.toggle("playing", on);
    var frame = figure.querySelector("iframe");
    var doc = frame && frame.contentDocument;
    if (doc && doc.documentElement) doc.documentElement.classList.toggle("play", on);
  }

  figures.forEach(function (figure, index) {
    figure.style.setProperty("--i", index % 3);
    // A screen that finishes loading while its phone is already playing starts at once.
    var frame = figure.querySelector("iframe");
    if (frame) {
      frame.addEventListener("load", function () {
        if (figure.classList.contains("playing")) setPlaying(figure, true);
      });
    }
  });

  if (reduce || !observe) {
    figures.forEach(function (figure) { figure.classList.add("in"); });
    if (reduce) return;
  } else {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    figures.forEach(function (figure) { reveal.observe(figure); });
  }

  if (touch && observe) {
    var timers = new Map();
    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var figure = entry.target;
        clearTimeout(timers.get(figure));
        if (entry.intersectionRatio >= 0.8) {
          timers.set(figure, setTimeout(function () { setPlaying(figure, true); }, 500));
        } else if (entry.intersectionRatio < 0.3) {
          setPlaying(figure, false);
        }
      });
    }, { threshold: [0, 0.3, 0.8] });
    figures.forEach(function (figure) { watch.observe(figure); });
  } else {
    figures.forEach(function (figure) {
      figure.addEventListener("mouseenter", function () { setPlaying(figure, true); });
      figure.addEventListener("mouseleave", function () { setPlaying(figure, false); });
    });
  }
})();
