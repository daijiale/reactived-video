/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import 'react-html5video/dist/styles.css';
import { Modal } from 'antd-mobile';
import React from 'react';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import BannerAnim from 'rc-banner-anim';
import { DefaultPlayer as Video } from 'react-html5video';
import Hls from 'hls.js';
import axios from '../axios';
import { page3 } from './data';

const { Element } = BannerAnim;
const { BgElement } = Element;

const alertM = Modal.alert;

export default class Page3 extends React.PureComponent {
  state = {
    videoInfo: [
      {
        img: page3.children[0].img,
        imgMobile: page3.children[0].imgMobile,
        src: page3.children[0].src,
      },
    ],
    // nextFirVideoInfo: {

    // },
    // nextSecVideoInfo: {

    // },
  };

  async componentDidMount() {
    // 加载首页数据
    await this.initVideoInfoFromServer();
    // 实例化hls，支持m3u8播放
    this.addHlsToPlayer();
  }

  async initVideoInfoFromServer() {
    const baseInfoRes = await axios.get('/v1/base_info');
    if (baseInfoRes.data.Result.FirstURI == null) {
      return;
    }
    const videoRes = await axios.get(baseInfoRes.data.Result.FirstURI);
    this.setState({
      videoInfo: [{ img: page3.children[0].img, imgMobile: page3.children[0].imgMobile, src: videoRes.data.Result.VideoPlayURI }],
    });
  }

  addHlsToPlayer() {
    if (Hls.isSupported()) {
      const video = document.getElementById('video-player');
      const hls = new Hls();
      hls.loadSource(this.state.videoInfo[0].src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
  }

  handleVideoEnded() {
    if (
      document.body.scrollHeight === window.screen.height
      && document.body.scrollWidth === window.screen.width
    ) {
      document.exitFullscreen();
    }
    alertM('选择', '选择题介绍', [
      { text: '取消', onPress: () => this.handleFirPress() },
      { text: '确定', onPress: () => this.handleSecPress() },
    ]);
  }

  handleFirPress() {
    console.log('cancel');
  }

  handleSecPress() {
    console.log('ok');
  }

  render() {
    const { isMobile } = this.props;
    const children = this.state.videoInfo.map((item, i) => (
      <Element key={i.toString()}>
        <BgElement className="banner" key="bg">
          <Video
            id="video-player"
            muted
            controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
            poster={isMobile ? item.imgMobile : item.img}
            key="video"
            // eslint-disable-next-line react/jsx-no-bind
            onEnded={this.handleVideoEnded.bind(this)}

          >
            <source src={item.src} />
          </Video>
        </BgElement>
      </Element>
    ));
    const childrenToRender = (
      <TweenOne
        key="banner-wrapper"
        animation={{ type: 'from', y: 30, opacity: 0 }}
      >
        <BannerAnim
          type="across"
          thumb={false}
          duration={550}
          ease="easeInOutQuint"
        >
          {children}
        </BannerAnim>
      </TweenOne>
    );
    return (
      <div className="page-wrapper page3">
        <div className="page">
          <h1>{page3.title}</h1>
          <i />
          {React.createElement(
            isMobile ? 'div' : OverPack,
            { className: 'banner-wrapper' },
            childrenToRender
          )}
        </div>
      </div>
    );
  }
}
