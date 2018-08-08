import React from 'react';
import App from '../components/App';
import Stories from './Stories';
// import VarianceMonitor from '../containers/VarianceMonitor'

class AppContainer extends React.Component {
  render() {
    return (
      <App>
        {/*<VarianceMonitor />*/}
        <Stories />
      </App>
    );
  }
}

export default AppContainer;
