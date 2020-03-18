import React, { useState } from 'react';
import styles from './Window.less';

import { Button } from 'antd';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

function useSwitch(states) {
  const [s, set] = useState(states);
  return [
    s,
    () => {
      set(!s);
    },
  ];
}

function Window({ url, icon, name, zIndex, close }) {
  const [fullscreen, switchFullscreen] = useSwitch(false);
  const styleOver = fullscreen
    ? {
        top: '25px',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        width: '100%',

        zIndex,
      }
    : {
        zIndex,
      };

  // TODO: drag win

  return (
    <div className={styles.container} style={styleOver} draggable={!fullscreen}>
      <div className={styles.header}>
        <img className={styles.icon} src={icon} alt={name} />
        <div className={styles.title}>{name}</div>
        <div className={styles.btnGroup}>
          {/* <Button size="small" icon="minus" /> */}
          <Button
            type="link"
            ghost
            size="small"
            icon={
              fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
            }
            onClick={switchFullscreen}
          />
          <Button
            type="link"
            ghost
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={close}
          />
        </div>
      </div>
      <div className={styles.main}>
        <iframe
          frameBorder="0"
          height="100%"
          width="100%"
          title={name}
          src={url}
        />
      </div>
    </div>
  );
}

export default Window;
