import 'rc-banner-anim/assets/index.css';
import React from 'react';
import QueueAnim from 'rc-queue-anim';
import BannerAnim from 'rc-banner-anim';
import { Button } from 'antd';
import { banner } from './data';

const { Element } = BannerAnim;
const { BgElement } = Element;

class Banner extends React.PureComponent {
  getDuration = (e) => {
    if (e.key === 'map') {
      return 800;
    }
    return 1000;
  };

  render() {
    const { isMobile } = this.props;

    return (
      <div className="banner page-wrapper">
        <div className="page">
          <div className="logo" />
        </div>
      </div>
    );
  }
}

export default Banner;
