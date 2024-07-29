

const { mat4 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

const locations = {
    attributes: {
        vertexLocation: null,
        colorLocation: null
    }, uniforms: {
        modelViewMatrix: null,
        projectionMatrix: null,
    }
}

const viewMatrix = mat4.create();

window.onload = async () => {
    // basic setup 
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.729, 0.764, 0.674, 1);

    const program = createShaderProgram("v-shader", "f-shader");
    gl.useProgram(program);

    // save attribute & uniform locations
    locations.attributes.vertexLocation = gl.getAttribLocation(program, "vertexPosition");
    locations.attributes.colorLocation = gl.getAttribLocation(program, "vertexColor");
    locations.uniforms.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    locations.uniforms.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");

    // create & send projection matrix
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    gl.uniformMatrix4fv(locations.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);

    // create view matrix
    mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]);
    // translate view matrix
    mat4.translate(viewMatrix, viewMatrix, [-0.5, 0, 0])

    //  create 2 cubes and translate them away from each other
    shapes.push(createShape());
    shapes[0].translate([0.5, 0, 0]);

    shapes.push(createShape());
    shapes[1].translate([-0.5, 0, 0]);

    // Attach event listener for keyboard events to the window
    window.addEventListener("keydown", (event) => {
        // this event contains all the information you will need to process user interaction
        console.log(event)
    })

    // Load some data from external files - only works when serving from a webserver
    // await loadData();

    // start render loop
    requestAnimationFrame(render);
}

// simple example of loading external files
async function loadData() {
    const data = await fetch('helpers.js').then(result => result.text());
    console.log(data);
}

// Previous frame time
let then = 0;

function render(now) {
    // calculate elapsed time in seconds
    let delta = now - then;
    delta *= 0.001;
    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {
        // scale rotation amount by time difference
        shape.rotate(1 * delta, [1, 1, 0]);
        shape.draw();
    });

    requestAnimationFrame(render)
}


function createShape() {
    // define vertex positions & colors
    const vertices = [
        0.2, 0.2, 0.2,
        -0.2, 0.2, 0.2, 
        0.2, -0.2, 0.2, 

        -0.2, 0.2, 0.2,
        -0.2, -0.2, 0.2, 
        0.2, -0.2, 0.2, // front face end

        -0.2, -0.2, -0.2,
        -0.2, -0.2, 0.2,
        -0.2, 0.2, 0.2,

        -0.2, -0.2, -0.2, 
        -0.2, 0.2, 0.2, 
        -0.2, 0.2, -0.2,// left face end

        0.2, 0.2, -0.2, 
        -0.2, -0.2, -0.2, 
        -0.2, 0.2, -0.2, 

        0.2, 0.2, -0.2, 
        0.2, -0.2, -0.2, 
        -0.2, -0.2, -0.2,  // back face end

        0.2, -0.2, 0.2, 
        -0.2, -0.2, -0.2, 
        0.2, -0.2, -0.2, 

        0.2, -0.2, 0.2, 
        -0.2, -0.2, 0.2, 
        -0.2, -0.2, -0.2,  // bottom face end

        0.2, 0.2, 0.2, 
        0.2, -0.2, -0.2,
        0.2, 0.2, -0.2, 

        0.2, -0.2, -0.2,
        0.2, 0.2, 0.2, 
        0.2, -0.2, 0.2,  // right face end

        0.2, 0.2, 0.2, 
        0.2, 0.2, -0.2, 
        -0.2, 0.2, -0.2, 

        0.2, 0.2, 0.2, 
        -0.2, 0.2, -0.2, 
        -0.2, 0.2, 0.2,  // Top face end
    ];

    const colorData = [
        [0.0, 0.0, 0.0], // Front face: black
        [1.0, 0.0, 0.0], // left face: red
        [0.0, 1.0, 0.0], // back face: green
        [0.0, 0.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0], // Right face: yellow
        [1.0, 0.0, 1.0], // top face: pink
    ];

    const colors = [];

    /// add one color per face, so 6 times for each color
    colorData.forEach(color => {
        for (let i = 0; i < 6; ++i) {
            colors.push(color);
        }
    });

    // create shape object and initialize data
    const cube = new Shape();
    cube.initData(vertices, colors)

    return cube;
}

