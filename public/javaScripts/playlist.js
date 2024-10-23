function addPlaylistBox() {
  document.getElementById("overlay").style.display = "flex";
}
function hideNewScreen() {
  document.getElementById("overlay").style.display = "none";
}
document.getElementById("createPlaylistButton").addEventListener("click", function (event) {
  console.log(" create button click");
  
  const playlistName = document.getElementById("playlistName").value;
  const playlistDescription = document.getElementById("playlistDescription").value;

  if (!playlistName || !playlistDescription) {
    alert("Please fill in all required fields.");
    event.preventDefault();
    return;
  }

  sessionStorage.setItem("playlistName", playlistName);
  sessionStorage.setItem("playlistDescription", playlistDescription);

  window.location.href = "/Dashboard/Playlist/newPlaylist";
});
