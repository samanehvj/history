import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import './index.css';

import messages from './messages';

/**
 * Parse querystring from route
 * @param {string} find query name
 * @param {string} from route or URL
 * @returns {string}
 */
function parseQueryString(find, from) {
  if (!find || !from) return '';
  const parts = RegExp(`[?&]${find}(=([^&#]*)|&|#|$)`).exec(from);
  return parts ? parts[2] : '';
}

// location is provided by react-router-dom
function NearbyPage({ location: { search: query } }) {
  const coordinates = parseQueryString('coordinates', query);
  const lat = coordinates.split(',')[0];
  const lon = coordinates.split(',')[1];
  const radius = 2;
  const apiKey = '801e60070a67abab3f8a64e53f007763';

  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&lat=${lat}&lon=${lon}&radius=${radius}&format=json&nojsoncallback=1&per_page=25`;

  const [photos, setPhotos] = useState(null);
  const [pic, setPic] = useState({});
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.stat !== 'fail') {
          setPic(data.photos.photo[0]);
          setPhotos(data.photos.photo);
        } else {
          setErr(data.message);
        }
      })
      .catch(error => (
        <div>
          <h1>Something went wrong:</h1>
          <p>{error}</p>
        </div>
      ));
    return null;
  }, []);

  if (!photos) {
    return (
      <div>
        <h1>Something went wrong</h1>
        <p>{err}</p>
      </div>
    );
  }

  return (
    <article>
      <Helmet></Helmet>
      <FormattedMessage {...messages.header} />
      {coordinates}
      <p> Here is list: </p>
      <div className="row">
        <div className="col-md-8 offset-md-2 img">
          <img
            alt={pic.title}
            className="big-img"
            src={`https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_c.jpg`}
          />
        </div>
        <div className="thumb-div">
          {photos.map(photo => (
            <div
              role="button"
              tabIndex="0"
              onClick={() => setPic(photo)}
              onKeyDown={() => setPic(photo)}
              key={photo.id}
              className={photo.id === pic.id ? 'active' : ''}
            >
              <p className="title">{photo.title}</p>
              <img
                className="thumb-img"
                alt={photo.title}
                src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`}
              />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default memo(NearbyPage);
