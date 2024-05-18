function changeNav(e) {
    if (document.querySelector('.nav-link .active') !== null) {
      document.querySelector('.nav-link .active').classList.remove('active');
    }
    e.target.className = "nav-link active";
  }