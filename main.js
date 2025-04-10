import { getDogImages, getCatImage } from './api.js';

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function fetchDogImagesAndCatImage() {
    try {
        // Show loading spinner while fetching data
        const loadingSpinner = document.querySelector('.loading');
        loadingSpinner.style.display = 'block';

        const [dogImages1, dogImages2, catImage] = await Promise.all([getDogImages(), getDogImages(), getCatImage()]);
        let allImages = [...dogImages1, ...dogImages2, ...catImage];
        allImages = shuffleArray(allImages);
        console.log("Cat Image: "+catImage);

        // Hide loading spinner after fetching data
        loadingSpinner.style.display = 'none';
        imageDisplay.style.display = 'inline-block';

        // Call the function to display all images in sequence
        displayImagesInSequence(allImages);
    } catch (error) {
        console.error("Error fetching dog images:", error);
        const loadingSpinner = document.querySelector('.loading');
        loadingSpinner.style.display = 'none';
        alert("Failed to fetch dog images");
    }
}

function displayImagesInSequence(images) {
    const imgElement = document.getElementById("imageDisplay"); // The same image element will be updated
    let index = 0;
    let delay = 1200; // Start at 700 milliseconds
    const minDelay = 150; // Minimum delay: 150 milliseconds
    const totalImages = images.length;
    const decrement = (1200 - minDelay) / (totalImages - 1); // Smooth decrement

    function showNextImage() {
        if (index >= totalImages) {
            console.log("All images shown!");
            return;
        }

        // Set the new image source
        imgElement.src = images[index];
        imgElement.setAttribute('data-image-type', images[index].includes('cat') ? 'cat' : 'dog');

        // Store the current time when the image is displayed
        const displayTime = new Date().getTime();  // Current timestamp in milliseconds
        imgElement.setAttribute('data-display-time', displayTime)

        index++;
        // Gradually reduce the delay, stop reducing once minDelay is reached
        // delay = Math.max(minDelay, delay - decrement);

        setTimeout(showNextImage, delay);
    }

    showNextImage();
}

let userName;

document.addEventListener("DOMContentLoaded", function () {
    const homeDiv = document.createElement("div");
    homeDiv.id = "home";
    homeDiv.innerHTML = `
        <div class="container1">
            <img class="logo" src="images/whiskers.png" alt="Logo">
            <h1 class="title">Find - Whiskers</h1>
            <input type="text" name="userName" id="userName" placeholder="Enter user name!" >
            <button class="startBtn">Start</button>
        </div>
    `;
    document.body.appendChild(homeDiv);

    const startButton = document.querySelector('.startBtn');
    startButton.addEventListener('click', handleStart);
});

function handleStart() {
    userName = document.getElementById("userName").value;
    if (!userName || userName.trim() === "") {
        alert("Please enter a user name");
        return;
    }
    localStorage.setItem('userName', JSON.stringify(userName));

    document.querySelector('.container1').style.display = 'none';
    
    const gameDiv = document.createElement("div");
    gameDiv.id = "game";
    gameDiv.innerHTML = `
        <div class="gameContainer">
            <h1 class="welcome">Welcome ${userName}</h1>
            <!-- Loading Spinner -->
            <div class="loading" style="display:none;">
                <div class="spinner"></div>
            </div>
            <!-- Image Display Area -->
            <div class="imageContainer">
                <img id="imageDisplay" class="dogImage" alt="Dog image" />
                <button class="stopBtn"></button>
            </div>
            
        </div>
    `;
    document.body.appendChild(gameDiv);

    const stopButton = document.querySelector('.stopBtn');
    stopButton.addEventListener('click', handleStop); 

    // Call fetchDogImages after the game container is rendered
    fetchDogImagesAndCatImage();
}

let attemptsLeft = 2; 

function handleStop() {
    const imgElement = document.getElementById("imageDisplay");

    if (!imgElement.src || imgElement.src === "") {
        console.log("No image displayed!");
        return;
    }

    // Get the time when the image was displayed
    const displayTime = parseInt(imgElement.getAttribute('data-display-time'), 10);
    const stopTime = new Date().getTime();  // Current time when button is clicked
    
    const timeDifference = stopTime - displayTime;  // Difference in milliseconds

    // Convert milliseconds to a readable format
    const seconds = Math.floor(timeDifference / 1000);
    const milliseconds = timeDifference % 1000;

    // Check if the image displayed is a 'cat'
    const isCat = imgElement.getAttribute('data-image-type') === 'cat';
    const isDog = imgElement.getAttribute('data-image-type') === 'dog';

    if (isCat) {
        console.log(`You won! The cat image was displayed for ${seconds} seconds and ${milliseconds} milliseconds.`);
        
        document.querySelector('.gameContainer').style.display = 'none';

        const resultDiv = document.createElement("div");
        resultDiv.id = "result";
        resultDiv.innerHTML = `
            <div class="resultContainer">
                <div class="imageContainer">
                    <h1 class="welcome">Congratulations, ${userName}!</h1>
                    <h2>You won! The cat image was displayed for ${seconds} seconds and ${milliseconds} milliseconds.</h2>
                    <button class="startBtn">Play Again</button>
                </div>
            </div>
        `;
        document.body.appendChild(resultDiv);

        const againButton = document.querySelector('.startBtn');
        againButton.addEventListener('click', handleStart); // Re-start the game
    } else if(isDog){
        attemptsLeft--;

        document.querySelector('.gameContainer').style.display = 'none';

        let resultMessage = '';
        if (attemptsLeft > 0) {
            resultMessage = `You lost this round! You have ${attemptsLeft} attempt(s) left.`;
        } else {
            resultMessage = "You lost! No attempts left.";
        }

        const resultDiv = document.createElement("div");
        resultDiv.id = "result";
        resultDiv.innerHTML = `
            <div class="resultContainer">
                <div class="imageContainer">
                    <h1 class="welcome">Oops, ${userName}!</h1>
                    <h2>${resultMessage}</h2>
                    <button class="startBtn">Play Again</button>
                </div>
            </div>
        `;
        document.body.appendChild(resultDiv);

        const againButton = document.querySelector('.startBtn');
        if (againButton) {
            againButton.addEventListener('click', handleStart); // Re-start the game
        }else{
            console.log('No button to add event listener to');
        }
    }
}