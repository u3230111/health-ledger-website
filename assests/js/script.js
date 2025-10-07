async function getData() {
  const url = "https://api.collection.nfsa.gov.au/search?query=dog";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    let item = data.results[0];

     // 1. create a container
    const itemContainer = document.createElement('div');

    // 2. use template literals to easily embed the data in the string
    itemContainer.innerHTML = `<h2>${item.title}</h2><p>${item.name}</p>`;

    // 3. append to the page
    objectsContainer.appendChild(itemContainer);


  } catch (error) {
    console.error(error.message);
  }
}
getData();