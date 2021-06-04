const menuBtn = document.querySelector('.menu-btn');
const iconBtn = document.querySelector('.menu-btn__icon');
const sideNav = document.querySelector('.sidenav');

let showMenu = false;

menuBtn.addEventListener('click', () => {
  if(!showMenu) {
    menuBtn.classList.add('open');
    iconBtn.classList.add('open');
    sideNav.classList.add('open');

    showMenu = true;
  } else {
    menuBtn.classList.remove('open');
    iconBtn.classList.remove('open');
    sideNav.classList.remove('open');

    showMenu = false;
  }
});