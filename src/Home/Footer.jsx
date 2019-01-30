import React from 'react';
import { Row, Col } from 'antd';
import { footer } from './data';

export default function Footer() {
  return (
    <footer className="footer page-wrapper">
      <div className="footer-wrap page text-center">
        <Row>
          在观影和支付过程中，如遇问题，请加客服微信：
        </Row>
        <br />
        <img src="http://placehold.it/100x100" />
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
