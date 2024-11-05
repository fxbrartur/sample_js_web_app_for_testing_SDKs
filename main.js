// Menu Section
function menuHandler() {
  const navWrapper = document.querySelector("header nav .wrapper");
  const openNavMenuButton = document.querySelector("#open-nav-menu");
  const closeNavMenuButton = document.querySelector("#close-nav-menu");
  const navLinks = document.querySelectorAll("header nav .wrapper ul li a");

  openNavMenuButton.addEventListener("click", () => {
    navWrapper.classList.add("nav-open");
  });

  closeNavMenuButton.addEventListener("click", () => {
    navWrapper.classList.remove("nav-open");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navWrapper.classList.remove("nav-open");
    });
  });
}

// Greeting Section
function greetingHandler() {
  let greetingText;
  
  let currentHour = new Date().getHours();
  if (currentHour < 12) {
    greetingText = "Good morning!";
  } else if (currentHour < 18) {
    greetingText = "Good afternoon!";
  } else {
    greetingText = "Good evening!";
  }
  
  document.querySelector("#greeting").innerHTML = greetingText;
}

// Clock Section
function clockHandler() {
  setInterval(() => {
    let currentTime = new Date();
    document.querySelector("span[data-time=hours]").textContent = currentTime.getHours().toString().padStart(2, "0");
    document.querySelector("span[data-time=minutes]").textContent = currentTime.getMinutes().toString().padStart(2, "0");
    document.querySelector("span[data-time=seconds]").textContent = currentTime.getSeconds().toString().padStart(2, "0");
  }, 1000);
}

// Gallery Section
function galleryHandler() {
  fetch('./assets/json/gallery.json')
    .then(response => response.json())
    .then(galleryImages => {
      const thumbnailsContainer = document.querySelector('#thumbnails');
      thumbnailsContainer.innerHTML = ''; // Clear existing thumbnails

      galleryImages.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = img.src;
        thumb.alt = `Thumbnail ${img.alt}`;
        thumb.dataset.arrayIndex = index;
        thumb.dataset.selected = index === 0 ? 'true' : 'false';

        thumb.addEventListener('click', () => {
          document.querySelector("#gallery img").src = img.src;
          document.querySelector("#gallery img").alt = img.alt;

          document.querySelectorAll("#thumbnails img").forEach((thumb, i) => {
            if (i === index) {
              thumb.dataset.selected = "true";
            } else {
              thumb.dataset.selected = "false";
            }
          });
        });

        thumbnailsContainer.appendChild(thumb);
      });

      // Set the main image to the first image in the gallery
      if (galleryImages.length > 0) {
        document.querySelector("#gallery img").src = galleryImages[0].src;
        document.querySelector("#gallery img").alt = galleryImages[0].alt;
      }
    })
    .catch(error => console.error('Error loading gallery images:', error));
}

// Product Section
function productHandler() {
  fetch('./assets/json/products.json')
    .then(response => response.json())
    .then(products => {
      const productsArea = document.querySelector('.products-area');
      productsArea.innerHTML = ''; // Clear existing products

      let allCount = 0;
      let paidCount = 0;
      let freeCount = 0;

      products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        const productPrice = product.price === 0 ? 'Free' : `$ ${product.price.toFixed(2)}`;
        productItem.dataset.price = productPrice;

        productItem.innerHTML = `
          <img src="${product.image}" alt="${product.alt}">
          <div class="product-details">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-author">${product.author}</p>
            <p class="price-title">Price</p>
            <p class="product-price">${productPrice}</p>
          </div>
        `;

        productsArea.appendChild(productItem);

        // Update counts
        allCount++;
        if (product.price === 0) {
          freeCount++;
        } else {
          paidCount++;
        }
      });

      // Update filter counts
      document.querySelector('label[for="all"] .product-amount').textContent = allCount;
      document.querySelector('label[for="paid"] .product-amount').textContent = paidCount;
      document.querySelector('label[for="free"] .product-amount').textContent = freeCount;

      // Add event listeners for filters
      document.querySelectorAll('.products-filter input').forEach(filter => {
        filter.addEventListener('change', () => {
          filterProducts();
        });
      });

      function filterProducts() {
        const selectedFilter = document.querySelector('.products-filter input:checked').id;
        const productsArea = document.querySelector('.products-area');

        productsArea.childNodes.forEach(productItem => {
          const productPrice = productItem.dataset.price;

          if (selectedFilter === 'all') {
            productItem.style.display = 'block';
          } else if (selectedFilter === 'paid' && productPrice !== 'Free') {
            productItem.style.display = 'block';
          } else if (selectedFilter === 'free' && productPrice === 'Free') {
            productItem.style.display = 'block';
          } else {
            productItem.style.display = 'none';
          }
        });
      }
    })
    .catch(error => console.error('Error loading products:', error));
}

// Footer Section
function footerHandler() {
  currentYear = new Date().getFullYear();
  const footerElement = document.querySelector("footer");
  footerElement.innerHTML = `© ${currentYear} All rights reserved to <a href="https://www.github.com/fxbrartur" target="_blank">@fxbrartur</a>`;
};

// Weather Service
function weatherHandler() {
  const api_key = 'PLACEHOLDER_API_KEY';

  navigator.geolocation.getCurrentPosition(function(position) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api_key}&units=metric`)
      .then(response => response.json())
      .then(data => {
        const condition = data.weather[0].description;
        const temperature = data.main.temp;
        const location = data.name;

        function celsiusToFahrenheit(celsius) {
          let fahr = (celsius * 9 / 5) + 32;
          return fahr;
        }

        let celsiusText = `The weather in ${location} is currently ${condition} with a temperature of ${temperature.toFixed(0)} °C degrees.`;
        let fahrText = `The weather in ${location} is currently ${condition} with a temperature of ${celsiusToFahrenheit(temperature).toFixed(0)} °F degrees.`;
        
        document.querySelector("p#weather").innerHTML = celsiusText;
        document.querySelector(".weather-group").addEventListener("click", function(e) {
        
          if (e.target.id == "celsius") {
            document.querySelector("p#weather").innerHTML = celsiusText;
          } else if (e.target.id == "fahr") {
            document.querySelector("p#weather").innerHTML = fahrText;
          }
        
        });
      })
      .catch(error => console.error('Error fetching weather data:', error));
  });
}

// Page Load
menuHandler();
greetingHandler()
clockHandler();
galleryHandler();
productHandler();
footerHandler();
weatherHandler();
