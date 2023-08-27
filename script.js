// odpri nov web socket na portu 9090 local host
const ws = new WebSocket('ws://localhost:9091');
// tukaj napišeš IP računalnika
// const ws = new WebSocket('ws://172.20.10.8:9090');


// **********  INICIALIZACIJA widget-ov IZ HTML-JA **********************************

// clear button
const clearBtn = document.getElementById('clearBtn');

// reset button
const resetBtn = document.getElementById('resetBtn');


// change line colour button
const redBtn = document.getElementById('redBtn');
const greenBtn = document.getElementById('greenBtn');
const blueBtn = document.getElementById('blueBtn');

// prikaz dejanske barve črte
const actualRcolor = document.getElementById('colorR');
const actualGcolor = document.getElementById('colorG');
const actualBcolor = document.getElementById('colorB');


// prikaz pozicije želve
const turtleXElement = document.getElementById('turtleX');
const turtleYElement = document.getElementById('turtleY');
const turtleThetaElement = document.getElementById('turtleTheta');

// gumbi za kontrolo želve
const XplusBtn = document.getElementById('x+Btn');
const XminusBtn = document.getElementById('x-Btn');
const YplusBtn = document.getElementById('y+Btn');
const YminusBtn = document.getElementById('y-Btn');
const RotationplusBtn = document.getElementById('rotation+Btn');
const RotationminusBtn = document.getElementById('rotation-Btn');

// gumbi za abslolutni teleport želve
const AbsTeleportBtn = document.getElementById('Abs_Teleport_Btn');
const x_abs_CoordInput = document.getElementById('xCoord');
const y_abs_CoordInput = document.getElementById('yCoord');

// nastavitev željene barve črte
const redColorInput = document.getElementById('redColor');
const greenColorInput = document.getElementById('greenColor');
const blueColorInput = document.getElementById('blueColor');
const widthInput = document.getElementById('width');
const setColorBtn = document.getElementById('setColorBtn');

// Rotate the turtle by the specified angle theta (ACTION)
const rotateAbsoluteBtn = document.getElementById('rotateAbsoluteBtn');
const thetaInput = document.getElementById('theta');
const angleFeedback = document.getElementById('angleFeedback');
const rotationresult = document.getElementById('rotationresult');
const rotationdelta = document.getElementById('rotationDelta');

// Set background color button and input
const bgRedInput = document.getElementById('bgRed');
const bgGreenInput = document.getElementById('bgGreen');
const bgBlueInput = document.getElementById('bgBlue');
const setBackgroundBtn = document.getElementById('setBackgroundBtn');



//*********************** SEND SERVICE REQUEST ************************************* */

// ob pritisku na gumb pošlji service request za clear zaslona!
clearBtn.addEventListener('click', () => {
  sendServiceRequest('/clear');
});

// ob pritisku na gumb pošlji service request za clear zaslona!
resetBtn.addEventListener('click', () => {
  sendServiceRequest('/reset');
});

// ob pritisku na gumb pošlji service request za spremembo barve črte!
redBtn.addEventListener('click', () => {
  sendServiceRequest('/turtle1/set_pen', { r: 255, g: 0, b: 0, width: 3 });
});

greenBtn.addEventListener('click', () => {
  sendServiceRequest('/turtle1/set_pen', { r: 0, g: 255, b: 0, width: 3  });
});

blueBtn.addEventListener('click', () => {
  sendServiceRequest('/turtle1/set_pen', { r: 0, g: 0, b: 255, width: 3  });
});

// nastavitev željene barve in debeline črte želve
setColorBtn.addEventListener('click', () => {
  const red = parseInt(redColorInput.value);
  const green = parseInt(greenColorInput.value);
  const blue = parseInt(blueColorInput.value);
  const width = parseInt(widthInput.value);

  // preveri če je nastavljena barva v dosegu med 0-255
  if (isValidColor(red) && isValidColor(green) && isValidColor(blue) && isValidWidth(width)) {
    sendServiceRequest('/turtle1/set_pen', { r: red, g: green, b: blue, off: 0, width: width });
  } else {
    console.error('Invalid color values. Please enter values between 0 and 255.');
  }
});
// preveri če je nastavljena barva v dosegu med 0-255
function isValidColor(value) {
  return Number.isInteger(value) && value >= 0 && value <= 255;
}
// preveri če je nastavljena debelina v dosegu med 0-10
function isValidWidth(value) {
  return Number.isInteger(value) && value >= 0 && value <= 10;
}

// absolutno teleportiranje želve
  AbsTeleportBtn.addEventListener('click', () => {
  const abs_x = parseInt(x_abs_CoordInput.value);
  const abs_y = parseInt(y_abs_CoordInput.value);
  sendServiceRequest('/turtle1/teleport_absolute', { x: abs_x, y: abs_y, theta: 0});
});

setBackgroundBtn.addEventListener('click', () => {
  
  const bgRedColor = parseInt(bgRedInput.value);
  const bgGreenColor = parseInt(bgGreenInput.value);
  const bgBlueColor = parseInt(bgBlueInput.value);
  console.log('bgRedColor:', bgRedColor); // Debugging line
  sendServiceRequest('/turtlesim/set_background_color', {
  name_r: 'background_r',type_r: 2, integer_value_r: bgRedColor,
  name_g: 'background_g',type_g: 2, integer_value_g: bgGreenColor,
  name_b: 'background_b',type_b: 2, integer_value_b: bgBlueColor});
  

//   // preveri če je nastavljena barva v dosegu med 0-255
//   if (isValidColor(bgColor)) {
//     const parameter = { name: 'background_r', value: { type: 2, integer_value: bgColor } };
//     sendServiceRequest('/turtlesim/set_background_color', { parameters: [parameter] });
//   } else {
//     console.error('Invalid color value. Please enter a value between 0 and 255.');
//   }
});

// function isValidColor(value) {
//   return Number.isInteger(value) && value >= 0 && value <= 255;
// }


// action za absolutno rotacijo želve
rotateAbsoluteBtn.addEventListener('click', () => {
  const RotationAngle = parseInt(thetaInput.value);
  sendServiceRequest('/turtle1/rotate_feedback', { angle: RotationAngle});
});


// funkcija za pošiljanje service-ov ROSU
function sendServiceRequest(serviceName, args = {}) {
  ws.send(JSON.stringify({ service: serviceName, args: args }));
  console.log({ service: serviceName, args: args })
}


//****************** PUBLISHER NA TOPICE ********************************* */

XplusBtn.addEventListener('mousedown', () => {
  sendCommand({ linear: { x: 1.0, y: 0.0 }, angular: { z: 0.0 } });
  //sendPublish({ linear: { x: 1.0, y: 0.0 }, angular: { z: 0.0 } },'/turtle1/cmd_vel' );
});

XplusBtn.addEventListener('mouseup', () => {
  sendCommand({ linear: { x: 0.0, y: 0.0 }, angular: { z: 0.0 } });
});

XminusBtn.addEventListener('mousedown', () => {
  sendCommand({ linear: { x: -1.0, y: 0.0 }, angular: { z: 0.0 } });
});

XminusBtn.addEventListener('mouseup', () => {
  sendCommand({ linear: { x: 0.0, y: 0.0 }, angular: { z: 0.0 } });
});

YplusBtn.addEventListener('click', () => {
  sendCommand({ linear: { x: 0.0, y: 1.0 }, angular: { z: 0.0 } });
});

YminusBtn.addEventListener('click', () => {
  //sendCommand(-1.0, 0.0);
  sendCommand({ linear: { x: 0.0, y: -1.0 }, angular: { z: 0.0 } });
});

RotationplusBtn.addEventListener('click', () => {
  //sendCommand(0.0, 1.0);
 sendCommand({ linear: { x: 0.0, y: 0.0 }, angular: { z: 1.0 } });
  //sendPublish('/turtle1/cmd_vel', { linear: { x: 0.0, y: -1.0 }, angular: { z: 0.0 } });
});

RotationminusBtn.addEventListener('click', () => {
  //sendCommand(0.0, -1.0);
  sendCommand({ linear: { x: 0.0, y: 0.0 }, angular: { z: -1.0 } });
});

//pošiljaj komande za kontrolo želve
 function sendCommand(twistMsg) {
  ws.send(JSON.stringify(twistMsg));
}

// funkcija za publish na ROS
// function sendPublish(publishName, twistMsg) {
//   ws.send(JSON.stringify({ topic: publishName, twistMsg}));



// ******************SUBSCRIBER NA TOPICE*********************************************

// pridobi položaj ževle
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // ************* SUBSCRIBER ********************
  if (message.topic === '/turtle1/pose') {
    updateTurtlePosition(message.msg);
  }
  // pridobi RGB color črte
  else if (message.topic === '/turtle1/color_sensor') {
    updateLineColor(message.msg);
  }
  // ********** FEEDBACK ACTION-a **********************
  // pridobi feedback za rotacijo
  else if (message.topic === '/turtle1/rotate_feedback') {
      updateRotationFeedback(message.msg);
  }
  else if (message.topic === '/turtle1/rotate_result') {
    updateRotationResult(message.msg);
}
else if (message.topic === '/turtle1/rotate_delta') {
  updateRotationDelta(message.msg);
  
}
};

 // ************* SUBSCRIBER ********************
// pridobi položaj želve
function updateTurtlePosition(poseMsg) {
  turtleXElement.innerText = poseMsg.x.toFixed(2);
  turtleYElement.innerText = poseMsg.y.toFixed(2);
  turtleThetaElement.innerText = poseMsg.theta.toFixed(2);
}

// pridobi dejansko barvo črte
function updateLineColor(colorSensMsg) {
  actualRcolor.innerText = colorSensMsg.r.toFixed(2);
  actualGcolor.innerText = colorSensMsg.g.toFixed(2);
  actualBcolor.innerText = colorSensMsg.b.toFixed(2);
}
// ********************************** FEEDBACK ACTION-a **********************
// pridobi feedback za rotacijo
function updateRotationFeedback(rotationFeedbackMsg) {
  angleFeedback.innerText = rotationFeedbackMsg.toFixed(5);
}

  // pridobi rezultat action-a (OK / NOK)
  function updateRotationResult(rotationResultMsg) {
    rotationresult.innerText = rotationResultMsg;
  }

  function updateRotationDelta(rotationDeltaMsg) {
    rotationdelta.innerText = rotationDeltaMsg;
  }


