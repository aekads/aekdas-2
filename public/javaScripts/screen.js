
  function addNewScreen() {
    document.getElementById("overlay").style.display = "flex";
  }

  function hideNewScreen() {
    document.getElementById("overlay").style.display = "none";
  }

  function markAsDeleted(screenid) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleScreenDeletion(screenid);
      }
    });
  }

  const handleScreenDeletion = async (screenid) => {
    try {
      const response = await fetch("/Dashboard/Screens/mark-as-deleted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ screenid }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      Swal.fire(
        'Deleted!',
        'Your screen has been deleted.',
        'success'
      ).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error deleting screen:", error);
      Swal.fire(
        'You do not have permission',
        'Failed to delete screen',
        'error'
      );
    }
  };


  function editScreen(screenid) {
    fetch(`/Dashboard/Screens/${screenid}`)
      .then((response) => response.json())
      .then((screen) => {
        document.getElementById("editScreenid").value = screen.screenid;
        document.getElementById("editPairingCode").value = screen.pairingcode;
        document.getElementById("editScreenName").value = screen.screenname;
        document.getElementById("editTags").value = screen.tags;
        document.getElementById("editLocation").value = screen.location;
        document.getElementById("editCity").value = screen.city;
        document.getElementById("editState").value = screen.state;
        document.getElementById("editCountry").value = screen.country;
        document.getElementById("editPincode").value = screen.pincode;
        document.getElementById("editOverlay").style.display = "flex";
      })
      .catch((error) => console.error("Error fetching screen:", error));
  }

  function hideEditScreen() {
    document.getElementById("editOverlay").style.display = "none";
  }

  function showAllScreen() {
    document.querySelector(".allScreen").classList.add("active");
    document.querySelector(".allScreen").classList.remove("inactive");

    document.querySelector(".screenGroups").classList.add("inactive");
    document.querySelector(".screenGroups").classList.remove("active");

    document.querySelector(".deletedScreen").classList.add("inactive");
    document.querySelector(".deletedScreen").classList.remove("active");

    document.getElementById("show-Screen").style.display = "block";
    document.getElementById("show-Group-Screen").style.display = "none";
    document.getElementById("show-Deleted-Screen").style.display = "none";
  }

  function showDeletedScreens() {
    document.querySelector(".allScreen").classList.add("inactive");
    document.querySelector(".allScreen").classList.remove("active");

    document.querySelector(".screenGroups").classList.add("inactive");
    document.querySelector(".screenGroups").classList.remove("active");

    document.querySelector(".deletedScreen").classList.add("active");
    document.querySelector(".deletedScreen").classList.remove("inactive");

    document.getElementById("show-Screen").style.display = "none";
    document.getElementById("show-Group-Screen").style.display = "none";
    document.getElementById("show-Deleted-Screen").style.display = "block";
  }

  function addNewGroup() {
    window.location.href = "/Dashboard/Screens/Groups";
  }

  function showGroupScreen() {
    document.querySelector(".allScreen").classList.add("inactive");
    document.querySelector(".allScreen").classList.remove("active");

    document.querySelector(".screenGroups").classList.add("active");
    document.querySelector(".screenGroups").classList.remove("inactive");

    document.querySelector(".deletedScreen").classList.add("inactive");
    document.querySelector(".deletedScreen").classList.remove("active");

    document.getElementById("show-Group-Screen").style.display = "block";
    document.getElementById("show-Screen").style.display = "none";
    document.getElementById("show-Deleted-Screen").style.display = "none";
  }

  async function restoreScreen(screenid) {
    try {
      const response = await fetch("/Dashboard/Screens/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ screenid }),
      });

      const data = await response.json();
      if (data.success) {
        Swal.fire(
          'Restored!',
          'Your screen has been restored.',
          'success'
        ).then(() => {
          window.location.href = '/Dashboard/Screens';
        });
      } else {
        Swal.fire(
          'Restored!',
          'Your screen has been restored.',
          'success'
        ).then(() => {
          window.location.href = '/Dashboard/Screens';
        });
      }
    } catch (error) {
      console.error("Error restoring screen:", error);
      Swal.fire(
        'Complete',
        'Complete',
        'Complete'
      );
    }
  }

  async function deleteGroup(groupName) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/Dashboard/Screens/Groups/${groupName}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            Swal.fire(
              'Deleted!',
              'Your group has been deleted.',
              'success'
            ).then(() => {
              location.reload();
            });
          } else {
            Swal.fire(
              'Error',
              'Failed to delete group',
              'error'
            );
          }
        } catch (err) {
          console.error(err);
          Swal.fire(
            'Error',
            'Error deleting group',
            'error'
          );
        }
      }
    });
  }

  function editGroup(groupName) {
    window.location.href = `/Dashboard/Screens/Groups/${groupName}`;
  }

  function filterScreens() {
    var input = document.getElementById('searchInput');
    var filter = input.value.toUpperCase();
    var rows = document.querySelectorAll("#show-Screen table tbody tr");
    var visibleRowCount = 0;
  
    rows.forEach(function(row) {
      var screenid = row.querySelector('td[id^="screen.screenid"]').textContent.toUpperCase();
      var screenName = row.querySelector('td[id^="screen.screenname"]').textContent.toUpperCase();
      var screenType = row.querySelector('td[id^="screen.ifsecondscreenispresentondevice"]').textContent.toUpperCase();
      var playlistName = row.querySelector('td[id^="screen.playlistname"] p').textContent.toUpperCase();
      var filled_slots = row.querySelector('td[id^="screen.filled_slots"]').textContent.toUpperCase();
      var status = row.querySelector('td[id^="screen.deleted"] p').textContent.toUpperCase();
      var resolution = row.querySelector('td[id^="screen.resolution"]').textContent.toUpperCase();
      // var tags = row.querySelector('td[id^="screen.tags"]').textContent.toUpperCase();
      var location = row.querySelector('td[id^="screen.location"]').textContent.toUpperCase();
      // var city = row.querySelector('td[id^="screen.city"]').textContent.toUpperCase();
      var pincode = row.querySelector('td[id^="screen.pincode"]').textContent.toUpperCase();
  
      if (screenid.indexOf(filter) > -1 ||
          screenName.indexOf(filter) > -1 ||
          screenType.indexOf(filter) > -1 ||
          filled_slots.indexOf(filter) > -1 ||
          resolution.indexOf(filter) > -1 ||
          playlistName.indexOf(filter) > -1 ||
          status.indexOf(filter) > -1 ||
          // tags.indexOf(filter) > -1 ||
          location.indexOf(filter) > -1 ||
          // city.indexOf(filter) > -1 ||
          pincode.indexOf(filter) > -1) {
        row.style.display = "";
        visibleRowCount++;
      } else {
        row.style.display = "none";
      }
    });
  
    var noResultsMessage = document.getElementById('noResultsMessage');
    if (visibleRowCount === 0) {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }
  }
  
  document.getElementById('searchInput').addEventListener('input', filterScreens);
  

  function deletePlaylist(screenid) {
    // Show confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion, proceed with fetch request
        fetch(`/Dashboard/Screens/${screenid}/deletePlaylist`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            playlistname: null
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete playlist');
          }
          Swal.fire(
            'Deleted!',
            'Playlist deleted successfully.',
            'success'
          ).then(() => {
            window.location.reload();
          });
        })
        .catch(error => {
          console.error('Error deleting playlist:', error);
          Swal.fire(
            'Deleted!',
            'Playlist deleted successfully.',
            'success'
          ).then(() => {
            window.location.reload();
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User canceled deletion, do nothing or show a cancellation message
        Swal.fire(
          'Cancelled',
          'Your playlist is safe :)',
          'info'
        );
      }
    });
  }
  
  function permanentDeleteScreen(screenid) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/Dashboard/Screens/delete-screen/${screenid}`, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            Swal.fire(
              'Deleted!',
              'Screen deleted successfully.',
              'success'
            ).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire(
              'Deleted!',
              'Screen deleted successfully.',
              'success'
            ).then(() => {
              window.location.reload();
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire(
            'Error',
            'An error occurred while deleting the screen',
            'error'
          );
        });
      }
    });
  }


  fetch('/session-data')
  .then(response => response.json())
  .then(data => {
    console.log(data.user); // Access session.user data here
  })
  .catch(error => console.error('Error fetching session data:', error));
