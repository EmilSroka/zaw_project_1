import React from 'react';
import { Tag } from 'primereact/tag';

const CategoyTag = ({ category}) => {
    return (<Tag style={{background: `#${category.color_hash}`, color: getTextColor(category.color_hash)}}>
        {category?.name?.length < 20 ? category.name :`${category.name.slice(0,17)}...`}
    </Tag>);
}

function getTextColor(backgroundColor) {
    const rgb = parseInt(backgroundColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
  
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  

export default CategoyTag;