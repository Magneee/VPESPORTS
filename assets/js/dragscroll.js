document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.scroll-drag').forEach(container => {
    let isDown = false;
    let startX, scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('select-none');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('select-none');
    });
    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('select-none');
    });
    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // чувствительность
      container.scrollLeft = scrollLeft - walk;
    });
  });
}); 