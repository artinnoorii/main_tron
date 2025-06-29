// Basic interactivity for buttons
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', () => alert('این دکمه هنوز فعال نشده!'));
});