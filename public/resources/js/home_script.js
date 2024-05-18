window.onscroll = function () { addBgHeader() };

const header = document.getElementById("header");
const sticky = header.offsetTop;

function addBgHeader() {
  if (window.scrollY > sticky) {
    header.classList.add("background");
  } else {
    header.classList.remove("background");
  }
}


