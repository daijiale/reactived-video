import React from 'react';
import DocumentTitle from 'react-document-title';
import { enquireScreen } from 'enquire-js';
import Banner from './Banner';
import Page1 from './Page1';
import Page3 from './Page3';
import Footer from './Footer';

let isMobile = false;
enquireScreen((b) => {
  isMobile = b;
});

class Home extends React.PureComponent {
  state = {
    isMobile,
    showShadow: false,
  };

  componentDidMount() {
    enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      });
    });
  }

  navToShadow = (e) => {
    this.setState({ showShadow: e.mode === 'leave' });
  };

  render() {
    return [
      <Banner
        key="banner"
        isMobile={this.state.isMobile}
        navToShadow={this.navToShadow}
      />,
      <Page3 key="page3" isMobile={this.state.isMobile} />,
      <Page1 key="page1" isMobile={this.state.isMobile} />,
      <Footer key="footer" />,
      <DocumentTitle title="互动电影" key="title" />,
    ];
  }
}
export default Home;
