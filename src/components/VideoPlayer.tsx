import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/constants';

interface VideoPlayerProps {
  uri: string;
  thumbnail?: string;
  style?: StyleProp<ViewStyle>;
  autoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  style,
}) => {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.pause();
  });

  return (
    <View style={[styles.container, style]}>
      <VideoView
        player={player}
        style={styles.video}
        controls
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.CHARCOAL,
    overflow: 'hidden',
    borderRadius: 12,
  },
  video: {
    flex: 1,
  },
  // Absolute insets are correct here — this element genuinely overlays VideoView
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    flex: 1,
    backgroundColor: colors.DEEP_MIDNIGHT,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.LIGHT_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },
});

export default VideoPlayer;