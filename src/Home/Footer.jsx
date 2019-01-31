import React from 'react';
import { Row, Col } from 'antd';

export default function Footer() {
  return (
    <footer className="footer page-wrapper">
      <div className="footer-wrap page text-center">
        <Row>
          在观影和支付过程中，如遇问题，请加客服微信：
        </Row>
        <br />
        <img style={{ width: '100px', height: '100px', marginBottom: '30px' }} src="/wechat-offical.jpg" />
      </div>
      <div className="footer-bottom">
        <div className="page">
          <Row>
            <Col md={32} xs={32}>
              <span style={{ marginRight: 12 }}>Copyright © 2019 BLACK MIRROR</span>
            </Col>
          </Row>
        </div>

      </div>
    </footer>
  );
}
