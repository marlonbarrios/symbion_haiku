
let img;
let promptInput;
let textMotor = 0;
let textOutput = ''; // Variable to store text received from the server
let caract = ['images in black and white techno futiristic, realistic'];
function setup() {
  createCanvas(windowWidth, 800);
  background(78, 135, 140);

  // Create an input field for user prompts
  promptInput = createInput('a strange ritual of symbionts'); // Set a default prompt
  promptInput.style('width', '400px'); // Set the width of the input field

  // Create a single button for generating both text and images
  createButton('generate').mousePressed(generateContent);
}

async function generateContent() {
  await generateText(); // Generate text first
  await generateImage(); // Then generate image
  // No need to call redraw here, as it will be called at the end of generateImage
}

async function generateText() {
  // Send a POST request to the /api/text endpoint with the prompt from the input field
  const response = await fetch('/api/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    

    body: JSON.stringify({ prompt:  promptInput.value() }),
  });
  const data = await response.json();
  textOutput = data.output.join(''); // Update textOutput with the received text
}

async function generateImage() {
  // Send a POST request to the /api/image endpoint with the prompt for image generation
  const response = await fetch('/api/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt:caract + textOutput }),
  });
  const data = await response.json();
  loadImage('data:image/png;base64,' + data.image, gotImage); // Load and display the image
}

function gotImage(loadedImage) {
  img = loadedImage;
  redraw(); // Redraw the canvas to display the loaded image and then the text
}
function draw() {

    // Calculate the text position and area more accurately
    // let textX = mouseX; // Horizontal center of the canvas
    let textY = mouseY; // Vertical center of the canvas
    let textWidth = width /3; // Use the entire canvas width but subtract a margin

  background(78, 135, 140); // Clear the canvas each frame
  if (img) {
    // Display the image to cover the entire canvas
    image(img, 0, 0, 800, 800);

    // Display the generated text over the image
    fill(181, 255, 225); // Set text color to white for visibility
    textSize(30); // Set text size
    textFont('Helvetica'); // Set a monospaced font for consistent character width
    textAlign(CENTER, CENTER); // Align text to the center

    textWrap(WORD); // Ensure text wraps within the specified width
    let textY = textMotor;
    textMotor -= 0.5;
    if (textMotor < 0) {
      // reset to the bottom of the screen
      textMotor = height;
    }
    text(textOutput, width * 0.55, textY, textWidth); // Display the text centered at the calculated position
    redraw(); // Redraw the canvas to display the text
  } else {
    // Display a default prompt if no content is available
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Enter a prompt and click "generate"', width / 2, height / 2);
  }
}


function keyPressed() {
  if (key === '1' || key === '2') {
    saveCanvas('hybrid', 'png');
  }
}
