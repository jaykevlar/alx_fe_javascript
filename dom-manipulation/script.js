// Array of quote objects
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "You learn more from failure than from success.", category: "Life" }
];

// Select DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Event listener for "Show New Quote" button
newQuoteBtn.addEventListener('click', showRandomQuote);

// Function to add a new quote dynamically
function addQuote(event) {
  event.preventDefault(); // Prevent form submission

  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Event listener for the form submission
addQuoteForm.addEventListener('submit', addQuote);
