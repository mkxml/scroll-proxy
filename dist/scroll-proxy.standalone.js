/*scroll-proxy@0.1.0*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ScrollProxy = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SUtil,slice=[].slice;module.exports=SUtil=function(){function t(){}return t.reportChange=function(){var e,n,r;return n=arguments[0],r=arguments[1],e=3<=arguments.length?slice.call(arguments,2):[],t.isFunction(n)?n.apply(r,e):null},t.getType=function(t){return Object.prototype.toString.call(t)},t.removeItemFromArray=function(t,e){return t.splice(e,1)[0]},t.isFunction=function(e){return"[object Function]"===t.getType(e)},t.isNumber=function(e){return"[object Number]"===t.getType(e)},t.isString=function(e){return"[object String]"===t.getType(e)},t.isValidEventName=function(e){return t.isString(e)&&""!==e},t.isPositiveNumber=function(e){return t.isNumber(e)&&e>=0},t.isNegativeNumber=function(e){return t.isNumber(e)&&0>e},t}();

},{}],2:[function(require,module,exports){
var SUtil,ScrollProxy,indexOf=[].indexOf||function(t){for(var e=0,r=this.length;r>e;e++)if(e in this&&this[e]===t)return e;return-1};SUtil=require("./SUtil"),module.exports=ScrollProxy=function(){function t(t){if(null==t&&(t=document),t===document&&(t=t.body),t===window&&(t=t.document.body),!(t instanceof HTMLElement))throw new Error("Could not attach to a valid anchor");return this._target=t,this._events=[],this.register(),this._updateViewportInfo(),this}return t.active=!1,t._targetList=[],t.SCROLL="scroll",t.OFFSET_X="offsetX",t.OFFSET_Y="offsetY",t.TOP="top",t.BOTTOM="bottom",t.LEFT="left",t.RIGHT="right",t.VISIBLE="visible",t.INVISIBLE="invisible",t.DISABLE_HOVER="disable-hover",t.prototype._targetX="scrollLeft",t.prototype._targetY="scrollTop",t.prototype._target=null,t.prototype._events=[],t.prototype._scrollDelay=250,t.prototype._hoverDelay=250,t.prototype._hoverTimeout=null,t.prototype.x=0,t.prototype.y=0,t.prototype.width=0,t.prototype.height=0,t.prototype.scrollWidth=0,t.prototype.scrollHeight=0,t.prototype.scrollData={},t._handleScroll=function(e){var r,n;return r=t._targetList.length,0===r?null:(n=e.target.body||e.target,t._getElement(n).proxy._performScroll(e))},t._getElement=function(e){var r,n,o,i;for(i=t._targetList,n=0,o=i.length;o>n;n++)if(r=i[n],null!=r&&r.target===e)return r;return null},t.activate=function(){return t.active||(window.addEventListener(t.SCROLL,t._handleScroll,!0),t.active=!0),t.active},t.deactivate=function(){return window.removeEventListener(t.SCROLL,t._handleScroll,!0),t.active=!1},t.clean=function(){var e,r,n,o,i;for(o=t._targetList,i=[],r=0,n=o.length;n>r;r++)e=o[r],i.push(e.proxy.unregister());return i},t.prototype._updateViewportInfo=function(){return this.x=this._target[this._targetX],this.y=this._target[this._targetY],this.width=this._target.offsetWidth,this.height=this._target.offsetHeight,this.scrollWidth=this._target.scrollWidth,this.scrollHeight=this._target.scrollHeight,null},t.prototype._checkElement=function(t){if(indexOf.call(this._target.children,t)<0)throw new Error("Element must be child of the scroll element");return null},t.prototype._removeEvent=function(t){var e,r,n,o,i,l,s,a,u;for(a=this._events,r=o=0,l=a.length;l>o;r=++o)if(n=a[r],t===n){window.clearTimeout(t.timeout),delete t.fn,delete this._events[r];break}for(e=[],u=this._events,i=0,s=u.length;s>i;i++)n=u[i],null!=n&&e.push(n);return this._events=e},t.prototype._isRectVisible=function(t){var e,r;return this._updateViewportInfo(),e=this.x<t.x+t.w&&this.x>t.x-this.width,r=this.y<t.y+t.h&&this.y>t.y-this.height,e&&r},t.prototype._performScroll=function(t){var e,r,n,o,i;if(n=this._events.length,0===n)return null;for(this.scrollData=t,i=this._events,r=0,o=i.length;o>r;r++)e=i[r],e.fn.call(this,e);return this._target},t.prototype._throttleScroll=function(t,e){var r;return r=!1,function(n){return function(o){return r?void 0:(r=!0,o.timeout=window.setTimeout(function(){return r=!1,SUtil.reportChange(t,n,n.scrollData)},null!=e?e:n.getScrollDelay()))}}(this)},t.prototype._createEvent=function(t,e,r){var n;return n=this._throttleScroll(e,r),this._events.push({type:t,fn:n.bind(this),timeout:null})},t.prototype._createScrollEvent=function(t,e,r){return this._createEvent(t,function(t){return function(){return t._updateViewportInfo(),SUtil.reportChange(e,t,t.scrollData)}}(this),r)},t.prototype._createOffsetEvent=function(e,r,n){return null==n&&(n=0),e===t.OFFSET_X?this._createEvent(e,function(t){return function(){return t.x===t._target[t._targetX]?t._updateViewportInfo():(t._updateViewportInfo(),SUtil.isPositiveNumber(n)&&t.x<n||SUtil.isNegativeNumber(n)&&t.x>Math.abs(n)?void 0:SUtil.reportChange(r,t,t.scrollData))}}(this)):this._createEvent(e,function(t){return function(){return t.y===t._target[t._targetY]?t._updateViewportInfo():(t._updateViewportInfo(),SUtil.isPositiveNumber(n)&&t.y<n||SUtil.isNegativeNumber(n)&&t.y>Math.abs(n)?void 0:SUtil.reportChange(r,t,t.scrollData))}}(this))},t.prototype._createHorizontalBoundScrollEvent=function(e,r,n){return null==n&&(n=0),e===t.LEFT?this._createScrollEvent(e,function(t){return function(){return t.x<=Math.abs(n)?SUtil.reportChange(r,t,t.scrollData):void 0}}(this),0):this._createScrollEvent(e,function(t){return function(){return t.scrollWidth-t.x-t.width<=Math.abs(n)?SUtil.reportChange(r,t,t.scrollData):void 0}}(this),0)},t.prototype._createVerticalBoundScrollEvent=function(e,r,n){return null==n&&(n=0),e===t.TOP?this._createScrollEvent(e,function(t){return function(){return t.y<=Math.abs(n)?SUtil.reportChange(r,t,t.scrollData):void 0}}(this),0):this._createScrollEvent(e,function(t){return function(){return t.scrollHeight-t.y-t.height<=Math.abs(n)?SUtil.reportChange(r,t,t.scrollData):void 0}}(this),0)},t.prototype._createVisibilityScrollEvent=function(e,r,n){return this._checkElement(n),e===t.VISIBLE?this._createScrollEvent(e,function(t){return function(){return t.isElementVisible(n)?SUtil.reportChange(r,t,t.scrollData):void 0}}(this)):this._createScrollEvent(e,function(t){return function(){return t.isElementVisible(n)?void 0:SUtil.reportChange(r,t,t.scrollData)}}(this))},t.prototype.setScrollDelay=function(t){return SUtil.isPositiveNumber(t)&&(this._scrollDelay=Math.round(t)),this},t.prototype.getScrollDelay=function(){return this._scrollDelay},t.prototype.setHoverDelay=function(t){return SUtil.isPositiveNumber(t)&&(this._hoverDelay=Math.round(t)),this},t.prototype.getHoverDelay=function(){return this._hoverDelay},t.prototype.getTarget=function(){return this._target},t.prototype.getRect=function(t){return{x:t.offsetLeft,y:t.offsetTop,w:t.getBoundingClientRect().width,h:t.getBoundingClientRect().height}},t.prototype.on=function(e,r,n){if(!SUtil.isValidEventName(e))return this;if(!SUtil.isFunction(r))return this;switch(e){case t.SCROLL:this._createScrollEvent(e,r);break;case t.OFFSET_X:case t.OFFSET_Y:this._createOffsetEvent(e,r,n);break;case t.TOP:case t.BOTTOM:this._createVerticalBoundScrollEvent(e,r,n);break;case t.LEFT:case t.RIGHT:this._createHorizontalBoundScrollEvent(e,r,n);break;case t.VISIBLE:case t.INVISIBLE:this._createVisibilityScrollEvent(e,r,n)}return this},t.prototype.once=function(t,e,r){var n;return n=function(r){return function(){return SUtil.reportChange(e,r,r.scrollData),r.off(t)}}(this),this.on(t,n,r)},t.prototype.off=function(t){var e,r,n,o,i;if(!SUtil.isValidEventName(t))return this;for(i=this._events,r=n=0,o=i.length;o>n;r=++n)e=i[r],null!=e&&t===e.type&&this._removeEvent(e);return this},t.prototype.register=function(){var e;if(e=t._getElement(this._target),null!=e)throw new Error("Assign one proxy per target");return t._targetList.push({target:this._target,proxy:this}),t.activate(),this},t.prototype.unregister=function(){var e,r,n,o,i;for(i=t._targetList,e=n=0,o=i.length;o>n;e=++n)r=i[e],null!=r&&r.target===this._target&&SUtil.removeItemFromArray(t._targetList,e);return 0===t._targetList.length&&t.deactivate(),this},t.prototype.isElementVisible=function(t){return this._checkElement(t),this._isRectVisible(this.getRect(t))},t.prototype.disableHoverOnScroll=function(){return this._createScrollEvent(t.DISABLE_HOVER,function(t){return function(){return window.clearTimeout(t._hoverTimeout),t._target.style.pointerEvents="none",t._hoverTimeout=window.setTimeout(function(){return t._target.style.pointerEvents="auto"},t.getHoverDelay())}}(this),0),this},t.prototype.enableHoverOnScroll=function(){return this.off(t.DISABLE_HOVER),this._target.style.pointerEvents="auto",this},t}();

},{"./SUtil":1}]},{},[1,2])(2)
});