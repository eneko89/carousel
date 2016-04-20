Backbone + CSS3 Carousel
========================

A carousel built with Backbone and animated through CSS3 transitions. Built as
an assignment for a job application.

Carousel blocks are fetched from the '/blocks' endpoint on the server. Each
block displays 4 images, which are randomly picked from the 'images' array of
each block (so they could and probably would be repeated images in a block).


Instructions
------------

To run it you need node and npm installed. Then, open a terminal or a command
prompt and run the following in the project folder:

```
# Install dependencies.
npn install

# Run node server.
node .
```

It will run an HTTP server in http://localhost:3000 which will serve the static
index.html and needed scripts and styles. It'll also create a '/blocks' endpoint
which returns a JSON array of block objects.

Try it at http://carousel.eneko.me.


Features
--------

* Fully responsive (resize the window).
* Uses CSS3 transitions (IE10+) to animate the carousel.
