async function getData(url) {
  try {
    // Fetch data from NFSA API
    const response = await fetch(url);

    // Convert response to JSON
    const data = await response.json();

    // Log the data to inspect its structure
    console.log(data);

    // Call function to display results
    displayResults(data.results);
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("objectsContainer").innerHTML = `<p>Error fetching data. Please try again later.</p>`;
  }
}

// Call getData with NFSA API URL
getData("https://api.collection.nfsa.gov.au/search?query=dog");
function displayResults(results) {
  const outputDiv = document.getElementById("objectsContainer");
  let html = `<h2>NFSA Collection</h2>`;

  results.forEach(item => {
    // Append item details to HTML
    html += `
          <div class="item">
              <h3>${item.title}</h3>
              <p>${item.name}</p>
          </div>
      `;
  });

  outputDiv.innerHTML = html;
}