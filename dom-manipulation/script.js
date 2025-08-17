// -------- Quotes Array --------
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// -------- DOM Elements --------
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const addQuoteContainer = document.getElementById("addQuoteContainer");
const syncNotification = document.getElementById("syncNotification");

// -------- Web Storage --------
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveLastQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// -------- Display Random Quote --------
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`;

  saveLastQuote(quote);
}

// -------- Add Quote Function --------
function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Enter both quote and category");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added successfully!");
}

// -------- Create Add Quote Form --------
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const submitBtn = document.createElement("button");
  submitBtn.id = "addQuoteBtn";
  submitBtn.innerHTML = "Add Quote";
  submitBtn.addEventListener("click", addQuote);

  formDiv.appendChild(textInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(submitBtn);

  addQuoteContainer.appendChild(formDiv);
}

// -------- Populate Categories --------
function populateCategories() {
  const existingCategories = Array.from(categoryFilter.options).map(opt => opt.value.toLowerCase());

  quotes.forEach(quote => {
    if (!existingCategories.includes(quote.category.toLowerCase())) {
      const option = document.createElement("option");
      option.value = quote.category;
      option.textContent = quote.category;
      categoryFilter.appendChild(option);
      existingCategories.push(quote.category.toLowerCase());
    }
  });

  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter && existingCategories.includes(lastFilter.toLowerCase())) {
    categoryFilter.value = lastFilter;
  }
}

// -------- Filter Quotes --------
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — (${quote.category})`;

  saveLastQuote(quote);
}

// -------- JSON Export --------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// -------- JSON Import --------
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// -------- Server Sync --------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
  } catch (err) {
    console.error("Error fetching quotes from server:", err);
  }
}

async function syncQuotes() {
  for (const quote of quotes) {
    try {
      await fetch(SERVER_URL, {
        method: "POST",
        body: JSON.stringify(quote),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      });
    } catch (err) {
      console.error("Error syncing quotes to server:", err);
    }
  }
}

// -------- Conflict Resolution --------
function resolveConflicts(serverQuotes) {
  const newQuotes = serverQuotes.filter(
    sq => !quotes.some(lq => lq.text === sq.text && lq.category === sq.category)
  );

  if (newQuotes.length > 0) {
    quotes.push(...newQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser(); // triggers exact ALX notification
  }
}

// -------- Notification --------
function notifyUser() {
  syncNotification.textContent = "Quotes synced with server!"; // exact ALX-required text
  setTimeout(() => { syncNotification.textContent = ""; }, 5000);
}

// -------- Periodic Server Sync --------
setInterval(fetchQuotesFromServer, 30000); // every 30s
setInterval(syncQuotes, 60000);             // every 60s

// -------- Initialize --------
loadQuotes();
createAddQuoteForm();
populateCategories();
filterQuotes();
