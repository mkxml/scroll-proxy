# <a href="#" id="top"></a> scroll-proxy

<img src="https://cldup.com/DRQ7JPq9se.png" title="scroll-proxy banner" style="border: 0; max-width: 1200px; width: 100%;">

[![Build]](https://circleci.com/gh/mkautzmann/scroll-proxy/tree/master) [![SemVer]](http://semver.org/) [![Coverage]](https://coveralls.io/github/mkautzmann/scroll-proxy?branch=master) [![License]](LICENSE)

[![Tests](https://saucelabs.com/browser-matrix/scrollproxy.svg)](https://saucelabs.com/u/scrollproxy)

## Table of contents

  - [Goal](#goal)
  - [Install](#install)
    - [A) I'm using NPM and browserify :sunglasses:](#optionA)
    - [B) I love Bower! :kissing_closed_eyes:](#optionB)
    - [C) I'm not into package management... :worried:](#optionC)
    - [D) I don't even want to download it, haha. :smirk:](#optionD)
  - [Usage](#usage)
    - [How it works](#how)
    - [Setup](#setup)
    - [Registering scroll events](#on)
    - [Getting metadata](#metadata)
    - [Getting rid of unused events](#off)
    - [Unregistering the `scroll-proxy` instances](#unregistering)
    - [Dealing with animations](#animations)
    - [Other great functionality](#other)
  - [Browser support](#support)
  - [License](#license)

## <a href="#" id="goal"></a> :scroll: Goal

This package is designed to help dealing with the scroll event in the **browser** in the most smoothly way possible.

Yes, web browsers already deliver ways to listen for the scroll event and they work really well. What `scroll-proxy` does is proxy the calls from you to the native scroll event and the other way around, doing some transformations in the process.

It applies some techniques already frequently used by web developers such as **function throttling**, **animation toggling** and a few others on **scroll**-related events. Delivering a small library one can just download and use.

The project's main focus is to help developers achieve great scroll performance in their apps while still being able to implement stuff like **scroll-based animations**, **sticky headers** and **infinite scrolling**.

## <a href="#" id="install"></a> :zap: Install

The installation process is pretty straight-forward. Just go to the root folder of your project and follow **one** of the 4 following options:

##### <a href="#" id="optionA"></a> A) I'm using NPM and browserify :sunglasses:

If you use `browserify` and NPM you may install with this command:

`npm install scroll-proxy --save`

##### <a href="#" id="optionB"></a> B) I love  Bower! :kissing_closed_eyes:

Bower is another package manager supported. To install, just run:

`bower install scroll-proxy --save`

##### <a href="#" id="optionC"></a> C) I'm not into package management... :worried:

No problem. Just [download the ZIP](), unzip it and use it as any other JS script.

##### <a href="#" id="optionD"></a> D) I don't even want to download it, haha. :smirk:

You don't have to. You may use it directly via one of the [CDN providers]().

## <a href="#" id="usage"></a> :beginner: Usage

### <a href="#" id="how"></a> How it works

One of the biggest concerns when developing `scroll-proxy` is its interoperability with other libs and frameworks.

So we decided not to change the native scroll handling. Instead, we create a wrapper that can handle everything the native can do and more.

This way we avoid breaking any other lib that may rely on the native scroll event.

The coolest part of the lib is the event handling, you can attach as many events you like but it will only attach one listener to the native `scroll` event in the browser. This practice is often called [event delegation](https://davidwalsh.name/event-delegate).

Please setup the lib and check for yourself.

### <a href="#" id="setup"></a> Setup

Setting up the library is simple and easy.

Once you've installed it and properly added it to your document via a `script` tag you just have to instantiate a new `ScrollProxy` object.

```javascript
var myScroll = new ScrollProxy();
```

You just did it!

Notice that you didn't pass any arguments to the `ScrollProxy` constructor. By default, ScrollProxy will always **attach** to `document.body`. It means it will report actions when the user scrolls the **page**.

If you want to get updates when the user scrolls inside some specific `HTMLElement` you must pass it to the constructor:

```javascript
var myDiv = document.querySelector('.scrollable');
var myDivScroll = new ScrollProxy(myDiv);
```

#### Note for CommonJS/browserify users

The CommonJS module version needs you to `require` ScrollProxy before using it like above.

```javascript
var ScrollProxy = require("scroll-proxy");
```

### <a href="#" id="on"></a> Registering scroll events

OK, ScrollProxy's set up. Now let's make some cool stuff.

The first thing you might want to do is to get updates whenever the user scrolls the page.

Usually, using just browsers APIs and vanilla JS, you could do that like this:

```javascript
window.addEventListener('scroll', function() {
  console.log("YAY, I'm scrolling!");
}, false);
```

And that would work great.

But note that it bombs your console with a lot of logs. That's because each movement on the scroll area causes one `scroll` event to fire.

That could be fine for logging as it's pretty fast but imagine doing complex calculations or animating stuff based on scroll position. That would be really slow and certainly laggy.

#### Here comes `scroll-proxy` to the rescue!

In `scroll-proxy` registering an event is as easy as calling the `on` function passing the name of the event and the callback function.

```javascript
var s = new ScrollProxy() // It defaults to document.body, just as we want it
s.on('scroll', function() {
  console.log("YAY, I'm scrolling!");
});
```

Now your `scroll` event belongs to ScrollProxy, it will automatically throttle the event calls with a 250ms delay by default.

That's great for most use cases but you can actually change it on the fly! Take a look:

```javascript
s.setScrollDelay(100);
```

Now subsequent events are respecting a 100ms delay. Easy, huh?

You could also just opt to get just a ping when the scroll event happened instead of keep monitoring, the function you are looking for is `once`. It is like `on` but, as the name implies, only fires once.

```javascript
s.once('scroll', function() {
  console.log("I have just scrolled");
})
```

Take your time to compare both vanilla and ScrollProxy implementations and see the difference. It certainly helps tame the frenzy `scroll` event calls.

#### ScrollProxy's custom events

Registering the `scroll` event is not the only thing ScrollProxy can do, actually it has a bunch of other cool events you can listen with the built in `on` and `once` functions.

The full list of events you can rely on:

  - `scroll`
  - `offsetX`
  - `offsetY`
  - `top`
  - `bottom`
  - `left`
  - `right`
  - `visible`
  - `invisible`

#### Special events

Some events accept a third argument in the `on` and `once` functions. The presence of this third argument and it's value modify the event handling.

**The offset events**

The `offsetX` and `offsetY` accept a third argument indicating a offset for `scroll-proxy` it to consider when firing the event. Take a look:

```javascript
var s = new ScrollProxy();

// The following event will fire whenever one scroll the X axis
s.on('offsetX', function() {
  console.log("It looks like someone scrolled the X axis");
});

// The next one will only fire when one scrolls past 300px from the left
s.on('offsetX', function() {
  console.log("I scrolled 300px or more from the left");
}, 300);
```

Note the presence of the optional third argument on the second `on` function call. It indicates an **offset** to respect. The same logic applies to the `offsetY` event as well.

**The top, bottom, left and right events**

These kind of events are usually used to determine if the user reached some of the borders of the scroll area. The third argument is useful here when you want to tell `scroll-proxy` to fire the event earlier than normal.

Let's say you want to implement infinite scrolling. You could just load new stuff when the user reaches the bottom of the scroll area, right? Yes, this would work, but wouldn't it be nicer if you could actually load the content **before** the user notices any loading?

For these types of use case the third argument comes handy.

```javascript
var s = new ScrollProxy();

// Loading new content when user reaches bottom
s.on('bottom', function() {
  loadMyAwesomeContent();
});

// Loading new content 200px from bottom, trying to avoid noticeable loading
s.on('bottom', function() {
  loadMyAwesomeContent();
}, 200);
```

**The visible and invisible events**

These are very special events that have limited use cases but sometimes are very welcome.

Both events will only work if the third argument is given. Yes, the third argument is not optional when using either `visible` or `invisible` events.

That's because the events need to check if the element passed in the third argument is visible in the scroll area.

There's another catch: **the element to be checked must be a direct child** of the scroll area `scroll-proxy` is attached to.

You may test this behavior by yourself in the [scroll-proxy website]().

```javascript
var scrollable = document.querySelector('.scrollable'); // My scroll area
var square = document.querySelector('.square'); // Direct child of scrollable
var s = new ScrollProxy(scrollable); // My ScrollProxy instance

// Ping me when square is visible
s.on('visible', function() {
  console.log("Square is visible");
}, square);
```

### <a href="#" id="metadata"></a> Getting metadata

`scroll-proxy` also delivers current information about the scroll area.

You can fetch info about the x and positions, the width and height of the scroll element and also the width and height of the scroll area.

```javascript
// Consider a window of 800x600 with a 2000x2000 div inside
var s = new ScrollProxy();
console.log(s.x); // Will log 0
console.log(s.y); // Will log 0
console.log(s.width); // Will log 800
console.log(s.height); // Will log 600
console.log(s.scrollWidth); // Will log 2000
console.log(s.scrollHeight); // Will log 2000
```

All the info you see above is updated realtime if you registered at least one event with `on`. In fact if you want to use these kind of info inside the event callback you could do like this:

```javascript
var s = new ScrollProxy();
s.on('scroll', function() {
  console.log(this.x); // Will log the current x position
  console.log(this.y); // Will log the current y position
});
```

### <a href="#" id="off"></a> Getting rid of unused events

If you want to remove a event listener created with `on` or cancel an `once` event before it is even fired you can just use `off`.

```javascript
var s = new ScrollProxy();
s.on('scroll', function() {
  console.log('YAY!');
});

s.off('scroll'); // No more YAY! logging
```

### <a href="#" id="unregistering"></a> Unregistering the `scroll-proxy` instances

When you don't want an instance of `scroll-proxy` around anymore you should call `unregister` before losing the variable pointer. That way you assure the memory is clean and the events are released.

```javascript
var s = new ScrollProxy();
s.on('scroll', function() {
  console.log('Scrolling');
});

// Unregistering. Stop event reports and clean stuff
s.unregister(); // Stopped logging

delete s; // Clear pointer, everything OK
```

The `register` function can recover unregistered instances and restore all the event handlers.

```javascript
var s = new ScrollProxy();
s.on('scroll', function() {
  console.log('Scrolling');
});

// Unregistering stop event reports
s.unregister(); // Stopped logging

s.register(); // Logging again on scroll
```

**Tip!** If you already lost the variable pointing to the `scroll-proxy` instance you can just call `ScrollProxy.clean()` and get rid of all the attachments.

```javascript
var s = new ScrollProxy(); // Attaching ScrollProxy to document.body

// Getting scroll events
s.on('scroll', function() {
  console.log('Scrolling...');
});

delete s; // Remove s reference

// Still getting 'Scrolling...' on scroll, because s.unregister() wasn't called

// Can't s.unregister() now because it's undefined :(

// So clean everything with ScrollProxy.clean()! :)
ScrollProxy.clean();

// Now it will stop logging and everything is fine again
```

### <a href="#" id="animations"></a> Dealing with animations

`scroll-proxy` can be a great partner in your quest for 60FPS animations!

The first thing you need to know is that by using the custom `scroll` event you are already helping your websites performance. As you read earlier it throttles the event firing and all you need to do is select a proper **delay** using `setScrollDelay`.

But, that's not all! There is another trick we built in the library: **animation toggling**. Yes, if you have a long page with a lot of hover animations you should be aware that scrolling that page may result in a janky experience.

To solve that you'll want to use the `disableHoverOnScroll` method. It will disable all hover animations inside the scroll area when the user is scrolling, resulting in a much better experience.

```javascript
var s = new ScrollProxy();
s.disableHoverOnScroll();
```

That's it! Don't worry, all the animations will come back to life once the user stops scrolling. It's all possible thanks to the [pointer-events](https://developer.mozilla.org/pt-BR/docs/Web/CSS/pointer-events) spec.

If you need to enable animations on scroll again for some reason you can do that:

```javascript
s.enableHoverOnScroll();
```

Notice that it applies a little delay between the scroll stop and the animation enabling, if you want to change that delay use the `setHoverDelay` method.

```javascript
// From now on, animations will resume after a 100ms delay after the scroll stop
s.setHoverDelay(100);
```

### <a href="#" id="other"></a> Other great functionality

There are some other great features in the lib, check the [wiki](https://github.com/mkautzmann/scroll-proxy/wiki) for more information.

## <a href="#" id="support"></a> Browser support

This library works with most modern browsers. Some features like the animation toggling require support for the css [pointer-events](https://developer.mozilla.org/pt-BR/docs/Web/CSS/pointer-events) spec.

We test practical support in a handful of browsers over SauceLabs, the support matrix in on the [top of this file](#top).

Theoretical support should include the following browsers:

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_64x64.png" width="32px" height="32px"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_64x64.png" width="32px" height="32px"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_64x64.png" width="32px" height="32px"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_64x64.png" width="32px" height="32px"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_64x64.png" width="32px" height="32px"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_64x64.png" width="32px" height="32px">  | Android | iOS |
| :---:  |:---:|  :---:  | :---: | :---:  | :---:|  :---:  |:---:|
|   40+  | 11+ |   40+   |  29+  |   8+   |  12+ |   4.0+  |  8+ |

You may get it to work on older browsers as well but some features may not function properly. The table above only states fully supported browsers.

## <a href="#" id="license"></a> License

[MIT License](LICENSE) © Matheus Kautzmann

[Build]: https://img.shields.io/circleci/project/mkautzmann/scroll-proxy/master.svg
[SemVer]: https://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[Coverage]: https://img.shields.io/coveralls/mkautzmann/scroll-proxy/master.svg
[License]: https://img.shields.io/npm/l/scroll-proxy.svg
