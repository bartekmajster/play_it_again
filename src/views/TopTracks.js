import React, { useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';
import ListTemplate from 'templates/ListTemplate';
import hero from 'assets/hero_images/hero2.jpg';
import ListItem from 'components/molecules/ListItem/ListItem';
import { connect } from 'react-redux';
import { fetchTracks as fetchTracksAction } from 'actions';
import PropTypes from 'prop-types';
import { time as staticTime } from '../utils';

const TopTracks = ({ fetchTracks, topTracks }) => {
  const [time, setTime] = useState(staticTime.longTerm);
  const [listVisible, setListVisibility] = useState(true);

  const updateList = (item) => {
    if (!topTracks[item].length) {
      fetchTracks(item);
    }
    setListVisibility(false);
    setTime(item);
    setTimeout(() => setListVisibility(true), 200);
  };

  useEffect(() => {
    if (!topTracks.long_term.length) {
      updateList(staticTime.longTerm);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <ListTemplate image={hero} header="Top Tracks" update={updateList}>
      {listVisible &&
        topTracks[time].map((item, index) => {
          const {
            name,
            artists,
            id,
            album: {
              external_urls: { spotify },
              images,
            },
          } = item;

          return (
            <LazyLoad key={id} height={100} offset={[-100, 100]}>
              <ListItem
                type="track"
                key={id}
                index={index}
                name={name}
                description={artists}
                image={images[2].url}
                link={spotify}
              />
            </LazyLoad>
          );
        })}
    </ListTemplate>
  );
};

const mapStateToProps = (state) => {
  const { topTracks } = state;
  return { topTracks };
};

const mapDispatchToProps = (dispatch) => ({
  fetchTracks: (time) => dispatch(fetchTracksAction(time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopTracks);

TopTracks.propTypes = {
  fetchTracks: PropTypes.func.isRequired,
  topTracks: PropTypes.shape({
    long_term: PropTypes.array,
    medium_term: PropTypes.array,
    short_term: PropTypes.array,
  }).isRequired,
};
