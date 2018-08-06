import React from 'react';
import PropTypes from 'prop-types';

const Story = ({ story, extractDomain, timeago }) => {
  return (
    <section className="post">
      <div className="container">
        <h2>{story.title}</h2>

        <div className="info-container">
          {story.url ? (
            <div className="link-container">
              <a href={story.url} className="link">
                {extractDomain(story.url)}
              </a>
            </div>
          ) : (
            false
          )}
          <div className="details-container">
            <span className="time">{timeago().format(story.time * 1000)}</span>
            <span className="score">{story.score} points</span>{' '}
            <span className="author">by {story.by}</span>
            <span className="descendants">{story.descendants} comments</span>
          </div>
        </div>
      </div>
    </section>
  );
};

Story.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.number,
    key: PropTypes.number,
    kids: PropTypes.arrayOf(PropTypes.number),
    type: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    url: PropTypes.string,
    score: PropTypes.number,
    time: PropTypes.number,
    by: PropTypes.string,
    descendants: PropTypes.number,
    extractDomain: PropTypes.func,
    timeago: PropTypes.func,
    dead: PropTypes.bool,
    deleted: PropTypes.bool
  })
};

export default Story;
