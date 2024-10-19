// Function to go back to the previous screen
function goBack() {
  if (confirm("Are you sure you want to discard changes and go back?")) {
    window.location.href = "/Dashboard/Screens";
  }
}

// Initialize selectedscreens array
let selectedscreens = [];

// Parse the group data from the server
const groupData = JSON.parse(group);

// Check if groupData has selectedscreens
if (groupData.selectedscreens && groupData.selectedscreens.length > 0) {
  selectedscreens = groupData.selectedscreens;
  refreshSelectedScreensTable();
}

// Function to handle screen selection
function selectScreen(checkbox) {
  const row = checkbox.parentNode.parentNode; // Get the row of the checkbox
  const pairingcode = row.cells[1].textContent.trim(); // Get pairingcode from the row
  const screenname = row.cells[2].textContent.trim(); // Get screen name from the row
  const tags = row.cells[3].textContent.trim(); // Get tags from the row
  const location = row.cells[4].textContent.trim(); // Get location from the row
  const isChecked = checkbox.checked; // Check if the checkbox is checked

  if (isChecked) {
    // Add the screen to the selectedscreens array if not already added
    if (!selectedscreens.some(screen => screen.screenname === screenname && screen.pairingcode === pairingcode && screen.tags === tags && screen.location === location)) {
      selectedscreens.push({ screenname, tags, location,pairingcode });
    }
  } else {
    // Remove the screen from the selectedscreens array
    selectedscreens = selectedscreens.filter(screen => !(screen.screenname === screenname && screen.tags === tags && screen.location === location));
  }

  // Refresh the selected screens table
  refreshSelectedScreensTable();
}

// Function to refresh the selected screens table
function refreshSelectedScreensTable() {
  const table = document.getElementById("selectedScreensTable");
  const tbody = table.getElementsByTagName("tbody")[0];

  // Clear existing table rows
  tbody.innerHTML = "";

  // If no screens are selected, show a message
  if (selectedscreens.length === 0) {
    const row = tbody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 4;
    cell.textContent = "No screens selected";
    return;
  }

  // Add rows for each selected screen
  selectedscreens.forEach((screen, index) => {
    const row = tbody.insertRow();
    row.insertCell().textContent = index + 1; // SR.NO
    row.insertCell().textContent = screen.screenname; // SCREEN NAME
    row.insertCell().textContent = screen.tags; // SCREEN TAG
    row.insertCell().textContent = screen.location; // SCREEN LOCATION
  });
}

// Function to save the group
async function saveGroup() {
  const groupName = document.querySelector('input[name="groupName"]').value.trim();
  const description = document.querySelector('input[name="description"]').value.trim();

  if (!groupName || !description || selectedscreens.length === 0) {
    alert("Group Name, Description, and at least one screen are required fields");
    return;
  }

  if (!window.confirm("Are you sure you want to save these details?")) {
    return; // If user cancels, do nothing
  }
  const data = {
    group_name: groupName,
    group_description: description,
    selectedscreens,
    screenCount: selectedscreens.length,
  };

  try {
    const response = await fetch("/Dashboard/Screens/Groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    window.location.href = "/Dashboard/Screens"; // Redirect on success
  } catch (error) {
    alert(error);
    console.error("Error:", error);
    // Handle error
    // Optionally, you can show an error message to the user
  }
}
function filterScreens() {
  // Get input element and filter value
  var input = document.getElementById('searchInput');
  var filter = input.value.toUpperCase();

  // Get table rows
  var rows = document.querySelectorAll(".select-screen table tbody tr");

  // Loop through all table rows, and hide those that don't match the search query
  rows.forEach(function(row) {
    var pairingCode = row.querySelector('td[id^="screen.pairingcode"]').textContent.toUpperCase();
    var screenName = row.querySelector('td[id^="screen.screenname"]').textContent.toUpperCase();
   
    var location = row.querySelector('td[id^="screen.location"]').textContent.toUpperCase();
    var status = row.querySelector('td[id^="screen.status"]').textContent.toUpperCase();
  

    if (pairingCode.indexOf(filter) > -1 ||
        screenName.indexOf(filter) > -1 ||
        status.indexOf(filter) > -1 ||
        location.indexOf(filter) > -1 
        ) {
      row.style.display = "";
    } else {
      row.style.display = "none";

    }
  });
}

// Bind the filterScreens function to the input event
document.getElementById('searchInput').addEventListener('input', filterScreens);