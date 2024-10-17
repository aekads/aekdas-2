document.addEventListener("DOMContentLoaded", function () {

  const playlistName = sessionStorage.getItem("playlistName");
  const playlistDescription = sessionStorage.getItem("playlistDescription");
  let selectedItems = []; // Array to store selected item URLs
  
  window.playlistName = playlistName;
  window.playlistDescription = playlistDescription;
  
  function selectScreen(){
      if(selectedItems.length===0){
          Swal.fire({
              title: 'Select Layout First',
              text: 'Please select a layout before proceeding.',
              icon: 'info',
              confirmButtonText: 'OK'
          });
          return;
      }

      window.location.href = "/Dashboard/Playlist/newPlaylist/selectScreens";
  }
  window.selectScreen=selectScreen;
  
  const buttons = document.querySelectorAll(".media-category button");
  buttons.forEach((button) => {
    const link = button.querySelector("a");
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
      setActiveButton(button);
      window.location.href = link.getAttribute("href"); // Navigate to the link
    });
  });

  function setActiveButton(activeButton) {
    buttons.forEach((button) => {
      if (button === activeButton) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  // Initial check for the active button based on the current URL
  const currentUrl = window.location.pathname;
  let activeButtonFound = false;
  buttons.forEach((button) => {
    const link = button.querySelector("a");
    if (link.getAttribute("href") === currentUrl) {
      button.classList.add("active");
      activeButtonFound = true;
    }
  });

  // If no button matches the current URL, default to the "All" button
  if (!activeButtonFound) {
    const allButton = document.querySelector(".media-category .media-all");
    allButton.classList.add("active");
  }
  document
    .getElementById("uploadButton")
    .addEventListener("click", function () {
      document.getElementById("fileInput").click();
    });

  document.getElementById("fileInput").addEventListener("change", function () {
    document.getElementById("uploadForm").submit();
  });

  const mediaItems = document.querySelectorAll(".media-item");
  const imgSlider = document.getElementById("imgSlider");
  const imgPreview = document.querySelector(".img-preview");
  let itemsCount = 0; // Counter to track the number of items
  
  mediaItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (itemsCount < 10) {
        // Check if the number of items is less than 10
        if (item.tagName.toLowerCase() === "img") {
          const img = document.createElement("img");
          img.src = item.src;
          img.classList.add("slider-item");
          img.setAttribute(
            "data-layout-name",
            item.getAttribute("data-layout-name")
          );
          img.setAttribute("data-duration", item.getAttribute("data-duration"));
          img.setAttribute("data-size", item.getAttribute("data-size"));
          imgSlider.appendChild(img);
          selectedItems.push(item.src);
          itemsCount++;
        } else if (item.tagName.toLowerCase() === "video") {
          const video = document.createElement("video");
          video.controls = true;
          video.classList.add("slider-item");
          const source = document.createElement("source");
          source.src = item.querySelector("source").src;
          source.type = item.querySelector("source").type;
          source.setAttribute(
            "data-layout-name",
            item.querySelector("source").getAttribute("data-layout-name")
          );
          source.setAttribute(
            "data-duration",
            item.querySelector("source").getAttribute("data-duration")
          );
          source.setAttribute(
            "data-size",
            item.querySelector("source").getAttribute("data-size")
          );

          video.appendChild(source);
          imgSlider.appendChild(video);
          selectedItems.push(source.src);
          itemsCount++;
        }
      } else {
        Swal.fire({
          title: 'Limit Reached',
          text: 'You can only select up to 10 items.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
      const selectedurls = JSON.stringify(selectedItems);
      sessionStorage.setItem("selectedItems", selectedurls);
    });
  });

  const layoutNameInput = document.getElementById("layout-name");
  const durationInput = document.getElementById("duration");
  const sizeInput = document.getElementById("size");
  let selectedElement = null;
  imgSlider.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("slider-item")) {
      imgPreview.innerHTML = ""; // Clear previous content
      if (selectedElement) {
        selectedElement.style.border = ""; // Reset to original
      }
      target.style.borderColor = "#0D6EFD";
      selectedElement = target; //
      let layoutName, duration, size;
      if (target.tagName.toLowerCase() === "img") {
        const img = document.createElement("img");
        img.src = target.src;
        img.classList.add("preview-item");
        layoutName = target.getAttribute("data-layout-name");
        duration = target.getAttribute("data-duration");
        size = target.getAttribute("data-size");
        imgPreview.appendChild(img);
      } else if (target.tagName.toLowerCase() === "video") {
        const video = document.createElement("video");
        video.controls = true;
        video.classList.add("preview-item");
        const source = document.createElement("source");
        source.src = target.querySelector("source").src;
        source.type = target.querySelector("source").type;
        video.appendChild(source);
        imgPreview.appendChild(video);
        const sourceElement = target.querySelector("source");
        layoutName = sourceElement.getAttribute("data-layout-name");
        duration = sourceElement.getAttribute("data-duration");
        size = sourceElement.getAttribute("data-size");
      }
      layoutNameInput.value = layoutName;
      durationInput.value = duration;
      sizeInput.value = size;
    }
  });

  let currentVideoIndex = 0; // Track current video index
  let isPlaying = false; // Track if a video is currently playing
  
  // Function to create video elements with autoplay
  function createVideoElement(url) {
      const video = document.createElement('video');
      video.src = url;
      video.controls = false;
      video.autoplay = false; // Autoplay set to false initially
      video.style.display = 'none'; // Hide video initially
      return video;
  }
  
  // Function to play the next video in sequence
  function playNextVideo() {
      if (currentVideoIndex < selectedItems.length) {
          const videoElement = createVideoElement(selectedItems[currentVideoIndex]);
          const videoContainer = document.getElementById('videoContainer');
  
          // Append new video element without clearing the previous video
          videoContainer.appendChild(videoElement);
  
          // Listen for when the video can play through
          videoElement.addEventListener('canplaythrough', () => {
              // Show and play the video once it is ready
              videoElement.style.display = 'block';
              videoElement.play().then(() => {
                  // Hide the previous video, if any
                  const previousVideos = videoContainer.querySelectorAll('video:not([style*="display: none"])');
                  previousVideos.forEach((prevVideo) => {
                      if (prevVideo !== videoElement) {
                          prevVideo.style.display = 'none';
                          prevVideo.pause();
                          prevVideo.remove();
                      }
                  });
  
                  // Add event listener to handle end of video playback
                  videoElement.addEventListener('ended', () => {
                      currentVideoIndex++;
                      if (currentVideoIndex < selectedItems.length) {
                          playNextVideo(); // Play the next video after this one ends
                      } else {
                          isPlaying = false; // All videos played, reset isPlaying flag
                      }
                  });
              }).catch((error) => {
                  console.error('Error playing video:', error);
                  isPlaying = false; // Reset isPlaying flag on error
              });
          });
      }
  }
  
  // Function to display videos in the modal overlay
  function displayVideos() {
      if(selectedItems.length==0){
          Swal.fire({
              title: 'Select Layout First',
              text: 'Please select a layout before previewing.',
              icon: 'info',
              confirmButtonText: 'OK'
          });
          return;
      }
      // Show the modal overlay
      const videoOverlay = document.getElementById('videoOverlay');
      videoOverlay.style.display = 'flex';
  
      // Start playing videos if not already playing
      if (!isPlaying) {
          isPlaying = true;
          playNextVideo();
      }
  }
  
  // Event listener for preview button click
  document.getElementById('previewButton').addEventListener('click', displayVideos);
  
  // Event listener for closing modal overlay
  document.getElementById('closeButton').addEventListener('click', function() {
      const videoOverlay = document.getElementById('videoOverlay');
      const videoContainer = document.getElementById('videoContainer');
  
      // Pause current video (if any)
      const currentVideo = videoContainer.querySelector('video');
      if (currentVideo) {
          currentVideo.pause();
      }
  
      // Hide the modal overlay
      videoOverlay.style.display = 'none';
  
      // Reset current video index and isPlaying flag
      currentVideoIndex = 0;
      isPlaying = false;
  });

});




function exitfunction() {
  Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to exit and discard changes?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, exit!'
  }).then((result) => {
      if (result.isConfirmed) {
          window.history.back();
      }
  })
}