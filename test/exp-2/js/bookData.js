// Book data
const books = [
  {
    id: 1,
    title: "Data Structures and Algorithms",
    author: "Thomas H. Cormen",
    price: 799,
    category: "CSE",
    image: "https://cdn.kobo.com/book-images/2b3da037-8aef-44b8-a11d-89ce0b61d71b/1200/1200/False/algorithms-unlocked-1.jpg",
    rating: 4.8,
    description: "A comprehensive guide to data structures and algorithm analysis in C++."
  },
  {
    id: 2,
    title: "Database Management Systems",
    author: "Raghu Ramakrishnan",
    price: 699,
    category: "CSE",
    image: "https://via.placeholder.com/300x400?text=DBMS",
    rating: 4.5,
    description: "Fundamentals of database design, management, and implementation."
  },
  {
    id: 3,
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    price: 899,
    category: "CSE",
    image: "https://via.placeholder.com/300x400?text=Networks",
    rating: 4.6,
    description: "A top-down approach to understanding computer networking principles."
  },
  {
    id: 4,
    title: "Digital Signal Processing",
    author: "John G. Proakis",
    price: 1299,
    category: "ECE",
    image: "https://via.placeholder.com/300x400?text=DSP",
    rating: 4.3,
    description: "Theory and applications of digital signal processing techniques."
  },
  {
    id: 5,
    title: "VLSI Design",
    author: "Wayne Wolf",
    price: 1499,
    category: "ECE",
    image: "https://via.placeholder.com/300x400?text=VLSI",
    rating: 4.4,
    description: "Principles of VLSI design with applications in modern electronics."
  },
  {
    id: 6,
    title: "Electric Circuits",
    author: "James W. Nilsson",
    price: 599,
    category: "EEE",
    image: "https://via.placeholder.com/300x400?text=Circuits",
    rating: 4.7,
    description: "Fundamental concepts of circuit theory and analysis."
  },
  {
    id: 7,
    title: "Power Systems",
    author: "J.B. Gupta",
    price: 899,
    category: "EEE",
    image: "https://via.placeholder.com/300x400?text=Power",
    rating: 4.2,
    description: "Comprehensive guide to power system engineering principles."
  },
  {
    id: 8,
    title: "Structural Analysis",
    author: "R.C. Hibbeler",
    price: 1099,
    category: "CIVIL",
    image: "https://via.placeholder.com/300x400?text=Structures",
    rating: 4.5,
    description: "Analysis techniques for civil engineering structures."
  },
  {
    id: 9,
    title: "Concrete Technology",
    author: "M.S. Shetty",
    price: 899,
    category: "CIVIL",
    image: "https://www.schandpublishing.com/Handler/ImageHandler.ashx?width=314&height=404&imgpath=~/Upload/BookImage/9789352533800.jpg",
    rating: 4.6,
    description: "Properties, testing, and applications of concrete materials."
  }
];

// Current filter settings
let currentCategory = null;
let currentMaxPrice = 2000;
let currentSortBy = "title";

// Load books by category
function loadCategory(category) {
  currentCategory = category === 'All' ? null : category;
  displayBooks();
}

// Filter and sort books based on current settings
function getFilteredBooks() {
  let filteredBooks = books;
  
  // Filter by category if selected
  if (currentCategory) {
    filteredBooks = filteredBooks.filter(book => book.category === currentCategory);
  }
  
  // Filter by price
  filteredBooks = filteredBooks.filter(book => book.price <= currentMaxPrice);
  
  // Sort books
  filteredBooks.sort((a, b) => {
    switch (currentSortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });
  
  return filteredBooks;
}

// Format price with Indian Rupee symbol
function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

// Display books in the catalogue
function displayBooks() {
  const booksGrid = document.getElementById('books-grid');
  const filteredBooks = getFilteredBooks();
  const categoryTitle = document.getElementById('category-title');
  const resultsCount = document.getElementById('results-count');
  
  // Update the category title and result count
  if (currentCategory) {
    categoryTitle.textContent = `${currentCategory} Books`;
  } else {
    categoryTitle.textContent = 'All Books';
  }
  
  resultsCount.textContent = `Showing ${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''}`;
  
  // Clear existing books
  booksGrid.innerHTML = '';
  
  if (filteredBooks.length === 0) {
    booksGrid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">No books found matching your criteria</p>
        <button onclick="resetFilters()" class="mt-4 text-blue-600 hover:text-blue-800">
          Reset Filters
        </button>
      </div>`;
    return;
  }
  
  // Create book cards
  filteredBooks.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform transition duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100';
    
    // Generate star rating HTML
    const ratingStars = generateStarRating(book.rating);
    
    bookCard.innerHTML = `
      <div class="relative">
        <img src="${book.image}" alt="${book.title}" class="w-full h-48 object-contain bg-gray-50 p-4">
        <div class="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
          ${book.category}
        </div>
      </div>
      <div class="p-4 flex-grow">
        <h3 class="font-bold text-lg mb-1 line-clamp-2 text-gray-800 hover:text-blue-600">${book.title}</h3>
        <p class="text-gray-700 text-sm mb-2">by ${book.author}</p>
        <div class="flex items-center mb-2">
          ${ratingStars}
        </div>
        <p class="text-xs text-gray-600 mb-3 line-clamp-2">${book.description}</p>
        <p class="text-blue-700 font-bold text-xl">${formatPrice(book.price)}</p>
      </div>
      <div class="p-4 pt-0">
        <button onclick="addToCart(${book.id})" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center">
          <i class="fas fa-shopping-cart mr-2"></i>
          Add to Cart
        </button>
      </div>
    `;
    booksGrid.appendChild(bookCard);
  });
}

// Generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  let stars = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star text-yellow-400"></i>';
  }
  
  // Half star if needed
  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star text-yellow-400"></i>';
  }
  
  // Add the numeric rating
  stars += `<span class="ml-1 text-xs text-gray-500">(${rating})</span>`;
  
  return stars;
}

// Reset all filters
function resetFilters() {
  currentCategory = null;
  currentMaxPrice = 2000;
  currentSortBy = "title";
  
  // Reset UI elements
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const sortBy = document.getElementById('sortBy');
  
  if (priceRange) priceRange.value = 2000;
  if (priceValue) priceValue.textContent = '₹2000';
  if (sortBy) sortBy.value = 'title';
  
  // Update display
  displayBooks();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Update price slider value display
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  
  if (priceRange && priceValue) {
    priceRange.addEventListener('input', function() {
      priceValue.textContent = `₹${this.value}`;
      currentMaxPrice = parseInt(this.value);
    });
    
    // Apply filters when button is clicked
    const applyFiltersButton = document.getElementById('applyFilters');
    if (applyFiltersButton) {
      applyFiltersButton.addEventListener('click', function() {
        currentMaxPrice = parseInt(priceRange.value);
        currentSortBy = document.getElementById('sortBy').value;
        displayBooks();
      });
    }
    
    // Load all books initially
    loadCategory('All');
  }
});
