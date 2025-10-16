// Function to get user's location and fetch data based on city or suburb
function getLocationAndFetchData() {
  if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              console.log(`user: ${lat}, ${lon}`);

              // Call function to convert lat/lon to city/suburb
              getCityFromCoordinates(lat, lon);
          },
          (error) => {
              console.error("Geolocation error:", error);
              document.getElementById("objectsContainer").innerHTML = `<p>Could not retrieve location. Showing default results.</p>`;

              // Fallback: Use a general query if geolocation fails
              getData("https://api.collection.nfsa.gov.au/search?query=dog");
          }
      );
  } else {
      console.log("Geolocation not supported in this browser.");
      document.getElementById("objectsContainer").innerHTML = `<p>Geolocation is not supported. Showing default results.</p>`;

      // Fetch default data
      getData("https://api.collection.nfsa.gov.au/search?query=dog");
  }
}

// Function to convert lat/lon into a city or suburb using OpenStreetMap's Nominatim API
function getCityFromCoordinates(lat, lon) {
  const geoApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  fetch(geoApiUrl)
      .then(response => response.json())
      .then(data => {
          console.log("Geocoding API Response:", data);

          // Extract city or suburb from response
          let locationName = data.address.suburb;

          if (locationName) {
              console.log(`Detected Location: ${locationName}`);
              searchByLocation(locationName);
          } else {
              console.log("No city/suburb found, using default search.");
              getData("https://api.collection.nfsa.gov.au/search?query=dog");
          }
      })
      .catch(error => {
          console.error("Error retrieving location:", error);
          getData("https://api.collection.nfsa.gov.au/search?query=dog");
      });
}

// Function to search NFSA API using city/suburb name
function searchByLocation(location) {
  const queryUrl = `https://api.collection.nfsa.gov.au/search?query=${encodeURIComponent(location)}`;
  console.log(`Searching NFSA API for: ${location}`);

  getData(queryUrl);
}

// Function to fetch data from NFSA API
async function getData(url) {
  try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("Full API Response:", data);
      displayResults(data.results);
  } catch (error) {
      console.error("Error fetching data:", error);
      document.getElementById("objectsContainer").innerHTML = `<p>Error fetching data. Please try again later.</p>`;
  }
}

// Function to display API results
function displayResults(results) {
  const objectsContainer = document.getElementById("objectsContainer");
  objectsContainer.innerHTML = ""; // Clear previous results

  results.forEach(item => {
      console.log("Item:", item); // Step to log each item

      // Extract the preview array
      const imgArr = item.preview || []; // Default to empty array

      // Initialize empty image URL
      let imgurl = "";

      // Loop through the preview array to find an image
      const baseurl = "https://media.nfsacollection.net/";
      for (let i = 0; i < imgArr.length; i++) {
          console.log("Preview object:", imgArr[i]); // Log preview object
          if (imgArr[i].hasOwnProperty("filePath")) {
              imgurl = baseurl + imgArr[i].filePath;
              break; // Use the first valid image
          }
      }

      // 1. Create a container for the item
      const itemContainer = document.createElement("div");

      // 2. Use template literals to embed the item details in HTML
      itemContainer.innerHTML = `
          <h2>${item.title}</h2>
          <p>${item.name}</p>
          ${imgurl ? `<div class="imgContainer"><img src="${imgurl}" alt="${item.title}"></div>` : ""}
      `;

      // 3. Append the item container to the objects container
      objectsContainer.appendChild(itemContainer);
  });
}

// Call function to get user location and fetch API data
getLocationAndFetchData();