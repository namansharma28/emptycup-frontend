const shortlistedListingIds = new Set();
const API_BASE_URL = 'https://emptycup-gwwi.onrender.com'; // Replace with your actual Render backend URL

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_BASE_URL}/api/listings`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("listings");
      
      // Function to render listings based on filter
      const renderListings = (filter = 'all') => {
        container.innerHTML = '';
        const listingsToRender = filter === 'shortlisted' 
          ? data.filter(listing => shortlistedListingIds.has(listing.id))
          : data;

        listingsToRender.forEach(listing => {
          const isShortlisted = shortlistedListingIds.has(listing.id);
          const shortlistIconSrc = isShortlisted ? 'assets/shortlisted.png' : 'assets/shortlist.png';

          container.innerHTML += `
            <div class="bg-white p-4 flex" data-id="${listing.id}">
              <div class="flex-grow">
                <h2 class="font-bold text-lg text-black">${listing.title}</h2>
                <p class="text-black-500 text-xl">${"★".repeat(listing.rating)}${"☆".repeat(5 - listing.rating)}</p>
                <p class="mt-2 text-sm text-black">Passionate team of 4 designers working out <br> of Bangalore with an experience of 4 years.</p>
                <div class="flex space-x-5 my-8 font-bold text-center ">
                  <div><div class="font-bold text-black text-lg">${listing.projects}</div><div class="text-xs font-bold text-black">Projects</div></div>
                  <div><div class="font-bold text-black text-lg">${listing.years}</div><div class="text-xs font-bold text-black">Years</div></div>
                  <div><div class="font-bold text-black text-lg">${listing.price}</div><div class="text-xs font-bold text-black">Price</div></div>
                </div>
                <p class="mt-2 text-lg text-black mo-no">${listing.phone1}</p>
                <p class="text-lg text-black mo-no">${listing.phone2}</p>
              </div>
              <div class="flex flex-col justify-between items-end text-xs text-black ml-4 ">

              <button class="flex flex-col items-center text-red-800 space-y-2"><img src="assets/arrow-right-short 1.png" alt="Details" class="w-5 h-5">Details</button>
              <button class="flex flex-col items-center text-red-800 hide-button"><img src="assets/eye-slash 1.png" alt="Hide" class="w-5 h-5">Hide</button>
              <button class="flex flex-col items-center text-red-800 space-y-2 shortlist-button"><img src="${shortlistIconSrc}" alt="Shortlist" class="w-5 h-5">Shortlist</button>
              <button class="flex flex-col items-center text-red-800 report-button"><img src="assets/exclamation-circle 1.png" alt="Report" class="w-5 h-5">Report</button>
              </div>
            </div>
                  <hr class="border-gray-200">
          `;
        });
      };

      // Initial render
      renderListings();

      // Event delegation for shortlist button
      container.addEventListener('click', (event) => {
        const shortlistButton = event.target.closest('.shortlist-button');
        if (shortlistButton) {
          const listingElement = shortlistButton.closest('[data-id]');
          const listingId = listingElement.dataset.id;

          if (shortlistedListingIds.has(listingId)) {
            shortlistedListingIds.delete(listingId);
            shortlistButton.querySelector('img').src = 'assets/shortlist.png';
          } else {
            shortlistedListingIds.add(listingId);
            shortlistButton.querySelector('img').src = 'assets/shortlisted.png';
          }
          // Re-render if the shortlisted filter is active
          if (document.querySelector('.tab.active').textContent.trim() === 'Shortlisted') {
             renderListings('shortlisted');
          }
        }
      });

      // Event listeners for tabs
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active', 'text-yellow-700', 'border-b-2', 'border-yellow-700'));
          tab.classList.add('active', 'text-yellow-700', 'border-b-2', 'border-yellow-700');

          const filter = tab.textContent.trim();
          if (filter === 'Shortlisted') {
            renderListings('shortlisted');
          } else {
            renderListings('all'); // Assuming other tabs show all or will have their own filters
          }
        });
      });

    });
});
