'use strict';
$(() => {
  let amenitiesChoosen = [];
  const selectors = {
    amenitiesHeader: '.amenities > h4',
    amenityContainer: '.amenities > .popover > ul > li > input[type="checkbox"]',
    amenityItem: '.amenities > .popover > ul > li'
  };
  const BASE_URL = 'http://localhost:5001/api/v1';

  const findPlace = place => {
    if (place) {
      const article = document.createElement('article');

      const titleContainer = document.createElement('div');
      titleContainer.className = 'title_box';
      const titleInHTML = `<h2>${place.name}</h2>`;
      const priceByNightInHTML = '<div class="price_by_night">' +
        `$${place.price_by_night}` +
        '</div>';
      titleContainer.insertAdjacentHTML('beforeend', titleInHTML);
      titleContainer.insertAdjacentHTML('beforeend', priceByNightInHTML);

      const infoContainer = document.createElement('div');
      infoContainer.className = 'information';
      const maxGuestInHTML = '<div class="max_guest">' +
        `${place.max_guest}` +
        ` Guest${place.max_guest !== 1 ? 's' : ''}` +
        '</div>';
      const numberRoomsInHTML = '<div class="number_rooms">' +
        `${place.number_rooms}` +
        ` Bedroom${place.number_rooms !== 1 ? 's' : ''}` +
        '</div>';
      const numberBathroomsInHTML = '<div class="number_bathrooms">' +
        `${place.number_bathrooms}` +
        ` Bathroom${place.number_bathrooms !== 1 ? 's' : ''}` +
        '</div>';
      infoContainer.insertAdjacentHTML('beforeend', maxGuestInHTML);
      infoContainer.insertAdjacentHTML('beforeend', numberRoomsInHTML);
      infoContainer.insertAdjacentHTML('beforeend', numberBathroomsInHTML);

      const userContainer = document.createElement('div');
      userContainer.className = 'user';
      if (place.user) {
        const userHTML = '<b>Owner:</b>' +
          ` ${place.user.first_name} ${place.user.last_name}`;
        userContainer.insertAdjacentHTML('beforeend', userHTML);
      }

      const descriptionContainer = document.createElement('div');
      descriptionContainer.className = 'description';
      descriptionContainer.innerHTML = place.description;

      article.insertAdjacentElement('beforeend', titleContainer);
      article.insertAdjacentElement('beforeend', infoContainer);
      article.insertAdjacentElement('beforeend', userContainer);
      article.insertAdjacentElement('beforeend', descriptionContainer);
      return article;
    } else {
      return null;
    }
  };
  const getPlaces = filter => {
    const placesFetcher = new Promise((resolve, reject) => {
      $.ajax({
        url: `${BASE_URL}/places_search`,
        type: 'POST',
        data: JSON.stringify(filter || {}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: data => {
          const placeOwnerPromises = data.map(place => new Promise((resolve, reject) => {
            $.get(`${BASE_URL}/users/${place.user_id}`, (data, status) => {
              const fullPlace = place;
              fullPlace.user = data;
              resolve(fullPlace);
            });
          }));
          Promise
            .all(placeOwnerPromises)
            .then(places => resolve(places))
            .catch(err => reject(err));
        }
      });
    });
    return placesFetcher;
  };
  const setPlaces = filter => {
    getPlaces(filter)
      .then(places => {
        $('section.places').empty();
        $('section.places').append('<h1>Places</h1>');
        for (let i = 0; i < places.length; i++) {
          $('section.places').append(findPlace(places[i]));
        }
      });
  };

  $(selectors.amenityItem).on('mousedown', ev => {
    ev.target.getElementsByTagName('input')?.item(0)?.click();
  });

  $(selectors.amenityContainer).change(ev => {
    const amenityId = ev.target.getAttribute('data-id');
    const amenityName = ev.target.getAttribute('data-name');

    if (ev.target.checked) {
      if (!amenitiesChoosen.find(obj => obj.id === amenityId)) {
        amenitiesChoosen.push({
          id: amenityId,
          name: amenityName
        });
      }
    } else {
      amenitiesChoosen = amenitiesChoosen.filter(
        obj => (obj.id !== amenityId) && (obj.name !== amenityName)
      );
    }
    const htmlContent = amenitiesChoosen.map(obj => obj.name).join(', ');
    $(selectors.amenitiesHeader).html(
      amenitiesChoosen.length > 0 ? htmlContent : '&nbsp;'
    );
  });

  $.get(`${BASE_URL}/status`, (data, status) => {
    if ((status === 'success') && (data.status === 'OK')) {
      if (!$('div#api_status').hasClass('available')) {
        $('div#api_status').addClass('available');
      }
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  setPlaces({});
});










