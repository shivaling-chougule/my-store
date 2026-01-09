document.addEventListener('DOMContentLoaded', () => {
  // Loop through each section instance
  document.querySelectorAll('[data-products-block]').forEach((section) => {
    const button = section.querySelector('.view-all-button');
    const productsWrapper = section.querySelector('.products-block__wrapper');

    if (!button || !productsWrapper) return;

    button.addEventListener('click', () => {
      const isExpanded = button.dataset.expanded === 'true';

      // Toggle button state
      button.dataset.expanded = (!isExpanded).toString();
      button.textContent = isExpanded ? 'View All' : 'View Less';

      // Toggle container layout
      productsWrapper.classList.toggle('is-collapsed', isExpanded);
      productsWrapper.classList.toggle('is-expanded', !isExpanded);
    });
  });
});
