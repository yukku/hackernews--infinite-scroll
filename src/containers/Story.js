import React from 'react';
import { connect } from 'react-redux';
import parseDomain from 'parse-domain';
import _ from 'lodash';
import timeago from 'timeago.js';
import Story from '../components/Story';

class StoryContainer extends React.Component {
  extractDomain(url) {
    if (url) {
      const { subdomain, domain, tld } = parseDomain(url);
      return _.chain([subdomain, domain, tld])
        .compact()
        .join('.')
        .value();
    } else {
      return false;
    }
  }

  render() {
    return (
      <Story
        {...this.props}
        extractDomain={this.extractDomain}
        timeago={timeago}
      />
    );
  }
}

export default connect()(StoryContainer);
