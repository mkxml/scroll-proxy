# Contributing

So you want to contribute to `scroll-proxy`? Great! There are many things you can do to improve the library.

## Opening issues

Issues are the most simple and easy way to contribute, fell free to ask questions, report bugs or suggest new features.

 - **When reporting bugs** please specify the conditions of your system such as OS and browser version.
 - **When proposing features** please explain the feature purpose and how you it would be useful for users. Be prepared to discuss the feature implementation.

## Making code contributions

Pull requests are great if you want to contribute with code or documentation. To keeps things organized we have a few rules for PRs.

### Building the project

Make sure you have both [node](https://nodejs.org/) and [npm](https://www.npmjs.com/) (it comes with node) installed.

We rely heavily on [grunt](http://gruntjs.com/), please install it before proceeding if you don't already have it by running this command:

`npm install -g grunt-cli`

To build the project follow the steps on your terminal of choice:

 1. Clone the project and `cd` to the root folder.
 2. Run `npm install`
 3. Run `grunt build`

And there you go, you have a working version of `scroll-proxy` in the `dist` folder, the CommonJS libs in the `lib` folder and the full documentation in the `docs` folder.

### Writing code

Code should be written in CoffeeScript and should follow the strict version of [Idiomatic CoffeeScript](https://github.com/mkautzmann/Idiomatic-CoffeeScript).

Also make sure your editor supports [editorconfig](http://editorconfig.org/) and respects the rules in the `.editorconfig` file.

#### Testing the code

We try to maintain full test coverage, so if you change the API substantially please include tests according to the current pattern.

The `grunt test` command will actually inform you if your test coverage is acceptable before you even submit the PR.

### Submitting the PR

After writing your change you should first run tests in your code with `npm test` to see if everything is fine: following coding style, passing tests and so on.

When everything is ready to push please submit your PR to the **dev** branch. The master branch only contains stable code ready to release at any time.

## Documentation

Documentation improvements are always welcome. You may change things in README or in the official [wiki](https://github.com/mkautzmann/scroll-proxy/wiki).

## Tips when developing

We have a bunch of tips and shortcuts you can use when developing and debugging `scroll-proxy`. The first thing you need to know is that we use [grunt](http://gruntjs.com/) tasks a lot.

Here are one list of useful tasks you can use while playing with the project:

  - `grunt build` will build the whole project.
  - `grunt lint`, will check the code against strict [Idiomatic CoffeeScript](https://github.com/mkautzmann/Idiomatic-CoffeeScript).
  - `grunt test` will lint and test the project.
  - `grunt demo` will spin up a demo server and open your default browser.
  - `grunt clean` will take the project back to the state it was on cloning.
  - `grunt watch`, will keep building the project while you change the code.
  - `grunt --help` will display all the tasks available.

**Use the demo folder for manual testing**. The demo folder is great for manual testing, use it along side your browser inspector and debug CoffeeScript code directly. That's the magic of [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

## Finally

Have fun, don't take it all too seriously. When in doubt, please use the [issues](https://github.com/mkautzmann/scroll-proxy/issues) feature.
