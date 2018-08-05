import React from 'react';
import App from '../components/App';
import Stories from './Stories';

class AppContainer extends React.Component {
  render() {
    return (
      <App>
        <Stories />
      </App>
    );
  }
}

export default AppContainer;
