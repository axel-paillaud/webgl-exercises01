"use strict";

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    function main() {
    // Get A WebGL context
    var canvas = document.getElementById("glCanvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // Get the strings for our GLSL shaders
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorUniformLocation = gl.getUniformLocation(program, "u_color");

    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var headArray = [
        10, 20,
        270, 20,
        10, 270,
        10, 270,
        270, 20,
        270, 270,
    ];

    var leftEyeArray = [
        78, 30,
        135, 135,
        20, 135,
    ];

    var rightEyeArray = [
        200, 30,
        260, 135,
        145, 135,
    ];

    var mouthArray = [
        20, 220,
        260, 220,
        20, 250,
        20, 250,
        260, 220,
        260, 250,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(headArray), gl.STATIC_DRAW);

    // code above this line is initialization code.
    // code below this line is rendering code.

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);


    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(leftEyeArray), gl.STATIC_DRAW);
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
    gl.drawArrays(primitiveType, offset, 3);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rightEyeArray), gl.STATIC_DRAW);
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
    gl.drawArrays(primitiveType, offset, 3);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mouthArray), gl.STATIC_DRAW);
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
    gl.drawArrays(primitiveType, offset, count);


}

main();