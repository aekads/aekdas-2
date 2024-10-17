async function publishPlaylist() {
  const playlistName = sessionStorage.getItem("playlistName");
  const playlistDescription = sessionStorage.getItem("playlistDescription");
  const selectedUrls = sessionStorage.getItem("selectedItems");
  const urls = JSON.parse(selectedUrls);

  const selectedScreens = [];
  const checkboxes = document.querySelectorAll(
    'input[name="checkbox"]:checked'
  );
  checkboxes.forEach((checkbox) => {
    selectedScreens.push(checkbox.value);
  });

  if (selectedScreens.length === 0) {
    alert("Please select at least one screen");
    return;
  }

  console.log("playlistName", playlistName);
  console.log("playlistDescription", playlistDescription);
  console.log("selectedUrls", urls);
  console.log("selectedScreens", selectedScreens);

  try {
    const response = await fetch("/Dashboard/Playlist/createPlaylist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        screenIDs: selectedScreens,
        urls: urls,
        playlistName: playlistName,
        playlistDescription: playlistDescription,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create playlist");
    }
    const responseData = await response.json();
    console.log("Playlist created:", responseData.playlist);
    alert("Playlist created successfully!");
    window.location.href='/Dashboard/Playlist'
  } catch (error) {
    console.error("Error creating playlist:", error);
    alert("Failed to create playlist. Please try again.");
  }
}
window.publishPlaylist = publishPlaylist;
