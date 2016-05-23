# bm-design-videohub-simulator
Node.js simulation of a [Blackmagic Design Videohub](https://www.blackmagicdesign.com/products/smartvideohub)'s API.

## Background

The Videohub is an SDI video router for professional AV production environments. It has a few control apps for iPad and computer but lacks advanced controls features. I was building a control app for a client and needed to test the behavior the Videohub. But due to the prohibitive cost, I couldn't test on an actual device. Instead, I built a basic simulation of the Videohub's behavior according to [Blackmagic Design's excellent API documentation](https://www.blackmagicdesign.com/support/download/d750136f91914a74aad2d40b2d7ac581/Mac%20OS%20X). This simulation is functional enough to work with the Blackmagic-supplied control apps without problems.

## Usage

To use, install node.js. Then, run the following command:

```
node simulator.js
```

This will start a server on `localhost` at the default port of `9990`.

The simulator depends only on the built-in `net` node.js library. There are no other dependencies.

### Features

* Supports routing, label, frame sync, and serial changes.
* Changes will be updated on the server and pushed to all connected clients.
* Supports multiple models of Videohub (though only one is configured out-of-the-box).

### Limitations

* Does not track routing locks by IP--these are accepted but silently ignored.
* No saving of current state to disk. State is lost and reset when the server is restarted.
