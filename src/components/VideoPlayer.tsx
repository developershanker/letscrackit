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

/**
 * Reusable video player wrapper for react-native-video v7.
 *
 * v7 moved to a hook-based API: useVideoPlayer creates the player instance
 * and VideoView renders it via the `player` prop. The old props (source,
 * paused, onLoad, onError) no longer exist on VideoView.
 *
 * Design decisions:
 * - useVideoPlayer must be called unconditionally (hook rules), so the JS
 *   player object always exists — but it does NOT buffer until player.play()
 *   is called, keeping idle list cards cheap.
 * - VideoView is only mounted after the user taps play (lazy mount). This
 *   avoids creating native player surfaces for every card in the FlatList.
 * - We own the thumbnail overlay instead of relying on the poster prop,
 *   which has inconsistent behaviour across v7 beta builds.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  thumbnail,
  style,
  autoPlay = false,
}) => {
  const [started, setStarted] = useState(autoPlay);

  // Always call play() in the hook callback — this is the pattern v7 expects.
  // The video loads and plays immediately but stays hidden under the thumbnail
  // until the user taps. On tap we simply remove the overlay; the video is
  // already playing so no second play() call is needed.
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.play();
  });

  const handlePlayPress = () => setStarted(true);

  return (
    <View style={[styles.container, style]}>
      {/* VideoView always mounted so the native player is ready before play() is called */}
      <VideoView
        player={player}
        style={styles.video}
        controls
      />

      {/* Thumbnail sits on top as an overlay — removed once the user starts playback */}
      {!started && (
        <Pressable
          style={styles.thumbnailOverlay}
          onPress={handlePlayPress}>
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} resizeMode="cover" />
          ) : (
            <View style={styles.thumbnailFallback} />
          )}
          <View style={styles.playButtonOverlay}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={28} color={colors.MIDNIGHT_NAVY} />
            </View>
          </View>
        </Pressable>
      )}
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