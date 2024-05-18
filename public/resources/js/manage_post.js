window.onscroll = function () { addBgHeader() };

const header = document.getElementById('header');
const sticky = header.offsetTop;

function addBgHeader() {
  if (window.scrollY > sticky) {
    header.classList.add("background");
  } else {
    header.classList.remove("background");
  }
}


const pending_btn = document.getElementById('pending-btn');
const pending_post = document.querySelectorAll('.pending');
const approved_post = document.querySelectorAll('.post-list >tbody >tr >td .post-status .approved');
const denied_post = document.querySelectorAll('.denied');

const post_list = document.querySelector('.post-list');
const post_detail =  document.querySelector(".post-detail");
pending_btn.addEventListener("click", openPostDetail);

function openPostDetail() {
  // post_list.style.display = "none";
  // post_detail.style.display = "block"; 
  approved_post.style.display = "none";
  denied_post.style.display = "none";
}
