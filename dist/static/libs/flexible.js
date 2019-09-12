/* eslint-disable */

(function flexible (window, document) {
  var docEl = document.documentElement;
  var dpr = window.devicePixelRatio || 1;

  // browser support vw
  function testSuportVw() {
    var sign = false
    try {
      var $div = document.createElement('div')
      $div.style.fontSize = '10vw'
      docEl.appendChild($div)
      if ($div.style.fontSize.toLowerCase() === '10vw') sign = true
      docEl.removeChild($div)
    } catch(err) {
      // err
    }
    return sign
  }

  var suportVw = testSuportVw()

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    var cWidth = docEl.clientWidth
    var ratio = 10
    var maxWidth = 750
    var resSize = ''
    if (cWidth > maxWidth) {
      resSize = maxWidth / ratio + 'px';
    } else {
      if (suportVw) resSize = ratio + 'vw';
      else resSize = cWidth / ratio + 'px';
    }
    docEl.style.fontSize = resSize;
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
