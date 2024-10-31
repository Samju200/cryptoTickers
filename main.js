const apiUrl = "https://api.coinlore.net/api/tickers/";
let coinsData = [];
let currentPage = 1;
const itemsPerPage = 10;

// Fetch data from the API
async function fetchCoins() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        coinsData = data.data;
        renderTable();
        renderPagination();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Render the table with the current page data
function renderTable() {
    const tableBody = document
        .getElementById("crypto-table")
        .querySelector("tbody");
    tableBody.innerHTML = "";

    // Get the headers for responsive labels
    const headers = Array.from(document.querySelectorAll("thead th")).map(
        (th) => th.textContent
    );

    // Calculate start and end index for items on the current page
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = coinsData.slice(start, end);

    // Populate the table rows
    pageData.forEach((coin) => {
        const row = document.createElement("tr");

        // Map each coin property to a td element with responsive label
        const rowData = [
            coin.rank,
            coin.symbol,
            coin.name,
            `$${parseFloat(coin.price_usd).toFixed(2)}`,
            `$${parseFloat(coin.market_cap_usd).toLocaleString()}`,
            `${coin.percent_change_24h}%`,
        ];

        rowData.forEach((data, index) => {
            const cell = document.createElement("td");
            cell.setAttribute("data-label", headers[index]); // Add responsive label
            cell.textContent = data;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Render pagination buttons with Next and Previous
function renderPagination() {
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(coinsData.length / itemsPerPage);

    // Previous button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            renderPagination();
        }
    });
    paginationDiv.appendChild(prevButton);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("page-btn");
        if (i === currentPage) button.style.fontWeight = "bold";

        button.addEventListener("click", () => {
            currentPage = i;
            renderTable();
            renderPagination();
        });

        paginationDiv.appendChild(button);
    }

    // Next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            renderPagination();
        }
    });
    paginationDiv.appendChild(nextButton);
}

fetchCoins();
