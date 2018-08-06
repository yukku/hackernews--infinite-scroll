import React from 'react';
import { connect } from 'react-redux';
import { loadMostRecent, loadMoreStories } from '../actions';
import Stories from '../components/Stories';
import LoadingSpinner from '../components/LoadingSpinner';
import Story from '../containers/Story';

class StoriesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onScroll = this.onScroll.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(loadMostRecent());
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  getScrollInfo() {
    const body = document.body;
    const html = document.documentElement;
    const elHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const scrollTop = Math.max(body.scrollTop, html.scrollTop);
    const winHeight = window.innerHeight;
    return {
      winHeight,
      elHeight,
      scrollTop
    };
  }

  onScroll() {
    const { winHeight, elHeight, scrollTop } = this.getScrollInfo();
    const fromBottom = elHeight - (scrollTop + winHeight);
    if (fromBottom < 200) {
      this.props.dispatch(loadMoreStories());
    }
  }

  render() {
    return (
      <Stories>
        {this.props.stories.map(story => {
          if (story.id && !story.dead && !story.deleted) {
            return <Story key={story.id} story={story} />;
          } else {
            return false;
          }
        })}
        {this.props.isLoading ? <LoadingSpinner /> : false}
      </Stories>
    );
  }
}

const mapStateToProps = state => {
  return {
    stories: state.stories,
    isLoading: state.isLoading
  };
};

export default connect(mapStateToProps)(StoriesContainer);
