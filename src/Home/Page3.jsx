/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import 'react-html5video/dist/styles.css';
import { Modal, Button, WhiteSpace } from 'antd-mobile';
import React from 'react';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import BannerAnim from 'rc-banner-anim';
import { DefaultPlayer as Video } from 'react-html5video';
import Hls from 'hls.js';
import router from 'umi/router';
import axios from '../axios';
import { page3 } from './data';

axios.defaults.withCredentials = true;

const { Element } = BannerAnim;
const { BgElement } = Element;

const alertM = Modal.alert;
const promptM = Modal.prompt;


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
        text: '',
      },
    nextSecVideoInfo:
      {
        uri: '',
        text: '',
      },
    choiceMethod: '',
    choiceQuestion: '',
    lastURI: '',
    firstURI: '',
  };

  async componentDidMount() {
    await this.initVideoInfoFromServer();
  }


  async initVideoInfoFromServer() {
    const baseInfoRes = await axios.get('/v1/base_info');
    if (!baseInfoRes.data.ErrMsg === '') {
      return;
    }
    // 记录用户上次所看片集位置，以便进行续播
    this.setState({ lastURI: baseInfoRes.data.Result.LastURI, firstURI: baseInfoRes.data.Result.FirstURI });
  }


  async resolveVideoInfo(videoInfoUri) {
    const videoRes = await axios.get(videoInfoUri);
    if (!videoRes.data.ErrMsg === '') {
      return;
      // TODO:设置统一的异常处理页面
    }
    if ((videoRes.data.ErrMsg === 'no paid')) {
      router.push('/pay');
    }
    const videoInfoRes = videoRes.data.Result;
    const videoInfoCache = {};
    videoInfoCache.VideoPlayURI = videoInfoRes.VideoPlayURI;
    videoInfoCache.choiceMethod = videoInfoRes.ChoiceMethod;
    videoInfoCache.choiceQuestion = videoInfoRes.ChoiceQuestion;
    if (videoInfoRes.ChoiceMethod === 'Single') {
      videoInfoCache.nextFirVideoInfoUri = videoInfoRes.ChoiceItems[0].NextURI ? videoInfoRes.ChoiceItems[0].NextURI : '';
      videoInfoCache.nextFirVideoInfoText = videoInfoRes.ChoiceItems[0].Text ? videoInfoRes.ChoiceItems[0].Text : '';
    } else {
      videoInfoCache.nextFirVideoInfoUri = videoInfoRes.ChoiceItems[0].NextURI ? videoInfoRes.ChoiceItems[0].NextURI : '';
      videoInfoCache.nextFirVideoInfoText = videoInfoRes.ChoiceItems[0].Text ? videoInfoRes.ChoiceItems[0].Text : '';
      videoInfoCache.nextSecVideoInfoUri = videoInfoRes.ChoiceItems[1].NextURI ? videoInfoRes.ChoiceItems[1].NextURI : '';
      videoInfoCache.nextSecVideoInfoText = videoInfoRes.ChoiceItems[1].Text ? videoInfoRes.ChoiceItems[1].Text : '';
    }
    this.setState({
      videoInfo: [{ img: page3.children[0].img, imgMobile: page3.children[0].imgMobile, src: videoInfoRes.VideoPlayURI }],
      nextFirVideoInfo: { uri: videoInfoCache.nextFirVideoInfoUri, text: videoInfoCache.nextFirVideoInfoText },
      nextSecVideoInfo: { uri: videoInfoCache.nextSecVideoInfoUri, text: videoInfoCache.nextSecVideoInfoText },
      choiceMethod: videoInfoCache.choiceMethod,
      choiceQuestion: videoInfoCache.choiceQuestion,
    });
    console.log(this.state);
    this.addHlsToPlayer();
  }

  async handleFirPress() {
    await this.loadNextVideo(this.state.nextFirVideoInfo.uri);
  }

  async handleSecPress() {
    await this.loadNextVideo(this.state.nextSecVideoInfo.uri);
  }

  async handleInbox() {
    alert('todo:handle inbox , check num');
  }

  async loadNextVideo(videoInfoUri) {
    await this.resolveVideoInfo(videoInfoUri);
  }

  addHlsToPlayer() {
    const video = document.getElementById('video-player');
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.state.videoInfo[0].src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else {
      alertM('开始播放？', '', [
        { text: '确定', onPress: () => { video.play(); } },
        { text: '取消', onPress: () => { video.load(); } },
      ]);
    }
  }

  exitFullscreen() {
    // 浏览器全屏、元素全屏、
    // const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    // if (document.exitFullscreen) {
    //   document.exitFullscreen();
    // } else if (document.msExitFullscreen) {
    //   document.msExitFullscreen();
    // } else if (document.mozCancelFullScreen) {
    //   document.mozCancelFullScreen();
    // } else if (document.webkitExitFullscreen) {
    //   document.webkitExitFullscreen();
    // }
  }


  handleVideoEnded() {
    // TODO:适配各个浏览器
    this.exitFullscreen();

    if (this.state.choiceMethod === 'Single') {
      // 单个文字选项
      alertM(this.state.choiceQuestion, '', [
        { text: this.state.nextFirVideoInfo.text, onPress: () => { this.handleFirPress(); } },
      ]);
    } else if (this.state.choiceMethod === 'PictureSelect') {
      // 图片双选
      alertM(this.state.choiceQuestion);
    } else if (this.state.choiceMethod === 'Inbox') {
      // 输入框
      promptM(this.state.choiceQuestion, '', [{ text: '取消' }, { text: '提交', onPress: () => { this.handleInbox(); } }], '');
    } else {
      // 文字双选
      alertM(this.state.choiceQuestion, '', [
        { text: this.state.nextFirVideoInfo.text, onPress: () => { this.handleFirPress(); } },
        { text: this.state.nextSecVideoInfo.text, onPress: () => { this.handleSecPress(); } },
      ]);
    }
  }

  async getVideoFromURI(videoURI) {
    await this.resolveVideoInfo(videoURI);
  }


  render() {
    const { isMobile } = this.props;
    // const lastURI = this.state.lastURI;
    const lastURI = this.state.lastURI;
    const firstURI = this.state.firstURI;
    const children = this.state.videoInfo.map((item, i) => (
      <Element key={i.toString()}>
        <BgElement className="banner" key="bg">
          <Video
            id="video-player"
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
        <div id="video-dom" className="page">
          <h1>{page3.title}</h1>
          <i />
          <WhiteSpace size="lg" />
          <div style={{ textAlign: 'center' }}>
            <Button icon="right" inline size="small" style={{ marginRight: '4px' }} onClick={() => { this.getVideoFromURI(firstURI); }}>从头观看</Button>
            <Button inline size="small" icon={<img src="https://gw.alipayobjects.com/zos/rmsportal/jBfVSpDwPbitsABtDDlB.svg" alt="" />} onClick={() => { this.getVideoFromURI(lastURI); }}>继续上次观看</Button>
          </div>
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
