import React from 'react';
import { Image, StyleSheet } from 'react-native';

const logoSource = require('../assets/stork-logo.png');

/**
 * Stork logo — horizontal banner lockup.
 * Use `width` to control size. Height auto-scales (1:1 aspect ratio source).
 */
export default function StorkLogo({ width = 140, style }) {
  return (
    <Image
      source={logoSource}
      style={[{ width, height: width, resizeMode: 'contain' }, style]}
    />
  );
}
