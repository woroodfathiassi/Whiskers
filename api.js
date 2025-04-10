export function getDogImages() {
    // set header variables
    const headers = new Headers({
        "Content-Type": "application/json",
        "x-api-key": "live_PRIv1w0T8OQl504JWsq3KkVssZFllb5NG6gKuH442Sut8Su9d2toqtr8gRjqSBXC"  // Replace with your actual API key
    });
    
    // set http request configurations
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };
    
    // create an empty array to store image URLs
    let imageUrls = [];
    
    // make a fetch request with 25 images from a random order and any page
    return fetch("https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=25", requestOptions)
        .then(response => response.json())  // parse response as JSON
        .then(result => {
            // loop through the result and extract image URLs
            result.forEach(imageData => {
                imageUrls.push(imageData.url);
            });

            return imageUrls;  // return the array of image URLs
        })

        .catch(error => {
            console.log('error', error);  // log any errors
            return [];  // return empty array if there is a problem
        });
}

export function getCatImage() {
    // set header variables
    const headers = new Headers({
        "Content-Type": "application/json",
        "x-api-key": "live_rUalW5FAUpSyO3GC82J7Atj8QhackaIcyPCBEuhdCh4FtxijPS5WFyid08Ztj4Df"  // Replace with your actual API key
    });
    
    // set http request configurations
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };
    
    // create an empty array to store image URLs
    let imageUrls = [];
    
    // make a fetch request with 25 images from a random order and any page
    return fetch("https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1", requestOptions)
        .then(response => response.json())  // parse response as JSON
        .then(result => {
            // loop through the result and extract image URLs
            result.forEach(imageData => {
                imageUrls.push(imageData.url);
            });

            return imageUrls;  // return the array of image URLs
        })

        .catch(error => {
            console.log('error', error);  // log any errors
            return [];  // return empty array if there is a problem
        });
}