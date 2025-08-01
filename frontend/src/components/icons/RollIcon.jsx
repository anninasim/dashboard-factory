import React from 'react';
import Icon from '@mdi/react';
import { mdiPaperRollOutline } from '@mdi/js';

const RollIcon = ({ size = 1, color = '#67e8f9', ...props }) => (
  <Icon path={mdiPaperRollOutline} size={size} color={color} {...props} />
);

export default RollIcon;
