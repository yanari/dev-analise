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

export function isValidTwitterUrl (value) {
  return (value.indexOf('twitter.com') > -1) && getTwitterId(value);
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
  return videoId ? videoPath + '/' + videoId : null;
}

export function getAddressDescription (fullAddress) {
  if (!fullAddress) return null;
  if (fullAddress.size === 0) return null;
  if (!fullAddress.get('city_desc')) return null;
  let description = '';
  if (fullAddress.get('line1')) {
    description += fullAddress.get('line1');
    if (fullAddress.get('number')) {
      description += ', ' + fullAddress.get('number');
    }
    if (fullAddress.get('line2')) {
      description += ' - ' + fullAddress.get('line2');
    }
    if (fullAddress.get('complement')) {
      description += ' - ' + fullAddress.get('complement');
    }
  }
  description += description ? ' - ' + fullAddress.get('city_desc') : fullAddress.get('city_desc');
  return description;
}

export function removeEmptyTag (html) {
  return html ? html.replace(/<(.+)><br><\/\1>/g, '') : null;
}

export function isValidAwsS3Src (value) {
  return value.substr(0, 4) === 'cms/';
}

export function resolveImageSrc ({awsS3Url, src}) {
  if (!src) return null;
  if (src.indexOf('//') === -1 && awsS3Url && isValidAwsS3Src(src)) {
    return awsS3Url + '/' + src;
  }
  return src;
}
