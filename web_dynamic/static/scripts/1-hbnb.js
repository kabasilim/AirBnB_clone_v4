'use strict';
$(() => {
  let amenitiesChoosen = [];
  const selectors = {
    amenitiesHeader: '.amenities > h4',
    amenityContainer: '.amenities > .popover > ul > li > input[type="checkbox"]',
    amenityItem: '.amenities > .popover > ul > li'
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
});