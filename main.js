import { getDogImages, getCatImage, startGameData, changeScore, getScore, deleteUserSession } from './api.js';

var isCat = false;
let catimage;
let gameId;

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function fetchDogImagesAndCatImage() {
    isCat = false;
    try {
        // Show loading spinner while fetching data
        const loadingSpinner = document.querySelector('.loading');
        loadingSpinner.style.display = 'block';

        // Fetch dog images and cat image in parallel
        const [dogImages1, dogImages2, catImage] = await Promise.all([getDogImages(), getDogImages(), getCatImage()]);
        catimage = catImage[0];
        console.log(catimage);
        let allImages = [...dogImages1, ...dogImages2, ...catImage];
        allImages = shuffleArray(allImages);

        // Preload all images
        await preloadImages(allImages);

        // Hide loading spinner after fetching data
        loadingSpinner.style.display = 'none';
        const imageDisplay = document.getElementById('imageDisplay');
        imageDisplay.style.display = 'inline-block'; // Show image display area

        // Call the function to display all images in sequence
        displayImagesInSequence(allImages);
    } catch (error) {
        console.error("Error fetching dog images:", error);
        const loadingSpinner = document.querySelector('.loading');
        loadingSpinner.style.display = 'none';
        alert("Failed to fetch dog images");
    }
}


function preloadImages(imageUrls) {
    return Promise.all(
        imageUrls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = url;
                img.onload = () => resolve(url);   // resolve when image is loaded
                img.onerror = reject;
            });
        })
    );
}

function displayImagesInSequence(images) {
    const imgElement = document.getElementById("imageDisplay"); // The same image element will be updated
    let index = 0;
    let delay = 700; // Start at 700 milliseconds
    const minDelay = 150; // Minimum delay: 150 milliseconds
    const totalImages = images.length;
    const decrement = (700 - minDelay) / (totalImages - 1); // Smooth decrement

    function showNextImage() {
        if (index >= totalImages) {
            console.log("All images shown!");
            return;
        }

        // Set the new image source
        imgElement.src = images[index];
        imgElement.setAttribute('data-image-type', images[index].includes('cat') ? 'cat' : 'dog');

        if(images[index].includes('cat')){
            isCat= true;
        }

        // Store the current time when the image is displayed
        const displayTime = new Date().getTime();  // Current timestamp in milliseconds
        imgElement.setAttribute('data-display-time', displayTime)

        index++;
        // Gradually reduce the delay, stop reducing once minDelay is reached
        // delay = Math.max(minDelay, delay - decrement);

        // Gradually reduce the delay, stop reducing once minDelay is reached
        delay = Math.max(minDelay, delay - decrement);
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

async function handleStart() {
    userName = document.getElementById("userName").value;
    if (!userName || userName.trim() === "") {
        alert("Please enter a user name");
        return;
    }

    localStorage.setItem('userName', JSON.stringify(userName));

    try {
        gameId = await startGameData(userName);
        console.log('Game ID:', gameId); 

        // Remove any previous game or result sections
        const oldGame = document.getElementById("game");
        if (oldGame) oldGame.remove();

        const oldResult = document.getElementById("result");
        if (oldResult) oldResult.remove();

        // Hide the container1 (home screen)
        document.querySelector('.container1').style.display = 'none';

        // Create the new game section (show this immediately)
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

        // Set up the stop button event listener
        const stopButton = document.querySelector('.stopBtn');
        stopButton.addEventListener('click', handleStop);

        // Reset the isCat variable
        isCat = false;

        // Start the image fetching process after rendering the game UI
        fetchDogImagesAndCatImage();

    } catch (error) {
        console.error("Failed to start game:", error);
        alert("Something went wrong starting the game.");
    }
}

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

    if (isCat) {
        console.log(`The cat image was displayed! Your reaction time was ${seconds} seconds and ${milliseconds} milliseconds.`);
        
        document.querySelector('.gameContainer').style.display = 'none';

        const resultDiv = document.createElement("div");
        resultDiv.id = "result";
        resultDiv.innerHTML = `
            <div class="resultContainer">
                <div class="imageContainer">
                    <h1 class="welcome">Congratulations, ${userName}!</h1>
                    <p id="p">The cat image was displayed! Your reaction time was <span id="span">${seconds}.${milliseconds}</span> seconds.</p>
                    
                    <img src="${catimage}" id="imageDisplay" class="dogImage" alt="Dog image" />
                </div>
            </div>
        `;
        console.log(`${catimage}`);
        changeScore(gameId, `${seconds}.${milliseconds}`);
        deleteUserSession(gameId);
        document.body.appendChild(resultDiv);

        const againButton = document.querySelector('.startBtn');
        againButton.addEventListener('click', handleStart); // Re-start the game
    } else{

        document.querySelector('.gameContainer').style.display = 'none';

        const resultDiv = document.createElement("div");
        resultDiv.id = "result";
        resultDiv.innerHTML = `
            <div class="resultContainer">
                <div class="imageContainer">
                    <h1 class="welcome">Oops, ${userName}!</h1>
                    <h2>You lose! The cat image was not displayed.</h2>
                    <img src="${catimage}" id="imageDisplay" class="dogImage" alt="Dog image" />
                </div>
            </div>
        `;
        changeScore(gameId, 0);
        deleteUserSession(gameId);
        document.body.appendChild(resultDiv);

        const againButton = document.querySelector('.startBtn');
        if (againButton) {
            againButton.addEventListener('click', handleStart); // Re-start the game
        }else{
            console.log('No button to add event listener to');
        }
    }
}