import React from 'react';
import { Result, Flex, Button, Icon, WhiteSpace } from 'antd-mobile';
import { Spin } from 'antd';
import router from 'umi/router';
import Footer from '../Home/Footer';
import axios from '../axios';

const qrImg = {
  width: '200px',
  height: '200px',
  marginBottom: '20px',
};

class Pay extends React.PureComponent {
    state = {
      payChoiseIsShow: true,
      payQRIsShow: false,
      payByWechatURI: '/v1/pay/wechat',
      payByAlipayURI: '/v1/pay/alipay',
      checkPaidURI: '/v1/check_paid',
      payChannel: '', // wechat/alipay
      payQrImg: '',
      qrExpiresTime: '',
      qrExpiresDate: '',
      isLoading: false,
    }

    componentDidMount() {

    }

    async payByWechat() {
      this.setState({
        isLoading: true,
        payChoiseIsShow: false,
      });
      const payRes = await axios.get(this.state.payByWechatURI);
      if (payRes.data.ErrMsg === '') {
        this.setState({
          payQrImg: payRes.data.Result.qr_img,
          qrExpiresTime: payRes.data.Result.expires_in,
          payChoiseIsShow: false,
          payQRIsShow: true,
          isLoading: false,
          payChannel: '微信(Wechat)',
        });
        this.setPayExipreTime();
      } else {
        alert('您已支付，请尽情观看，将跳转至正片页');
        router.push('/');
      }
    }

    async payByAlipay() {
      this.setState({
        isLoading: true,
        payChoiseIsShow: false,
      });
      const payRes = await axios.get(this.state.payByAlipayURI);
      if (payRes.data.ErrMsg === '') {
        this.setState({
          payQrImg: payRes.data.Result.qr_img,
          qrExpiresTime: payRes.data.Result.expires_in,
          payChoiseIsShow: false,
          payQRIsShow: true,
          isLoading: false,
          payChannel: '支付宝(Alipay)',
        });
        this.setPayExipreTime();
      } else {
        alert('您已支付，请尽情观看，将跳转至正片页');
        router.push('/');
      }
    }

    async paidConfirm() {
      const checkPaidRes = await axios.get(this.state.checkPaidURI);
      if (checkPaidRes.data.ErrMsg === '') {
        // 支付成功
        alert('支付成功，开启48小时全集观影');
        router.push('/');
      } else {
        alert('尚未查询到该订单，请确认是否扣款成功或稍后重试');
      }
    }

    setPayExipreTime() {
      const newDate = new Date();
      const currentTs = newDate.getTime() + this.state.qrExpiresTime * 1000;
      newDate.setTime(currentTs);
      const currentDate = newDate.toLocaleTimeString();
      this.setState({
        qrExpiresDate: currentDate,
      });
    }

    render() {
      const Loading = () => (
        <div>
          <h1 className="text-center">正在请求支付中心</h1>
          <Flex>
            <Flex.Item className="text-center"><Spin tip="请耐心等待..." /></Flex.Item>
          </Flex>
          <WhiteSpace />
        </div>
      );
      const PayChoise = () => (
        <div>
          <h1 className="text-center">请选择支付渠道</h1>
          <Flex>
            <Flex.Item>
              <Button icon={<img src="https://gw.alipayobjects.com/zos/rmsportal/pdFARIqkrKEGVVEwotFe.svg" alt="" />} onClick={() => { this.payByAlipay(); }}>支付宝</Button>
            </Flex.Item>
            <Flex.Item>
              <Button icon={<img src="http://career-pic.oss-cn-beijing.aliyuncs.com/blackmirror/wechat.svg" alt="" />} onClick={() => { this.payByWechat(); }}>微信支付</Button>
            </Flex.Item>
          </Flex>
          <WhiteSpace />
        </div>
      );

      const PayQR = () => (
        <div>
          <div className="text-center">
            <h1>{`${this.state.payChannel} | 收银台 `}</h1>
          </div>
          <Result
            id="qrcodeImg"
            message={(
              <div>
                <img style={qrImg} src={this.state.payQrImg} />
                <p>支付宝渠道：请使用支付宝App扫码进行支付</p>
                <p>微信支付渠道：请使用微信App扫码进行支付</p>
                <p>移动用户：请全屏截图本页，再在本机对应支付渠道App中进行二维码识别支付</p>
                <Button icon={<Icon type="check-circle" className="spe" style={{ fill: '#0cd4ec' }} />} onClick={() => { this.paidConfirm(); }}>确认支付完成</Button>
                <p style={{ color: 'red' }}>
                  {'请于'}
                  {this.state.qrExpiresDate}
                  {' 点前支付，否则此次订单将失效 '}
                </p>
              </div>
            )}
          />
        </div>
      );

      return (
        <div>
          {this.state.payChoiseIsShow && <PayChoise />}
          {this.state.isLoading && <Loading />}
          {this.state.payQRIsShow && <PayQR />}
          <Footer key="footer" />
        </div>
      );
    }
}
export default Pay;
