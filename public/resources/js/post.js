/* 
 * Love button for Design it & Code it
 * http://designitcodeit.com/i/9
 */
// $('.btn-counter').on('click', function(event, count) {
//     event.preventDefault();

//     var $this = $(this),
//         count = $this.attr('data-count'),
//         active = $this.hasClass('active'),
//         multiple = $this.hasClass('multiple-count');

//     // First method, allows to add custom function
//     // Use when you want to do an ajax request
//     /* if (multiple) {
//     $this.attr('data-count', ++count);
//     // Your code here
//     } else {
//     $this.attr('data-count', active ? --count : ++count).toggleClass('active');
//     // Your code here
//     } */


//     // Second method, use when ... I dunno when but it looks cool and that's why it is here
//     $.fn.noop = $.noop;
//     $this.attr('data-count', ! active || multiple ? ++count : --count  )[multiple ? 'noop' : 'toggleClass']('active');

// });


document.addEventListener('DOMContentLoaded', function () {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
    document.getElementsByTagName('head')[0].appendChild(script);
    var likeButton = document.getElementById('likeButton');
    var likeCount = document.getElementById('likeCount');
    var count = $("#likeNum").val(); // Initial like count
    $("#likeButton").click(function () {
      
        var baseUrl = (window.location).href; // You can also use document.URL
        var postID = baseUrl.substring(baseUrl.lastIndexOf('=') + 1);
        this.classList.toggle('liked');
        if (this.classList.contains('liked')) {
            $.ajax({
                type: 'GET',
                data: { postID: postID },
                url: '/business/likepost/likepost',
                success: function (data) {
                   
                    
                    // do what ever you want to do with this response data
                },
                error: function (xhr) {
                    // do what ever you want to do when error happens
                }
            });
            count++; // Increment count
        } else {
            $.ajax({
                type: 'GET',
                url: "/business/likepost/dislikepost",
                data: { postID: postID },
                success() {
                }
            })
            count--; // Decrement count
        }
        likeCount.textContent = count; // Update the display
    })
    // likeButton.addEventListener('click', function () {
      
    //     var baseUrl = (window.location).href; // You can also use document.URL
    //     var postID = baseUrl.substring(baseUrl.lastIndexOf('=') + 1);
    //     this.classList.toggle('liked');
    //     if (this.classList.contains('liked')) {
    //         $.ajax({
    //             type: 'GET',
    //             data: { postID: postID },
    //             url: '/likepost',
    //             success: function (data) {
    //                 alert(data)
    //                 console.log(data);
    //                 // do what ever you want to do with this response data
    //             },
    //             error: function (xhr) {
    //                 // do what ever you want to do when error happens
    //             }
    //         });
    //         count++; // Increment count
    //     } else {
    //         $.ajax({
    //             type: 'GET',
    //             url: "/business/dislikepost",
    //             data: { postID: postID },
    //             success() {
    //             }
    //         })
    //         count--; // Decrement count
    //     }
    //     likeCount.textContent = count; // Update the display
    // });
});


// document.addEventListener("DOMContentLoaded", function () {
//   // Add event listener for comment submission
//   var submitButton = document.querySelector("#PostComments button");
//   var commentTextarea = document.querySelector("#PostComments textarea");

//   submitButton.addEventListener("click", function () {
//       var commentText = commentTextarea.value.trim();

//       if (commentText !== "") {
//           // Create a new comment card
//           var newCommentCard = document.createElement("div");
//           newCommentCard.className = "d-flex flex-start mb-4";

//           newCommentCard.innerHTML = `
//               <img class="rounded-circle shadow-1-strong me-3" src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp" alt="avatar" width="65" height="65" />
//               <div class="card w-100">
//                   <div class="card-body p-4">
//                       <h5>Your Name</h5>
//                       <p class="small">Just now</p>
//                       <p class= "cmt">${commentText}</p>
//                       <div class="d-flex justify-content-between align-items-center">
//                           <div class="d-flex align-items-center">
//                               <a href="#!" class="link-muted me-2"><i class="fas fa-thumbs-up me-1"></i>0</a>
//                               <a href="#!" class="link-muted"><i class="fas fa-thumbs-down me-1"></i>0</a>
//                           </div>
//                       </div>
//                   </div>
//               </div>
//           `;

//           // Insert the new comment card before the existing comments
//           var commentsContainer = document.querySelector("#PostComments .comment .row");
//           commentsContainer.insertBefore(newCommentCard, commentsContainer.firstChild);

//           // Clear the textarea
//           commentTextarea.value = "";
//       }
//   });
// });

