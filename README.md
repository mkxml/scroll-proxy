# scroll-proxy

<img src="https://cldup.com/DRQ7JPq9se.png" title="scroll-proxy banner" style="border: 0; max-width: 1200px; width: 100%;">

[![Build]](https://circleci.com/gh/mkautzmann/scroll-proxy/tree/master) [![SemVer]](http://semver.org/) [![Coverage]](https://coveralls.io/github/mkautzmann/scroll-proxy?branch=master) [![License]](LICENSE)

[![Tests](https://saucelabs.com/browser-matrix/scrollproxy.svg)](https://saucelabs.com/u/scrollproxy)

## Goal

This package is designed to help dealing with the scroll event in the **browser**.

Yes, browsers already deliver ways to listening for the scroll event and they work well. This is the reason why this package is called `scroll-proxy`. It proxies the calls from you to the native scroll event and the other way around, doing some transformations in the process.

It applies some techniques already frequently used by web developers such as function throttling, animation toggling and a few others on scroll-related events. Delivering a small library one can just download and use.

The main focus is to help developers achieve great scroll performance in their apps while still being able to implement stuff like scroll-based animations, sticky headers and infinite scrolling.

## Building

**It is not yet ready but the skeleton is here.**

If you know [grunt]() you may hack already :smile:.

[Build]: https://img.shields.io/circleci/project/mkautzmann/scroll-proxy/master.svg
[SemVer]: https://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[Coverage]: https://img.shields.io/coveralls/mkautzmann/scroll-proxy/master.svg
[License]: https://img.shields.io/npm/l/scroll-proxy.svg
