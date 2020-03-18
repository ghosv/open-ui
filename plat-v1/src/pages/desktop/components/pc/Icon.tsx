import React from 'react';

import styles from './Icon.less';

function Icon({ active, icon, name, intro, onClick, onDoubleClick }) {
  const styleIcon = styles.icon + (active ? ` ${styles.active}` : '');
  const title = intro ? intro : name;

  return (
    <div
      className={styleIcon}
      title={title}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <img className={styles.img} src={icon} alt={name} />
      <div className={styles.txt}>{name}</div>
    </div>
  );
}

export default Icon;
