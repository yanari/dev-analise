import {format} from './utils/moment';

export function getFormattedAddressDescription (fullAddress) {
  const street = (
    fullAddress.get('number')
      ? fullAddress.get('line1')
      : fullAddress.get('line1') + ' '
  ); // required
  const streetNumber = (
    fullAddress.get('number')
      ? ', ' + fullAddress.get('number') + ' '
      : ''
  );
  const streetComplement = (
    fullAddress.get('complement')
      ? '- ' + fullAddress.get('complement')
      : ''
  );
  const neighbourhood = (
    fullAddress.get('line2')
      ? ', ' + fullAddress.get('line2') + ' '
      : ''
  );
  const cityDescription = '- ' + fullAddress.get('city_desc'); // required
  return street + streetNumber + streetComplement + neighbourhood + cityDescription;
}

export function getFormattedDateDescriptions (initDateHour, endDateHour) {
  const initDateHourDescription = format('DD [de] MMMM [de] YYYY [-] hh:mm', initDateHour);
  let endDateHourDescription = format('DD [de] MMMM [de] YYYY [-] hh:mm', endDateHour);
  const initDateDescription = initDateHourDescription.split(' - ')[0];
  if (endDateHourDescription) {
    const [endDateDescription, endHourDescription] = endDateHourDescription.split(' - ');
    if (initDateDescription === endDateDescription) { // check if same day
      endDateHourDescription = endHourDescription;
    }
  }
  return [initDateHourDescription, endDateHourDescription];
}

export function removeBrTagFromParagraph (html) {
  return html ? html.replace(/<(.+)><br><\/\1>/g, '') : null;
}

export function getTwitterId (value) {
  const urlParts = value.split('/status/');
  let id = urlParts[1];
  if (id.indexOf('/') > -1) {
    id = id.substr(0, id.indexOf('/'));
  }
  if (id.indexOf('?') > -1) {
    id = id.substr(0, id.indexOf('?'));
  }
  return id;
}

export function getYoutubeId (value) {
  const url = value.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : null;
}

export function getVimeoId (value) {
  const urlParts = value.split('.com/');
  let id = urlParts[1];
  if (id.indexOf('/') > -1) {
    id = id.substr(0, id.indexOf('/'));
  }
  if (id.indexOf('?') > -1) {
    id = id.substr(0, id.indexOf('?'));
  }
  return id;
}

export function isValidYoutubeUrl (value) {
  return (value.indexOf('youtube.com') > -1) && getYoutubeId(value);
}

export function isValidVimeoUrl (value) {
  return (value.indexOf('vimeo.com') > -1) && getVimeoId(value);
}

export function getVimeoOrYoutubeSrc (url) {
  let videoId = null;
  let videoPath = null;
  if (isValidVimeoUrl(url)) {
    videoId = getVimeoId(url);
    videoPath = '//player.vimeo.com/video';
  } else if (isValidYoutubeUrl(url)) {
    videoId = getYoutubeId(url);
    videoPath = '//www.youtube.com/embed';
  }
  console.log(videoId);
  return videoId ? videoPath + '/' + videoId : null;
}

export function getFormQueryString (formDom) {
  // Tratamento pra enviar pro get apenas parâmetros com valor
  const elementsLength = formDom.elements.length;
  let count = 0;
  const queryString = {};
  for (let i = 0; i < elementsLength; i++) {
    const element = formDom.elements[i];
    if (element.value) {
      queryString[element.name] = element.value;
      count++;
    }
  }
  return count === 0 ? null : queryString;
}
