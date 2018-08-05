import React from 'react';
import parseDomain from 'parse-domain';
import _ from 'lodash';
import timeago from 'timeago.js';

const extractDomain = url => {
  if (url) {
    const { subdomain, domain, tld } = parseDomain(url);
    return _.chain([subdomain, domain, tld])
      .compact()
      .join('.')
      .value();
  } else {
    return null;
  }
};
const Story = ({ story }) => {
  return (
    <section className="post">
      <div className="container">
        <h2>{story.title}</h2>

        <div className="info-container">
          {story.url ? (
            <div className="link-container">
              <a className="link">{extractDomain(story.url)}</a>
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

export default Story;
