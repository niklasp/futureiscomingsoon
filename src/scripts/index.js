import transitions from "gl-transitions";
import createTransition from "gl-transition";
import createTexture from "gl-texture2d";

import '../styles/index.scss';
import i1 from '../images/futureiscomingsoon.jpeg';
import i2 from '../images/futureiscomingsoon2.jpeg';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

export default class Future {
  constructor( options ) {
    this.time = 0;
    this.container = options.dom;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.mesh = undefined;

    this.canvas = document.createElement("canvas");
    this.container.appendChild( this.canvas );

    this.resize();
    this.setupListeners();
    this.addObjects();
    this.render();
  }

  setupListeners() {
    window.addEventListener( 'resize', this.resize.bind( this ) );
  }

  resize() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  addObjects() {
    const gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 4, 4, -1]), // see a-big-triangle
      gl.STATIC_DRAW
    );
    gl.viewport(0, 0, this.width, this.height);
    
    this.loadImages( [ i1, i2 ], ( imgs ) => {
    
      this.from = createTexture(gl, imgs[0]);
      this.from.minFilter = gl.LINEAR;
      this.from.magFilter = gl.LINEAR;
      
      this.to = createTexture(gl, imgs[1]);
      this.to.minFilter = gl.LINEAR;
      this.to.magFilter = gl.LINEAR;
      
      this.transition = createTransition(gl, transitions.find(t => t.name === "morph")); // https://github.com/gl-transitions/gl-transitions/blob/master/transitions/cube.glsl
    });
  }

  render() {
    this.time += 0.05;
    this.transition?.draw(2.0 * Math.sin( this.time / 30.0 ), this.from, this.to, this.canvas.width, this.canvas.height, { persp: 1.5, unzoom: 0.6 });
    window.requestAnimationFrame( this.render.bind( this ) );
  }

  loadImages( paths, whenLoaded ) {
    var imgs=[];
    paths.forEach(function(path){
      var img = new Image;
      img.onload = function() {
        imgs.push(img);
        if (imgs.length==paths.length) whenLoaded(imgs);
      };
      img.src = path;
    });
  }
}

new Future( { dom: document.getElementById( 'container' ) } );
