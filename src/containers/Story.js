import React from 'react';
import { connect } from 'react-redux';
import extractDomain from 'extract-domain';
import timeago from 'timeago.js';
import Story from '../components/Story';

class StoryContainer extends React.Component {
  render() {
    return <Story {...this.props} extractDomain={extractDomain} timeago={timeago} />;
  }
}

export default connect()(StoryContainer);
