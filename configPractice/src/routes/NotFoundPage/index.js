import React from 'react';
// import classNames from 'classnames';
import { Button } from 'antd';
import config from './typeconfig';
import './index.scss';

export default ({ type, title, desc }) => {
  const pageType = type in config ? type : '404';
  // const clsString = classNames(styles.exception, className);
  return (
    <div className="exception">
      <div className="imgBlock">
        <div
          className="imgEle"
          style={{ backgroundImage: `url(${config[pageType].img})` }}
        />
      </div>
      <div className="content">
        <h1>{title || config[pageType].title}</h1>
        <div className="desc">{desc || config[pageType].desc}</div>
        <div className="actions">
          <Button type="primary">返回首页</Button>
        </div>
      </div>
    </div>
  );
};
