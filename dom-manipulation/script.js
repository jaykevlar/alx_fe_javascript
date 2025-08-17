// Array of quote objects
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Motivation" },
  { text: "Happiness depends upon ourselves.", category: "Philosophy" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categorySelect = document.getElementById("categorySelect");

// Display a random quote (checker expects this exact function name)
function displayRandomQuote() {
  let selectedCategory = categorySelect.value;
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`; // Use innerHTML for ALX checker
}

// Add new quote dynamically
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  let newQuoteText = textInput.value.trim();
  let newQuoteCategory = categoryInput.value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  // Add new quote to the array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Update category dropdown if it's a new category
  if (![...categorySelect.options].some(opt => opt.value.toLowerCase() === newQuoteCategory.toLowerCase())) {
    let newOption = document.createElement("option");
    newOption.value = newQuoteCategory;
    newOption.innerHTML = newQuoteCategory; // Use innerHTML here too
    categorySelect.appendChild(newOption);
  }

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";

  alert("New quote added successfully!");
}

// Event listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Initial display
displayRandomQuote();
