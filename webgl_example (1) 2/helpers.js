
function loadShader(shaderId, shaderType) {
    const shader = gl.createShader(shaderType);

    gl.shaderSource(shader, document.getElementById(shaderId).text);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error while compiling shader", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createShaderProgram(vShaderId, fShaderId) {
    const vShader = loadShader(vShaderId, gl.VERTEX_SHADER);
    const fShader = loadShader(fShaderId, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error while linking program", gl.getProgramInfoLog(program));
        return false;
    }

    return program;
}
