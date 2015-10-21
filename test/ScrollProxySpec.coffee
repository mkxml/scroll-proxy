ScrollProxy = require('../src/ScrollProxy')
sp = null
el = null
square = null
inner = null
expect = require('chai').expect
sinon = require('sinon')

# Temporary shiming PhantomJS lack of the bind function
Function.prototype.bind = require('function-bind')

describe('ScrollProxy', ->
  @timeout(1000)
  beforeEach(->
    ScrollProxy.clean()
    el = document.createElement('div')
    inner = document.createElement('div')
    square = document.createElement('div')
    square.style.position = 'absolute'
    square.style.width  = '50px'
    square.style.height = '50px'
    square.style.top = '0'
    square.style.left = '0'
    inner.style.width = '2000px'
    inner.style.height = '2000px'
    inner.style.margin = '0'
    inner.style.position = 'absolute'
    inner.style.top = '0'
    inner.style.left = '0'
    el.style.width = '200px'
    el.style.height = '200px'
    el.style.margin = '0'
    el.style.padding = '0'
    el.style.position = 'absolute'
    inner.style.margin = '0'
    inner.style.padding = '0'
    el.style.overflow = 'scroll'
    el.appendChild(square)
    el.appendChild(inner)
    document.body.appendChild(el)
  )
  afterEach(->
    document.body.removeChild(el)
  )
  describe('when instantiating', ->
    it('should accept no argument calls and default to document.body', ->
      sp = new ScrollProxy()
      expect(sp.getTarget()).to.eql(document.body)
    )

    it('should accept attaching to the window object and remap to body', ->
      sp = new ScrollProxy(window)
      expect(sp.getTarget()).to.eql(document.body)
    )

    it('should accept attaching to the document and remap to document.body', ->
      sp = new ScrollProxy(document)
      expect(sp.getTarget()).to.eql(document.body)
    )

    it('should accept attaching to an HTMLElement', ->
      myElement = document.createElement('ul')
      sp = new ScrollProxy(myElement)
      expect(sp.getTarget()).to.eql(myElement)
    )

    it('should refuse garbage anchors and throw error', ->
      func = -> new ScrollProxy(1)
      expect(func).to.throw(Error)
    )
  )

  describe('when cleaning the ScrollProxy object', ->
    it('should clean all targets', ->
      myElement = document.createElement('ul')
      sp = new ScrollProxy(myElement)
      ScrollProxy.clean()
      expect(ScrollProxy._targetList.length).to.eql(0)
    )
  )

  describe('when returning information about the scroll element', ->

    it('should return 0 for both x and y in the initial state', ->
      sp = new ScrollProxy(el)
      expect(sp.x).to.eql(0)
      expect(sp.y).to.eql(0)
    )

    it('it should return the correct values after updating scroll position', ->
      sp = new ScrollProxy(el)
      el.scrollLeft = 20
      el.scrollTop = 20
      sp._updateViewportInfo()
      expect(sp.x).to.eql(20)
      expect(sp.y).to.eql(20)
    )

    it('should return the correct initial width and height', ->
      sp = new ScrollProxy(el)
      expect(sp.width).to.eql(200)
      expect(sp.height).to.eql(200)
    )

    it('should return the updated value of width and height if resized', ->
      sp = new ScrollProxy(el)
      el.style.width = '3000px'
      el.style.height = '3000px'
      sp._updateViewportInfo()
      expect(sp.width).to.eql(3000)
      expect(sp.height).to.eql(3000)
    )

    it('should return the correct initial scrollWidth and scrollHeight', ->
      sp = new ScrollProxy(el)
      expect(sp.scrollWidth).to.eql(2000)
      expect(sp.scrollHeight).to.eql(2000)
    )

    it('should return new scrollWidth and scrollHeight when resized', ->
      sp = new ScrollProxy(el)
      inner.style.width = '3000px'
      inner.style.height = '3000px'
      sp._updateViewportInfo()
      expect(sp.scrollWidth).to.eql(3000)
      expect(sp.scrollHeight).to.eql(3000)
    )
  )

  describe('when registering', ->
    beforeEach(->
      sp = new ScrollProxy()
      sp.unregister()
    )
    it('should be able to register when it is unregistered', ->
      expect(ScrollProxy._targetList.length).to.eql(0)
      sp.register()
      expect(ScrollProxy._targetList.length).to.eql(1)
    )

    it('should activate the ScrollProxy after registering', ->
      expect(ScrollProxy.active).to.be.false
      sp.register()
      expect(ScrollProxy.active).to.be.true
    )

    it('should refuse to register more than once', ->
      sp.register()
      func = -> sp.register()
      expect(func).to.throw(Error)
      expect(ScrollProxy.active).to.be.true
    )

    it('should not deactivate ScrollProxy when removing one target from two', ->
      sp.register()
      fixture = document.createElement('div')
      sp2 = new ScrollProxy(fixture)
      sp.unregister()
      expect(ScrollProxy._targetList.length).to.eql(1)
      expect(ScrollProxy.active).to.be.true
    )

    it('should deactivate ScrollProxy when removing the last target', ->
      sp.register()
      expect(ScrollProxy._targetList.length).to.eql(1)
      sp.unregister()
      expect(ScrollProxy._targetList.length).to.eql(0)
      expect(ScrollProxy.active).to.be.false
    )
  )

  describe('when checking for visibility', ->
    it('should throw error if element is not child of the target', ->
      sp = new ScrollProxy(el)
      anotherElement = document.createElement('div')
      func = -> sp.isElementVisible(anotherElement)
      expect(func).to.throw(Error)
    )

    it('should return true if the element is visible on view', ->
      sp = new ScrollProxy(el)
      result = sp.isElementVisible(square)
      expect(result).to.be.true
    )

    it('should return false if the element is invisible on view', ->
      sp = new ScrollProxy(el)
      el.scrollTop = 100
      el.scollLeft = 100
      result = sp.isElementVisible(square)
      expect(result).to.be.false
    )
  )

  describe('when handling scroll', ->
    it('should register a scroll event on window after instantiating', ->
      spy = sinon.spy(ScrollProxy, 'activate')
      sp = new ScrollProxy()
      expect(spy.calledOnce).to.be.true
    )

    it('should return immediately when no target is available', ->
      expect(ScrollProxy._handleScroll()).to.be.null
    )

    it('should return null when target is available but no events', ->
      sp = new ScrollProxy()
      e = {
        target: document
      }
      item = ScrollProxy._handleScroll(e)
      expect(ScrollProxy._targetList.length).to.eql(1)
      expect(item).to.be.null
    )

    it('should return the target when it is available and with events', ->
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      e = {
        target: el
      }
      sp.on('scroll', spy)
      item = ScrollProxy._handleScroll(e)
      expect(item).to.eql(el)
    )
  )

  describe('when dealing with the scroll delay', ->
    it('should be 250ms by default', ->
      sp = new ScrollProxy()
      expect(sp.getScrollDelay()).to.eql(250)
    )

    it('should accept a valid positive number', ->
      sp = new ScrollProxy()
      sp.setScrollDelay(300)
      newDelay = sp.getScrollDelay()
      expect(newDelay).to.eql(300)
    )

    it('should round decimal values', ->
      sp = new ScrollProxy()
      sp.setScrollDelay(255.3)
      newDelay = sp.getScrollDelay()
      expect(newDelay).to.eql(255)
    )

    it('should ignore wrong changes', ->
      sp = new ScrollProxy()
      sp.setScrollDelay(-1)
      sp.setScrollDelay([])
      sp.setScrollDelay(null)
      sp.setScrollDelay('junk')
      expect(sp.getScrollDelay()).to.eql(250)
    )
  )

  describe('when handling events', ->
    it('should not register events with invalid names', ->
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.on(1, spy)
      expect(sp._events.length).to.eql(0)
    )

    it('should not register events without callbacks', ->
      junk = 1
      sp = new ScrollProxy(el)
      sp.on('scroll', junk)
      expect(sp._events.length).to.eql(0)
    )
  )

  describe('when dealing with the scroll event', ->
    it('should attempt to throttle scroll', (done) ->
      @slow(300)
      spy = sinon.spy(ScrollProxy, '_handleScroll')
      # Waiting for the event to fire
      window.addEventListener('scroll', ->
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 50)
      , true)
      sp = new ScrollProxy(el)
      el.scrollTop = 20
    )

    it('should throttle the scrolling', (done) ->
      @slow(500)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 300)
        el.scrollTop = 40
      # Waiting for the event to fire
      window.addEventListener('scroll', func, true)
      sp.on('scroll', spy)
      el.scrollTop = 20
    )

    it('should respond to changes on the scroll delay on the fly', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(50)
      func2 = ->
        window.removeEventListener('scroll', func2, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledTwice
            done()
        , 100)
      func = ->
        window.removeEventListener('scroll', func, true)
        window.setTimeout(->
          sp.setScrollDelay(10)
          window.addEventListener('scroll', func2, true)
          el.scrollTop = 40
        , 50)
      # Waiting for the event to fire
      window.addEventListener('scroll', func, true)
      sp.on('scroll', spy)
      el.scrollTop = 20
    )

    it('should report just once if registered with once', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(50)
      func2 = ->
        window.removeEventListener('scroll', func2, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce
            done()
        , 100)
      func = ->
        window.removeEventListener('scroll', func, true)
        window.setTimeout(->
          sp.setScrollDelay(10)
          window.addEventListener('scroll', func2, true)
          el.scrollTop = 40
        , 50)
      # Waiting for the event to fire
      window.addEventListener('scroll', func, true)
      sp.once('scroll', spy)
      el.scrollTop = 20
    )

    it('should stop reporting if off is called', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(50)
      func2 = ->
        window.removeEventListener('scroll', func2, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce
            done()
        , 100)
      func = ->
        window.removeEventListener('scroll', func, true)
        window.setTimeout(->
          sp.setScrollDelay(10)
          window.addEventListener('scroll', func2, true)
          sp.off('scroll')
          el.scrollTop = 40
        , 50)
      # Waiting for the event to fire
      window.addEventListener('scroll', func, true)
      sp.on('scroll', spy)
      el.scrollTop = 20
    )

    it('should remove all the events related if off is called', ->
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.on('scroll', spy)
      sp.on('scroll', spy)
      sp.off('scroll')
      expect(sp._events.length).to.eql(0)
    )

    it('should ignore offing an unexistent event', ->
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      expect(sp._events.length).to.eql(0)
      sp.on('scroll', spy)
      expect(sp._events.length).to.eql(1)
      sp.off(1)
      expect(sp._events.length).to.eql(1)
    )

    it('should be able to remove a hand picked event', ->
      spy = sinon.spy()
      spy2 = sinon.spy()
      sp = new ScrollProxy(el)
      sp.on('scroll', spy)
      sp.on('scroll', spy2)
      sp._removeEvent(sp._events[0])
      expect(sp._events.length).to.eql(1)
    )

    it('should deliver the origin scroll data in callback args', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.args[0][0].target? then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('scroll', spy)
      el.scrollTop = 20
    )
  )

  describe('when dealing with offsetX events', ->
    it('should fire offsetX when scrolling sideways with offset 0', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetX', spy)
      el.scrollLeft = 20
    )

    it('should not fire offsetX if scrolling vertically', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if not spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetX', spy)
      el.scrollTop = 20
    )

    it('should not fire offsetX before reaching the left offset', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if not spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetX', spy, 200)
      el.scrollLeft = 199
    )

    it('should fire offsetX when reaching the left offset', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetX', spy, 200)
      el.scrollLeft = 200
    )

    it('should fire offsetX for any value past the left offset', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetX', spy, 200)
      el.scrollLeft = 1000
    )
  )

  it('should fire offsetX when reaching the right offset', (done) ->
    @slow(300)
    spy = sinon.spy()
    sp = new ScrollProxy(el)
    sp.setScrollDelay(10)
    func = ->
      window.removeEventListener('scroll', func, true)
      # Making sure it's second in order
      window.setTimeout(->
        if spy.called then done()
      , 100)
    window.addEventListener('scroll', func, true)
    sp.on('offsetX', spy, -200)
    el.scrollLeft = 200
  )

  it('should not fire offsetX for any value past the right offset', (done) ->
    @slow(300)
    spy = sinon.spy()
    sp = new ScrollProxy(el)
    sp.setScrollDelay(10)
    func = ->
      window.removeEventListener('scroll', func, true)
      # Making sure it's second in order
      window.setTimeout(->
        if not spy.called then done()
      , 100)
    window.addEventListener('scroll', func, true)
    sp.on('offsetX', spy, -200)
    el.scrollLeft = 300
  )

  describe('when dealing with offsetY events', ->
    it('should fire offsetY when scrolling vertically with offset 0', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetY', spy)
      el.scrollTop = 20
    )

    it('should not fire offsetY if scrolling sideways', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if not spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetY', spy)
      el.scrollLeft = 20
    )

    it('should not fire offsetY before reaching the bottom offset', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if not spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetY', spy, 200)
      el.scrollTop = 199
    )

    it('should fire offsetY when reaching the bottom offset', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetY', spy, 200)
      el.scrollTop = 200
    )

    it('should fire offsetY for any value past the bottom offset', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetY', spy, 200)
      el.scrollTop = 1000
    )

    it('should fire offsetY when reaching the top offset', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetY', spy, -200)
      el.scrollTop = 200
    )

    it('should not fire offsetY for any value past the top offset', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if not spy.called then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('offsetY', spy, -200)
      el.scrollTop = 300
    )
  )

  describe('when dealing with bound scroll events', ->
    it('should ignore the normal scroll delay', (done) ->
      @slow(300)
      spy = sinon.spy()
      el.scrollTop = 30
      sp = new ScrollProxy(el)
      sp.setScrollDelay(250)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.called then done()
        , 50)
      window.addEventListener('scroll', func, true)
      sp.on('top', spy)
      el.scrollTop = 0
    )

    it('should fire top by reaching the top of the viewport', (done) ->
      @slow(300)
      spy = sinon.spy()
      el.scrollTop = 30
      sp = new ScrollProxy(el)
      sp.setScrollDelay(250)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 250)
      window.addEventListener('scroll', func, true)
      sp.on('top', spy)
      el.scrollTop = 0
    )

    it('should fire bottom by reaching the bottom of the viewport', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(250)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 250)
      window.addEventListener('scroll', func, true)
      sp.on('bottom', spy)
      el.scrollTop = 10000
    )

    it('should fire left by reaching the left end of the viewport', (done) ->
      @slow(300)
      spy = sinon.spy()
      el.scrollLeft = 30
      sp = new ScrollProxy(el)
      sp.setScrollDelay(250)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 250)
      window.addEventListener('scroll', func, true)
      sp.on('left', spy)
      el.scrollLeft = 0
    )

    it('should fire right by reaching the right end of the viewport', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(250)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 250)
      window.addEventListener('scroll', func, true)
      sp.on('right', spy)
      el.scrollLeft = 10000
    )

    it('should respect possible top offsets', (done) ->
      @slow(300)
      spy = sinon.spy()
      el.scrollTop = 400
      sp = new ScrollProxy(el)
      sp.setScrollDelay(250)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 250)
      window.addEventListener('scroll', func, true)
      sp.on('top', spy, 200)
      el.scrollTop = 200
    )

    it('should respect possible bottom offsets', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(250)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 250)
      window.addEventListener('scroll', func, true)
      sp.on('bottom', spy, 200)
      el.scrollTop = 1600
    )

    it('should respect possible left offsets', (done) ->
      @slow(300)
      spy = sinon.spy()
      el.scrollLeft = 300
      sp = new ScrollProxy(el)
      sp.setScrollDelay(250)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 250)
      window.addEventListener('scroll', func, true)
      sp.on('left', spy, 100)
      el.scrollLeft = 100
    )

    it('should respect possible right offsets', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(250)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 250)
      window.addEventListener('scroll', func, true)
      sp.on('right', spy, 200)
      el.scrollLeft = 1600
    )
  )

  describe('when dealing with visibility events', ->
    it('should fire visible once element is on view', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('visible', spy, square)
      el.scrollLeft = 10
    )

    it('should fire invisible once element goes out of view', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if spy.calledOnce then done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('invisible', spy, square)
      el.scrollLeft = 500
    )
  )

  describe('when setting the hover delay', ->
    it('should be 250ms by default', ->
      sp = new ScrollProxy()
      expect(sp.getHoverDelay()).to.eql(250)
    )

    it('should accept a valid positive number', ->
      sp = new ScrollProxy()
      sp.setHoverDelay(300)
      newDelay = sp.getHoverDelay()
      expect(newDelay).to.eql(300)
    )

    it('should round decimal values', ->
      sp = new ScrollProxy()
      sp.setHoverDelay(255.3)
      newDelay = sp.getHoverDelay()
      expect(newDelay).to.eql(255)
    )

    it('should ignore wrong changes', ->
      sp = new ScrollProxy()
      sp.setHoverDelay(-1)
      sp.setHoverDelay([])
      sp.setHoverDelay(null)
      sp.setHoverDelay('junk')
      expect(sp.getHoverDelay()).to.eql(250)
    )
  )

  describe('when dealing with hover scroll', ->
    it('should disable hover on elements when enabled', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      sp.disableHoverOnScroll()
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if el.style.pointerEvents is 'none' then done()
        , 100)
      window.addEventListener('scroll', func, true)
      el.scrollLeft = 500
    )

    it('should re-enable after the scroll is done', (done) ->
      @slow(1000)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      sp.setHoverDelay(10)
      sp.disableHoverOnScroll()
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          if el.style.pointerEvents is 'auto' then done()
        , 500)
      window.addEventListener('scroll', func, true)
      el.scrollLeft = 500
    )

    it('enableHoverOnScroll should re-enable the hover on scrolling', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      sp.disableHoverOnScroll()
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          sp.enableHoverOnScroll()
          if el.style.pointerEvents is 'auto' then done()
        , 100)
      window.addEventListener('scroll', func, true)
      el.scrollLeft = 500
    )
  )

  describe('when receiving events', ->
    it('should set `this` context to the ScrollProxy instance', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          expect(spy.thisValues[0]).to.eql(sp)
          done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('scroll', spy)
      el.scrollLeft = 500
    )

    it('should return up to date values about the view', (done) ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      sp.setScrollDelay(10)
      func = ->
        window.removeEventListener('scroll', func, true)
        # Making sure it's second in order
        window.setTimeout(->
          expect(sp.x).to.eql(el.scrollLeft)
          expect(sp.y).to.eql(el.scrollTop)
          expect(sp.width).to.eql(el.offsetWidth)
          expect(sp.height).to.eql(el.offsetHeight)
          expect(sp.scrollWidth).to.eql(el.scrollWidth)
          expect(sp.scrollHeight).to.eql(el.scrollHeight)
          done()
        , 100)
      window.addEventListener('scroll', func, true)
      sp.on('scroll', spy)
      el.scrollLeft = 500
    )

    it('should support method chaining on the API', ->
      @slow(300)
      spy = sinon.spy()
      sp = new ScrollProxy(el)
      chain = sp.setScrollDelay(250)
      .unregister()
      .register()
      .on('scroll', spy)
      .off('scroll')
      .once('scroll', spy)
      .disableHoverOnScroll()
      .enableHoverOnScroll()
      .setScrollDelay(250)
      .setHoverDelay(250)
      expect(sp).to.eql(chain)
    )
  )
)
