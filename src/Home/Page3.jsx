/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import 'react-html5video/dist/styles.css';
import { Modal, Button } from 'antd-mobile';
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
    nextFirVideoInfo:
      {
        uri: '',
      },
    nextSecVideoInfo:
      {
        uri: '',
      },
    choiceMethod: '',
    lastURI: '',
  };

  async componentDidMount() {
    // 加载首页数据

    await this.initVideoInfoFromServer();
    // 实例化hls，支持m3u8播放
    this.addHlsToPlayer();
  }


  async initVideoInfoFromServer() {
    const baseInfoRes = await axios.get('/v1/base_info');
    if (!baseInfoRes.data.ErrMsg === '') {
      return;
    }
    // 记录用户上次所看片集位置，以便进行续播
    this.setState({ lastURI: baseInfoRes.data.Result.LastURI });
    await this.resolveVideoInfo(baseInfoRes.data.Result.FirstURI);
  }


  async resolveVideoInfo(videoInfoUri) {
    const videoRes = await axios.get(videoInfoUri);
    if (!videoRes.data.ErrMsg === '') {
      return;
    }
    const videoInfoRes = videoRes.data.Result;
    // if (!videoInfoRes.NoNeedPaid) {
    //   alertM('未购买电影，请先支付');
    //   // TODO:弹出支付页选项
    // }
    const videoInfoCache = {};
    videoInfoCache.VideoPlayURI = videoInfoRes.VideoPlayURI;
    videoInfoCache.choiceMethod = videoInfoRes.ChoiceMethod;
    if (videoInfoRes.ChoiceMethod === 'Single') {
      videoInfoCache.nextFirVideoInfo = videoInfoRes.ChoiceItems[0].NextURI ? videoInfoRes.ChoiceItems[0].NextURI : '';
    } else {
      videoInfoCache.nextFirVideoInfo = videoInfoRes.ChoiceItems[0].NextURI ? videoInfoRes.ChoiceItems[0].NextURI : '';
      videoInfoCache.nextSecVideoInfo = videoInfoRes.ChoiceItems[1].NextURI ? videoInfoRes.ChoiceItems[1].NextURI : '';
    }
    this.setState({
      videoInfo: [{ img: page3.children[0].img, imgMobile: page3.children[0].imgMobile, src: videoInfoRes.VideoPlayURI }],
      nextFirVideoInfo: { uri: videoInfoCache.nextFirVideoInfo },
      nextSecVideoInfo: { uri: videoInfoCache.nextSecVideoInfo },
      choiceMethod: videoInfoCache.choiceMethod,
    });
    console.log(this.state);
    this.addHlsToPlayer();
  }

  async handleFirPress() {
    console.log('cancel');
    await this.loadNextVideo(this.state.nextFirVideoInfo.uri);
  }

  async handleSecPress() {
    console.log('ok');
    await this.loadNextVideo(this.state.nextSecVideoInfo.uri);
  }

  async loadNextVideo(videoInfoUri) {
    console.log('videoInfo now is ');
    await this.resolveVideoInfo(videoInfoUri);
    console.log(this.state);
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
    if (this.state.choiceMethod === 'Single') {
      // 单个文字选项
      alertM('选择', '选择题介绍', [
        { text: '取消', onPress: () => { this.handleFirPress(); } },
      ]);
    } else if (this.state.choiceMethod === 'PictureSelect') {
      alertM('图片双选');
    } else if (this.state.choiceMethod === 'Inbox') {
      alertM('输入框双选');
    } else {
      console.log('文字双选');
      // 文字双选
      alertM('选择', '选择题介绍', [
        { text: '取消', onPress: () => { this.handleFirPress(); } },
        { text: '确定', onPress: () => { this.handleSecPress(); } },
      ]);
    }
  }

  async getLastURIVideo(lastURI) {
    await this.resolveVideoInfo(lastURI);
  }

  render() {
    const { isMobile } = this.props;
    // const lastURI = this.state.lastURI;
    const lastURI = 'http://192.168.5.141:8080/v1/video_info/2';
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
        <Button icon={<img src="https://gw.alipayobjects.com/zos/rmsportal/jBfVSpDwPbitsABtDDlB.svg" alt="" />} onClick={() => { this.getLastURIVideo(lastURI); }}>继续上次观看</Button>
      </div>
    );
  }
}
