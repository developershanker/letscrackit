import React from "react"
import { View, Text, StyleSheet } from 'react-native'
import { colors, fonts } from "../utils/constants";
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = () => {
    return (
        <View>
            <Text style={styles.headerStyles}>Header</Text>
            <Icon name="rss" size={30} color="#fff" />
        </View>
    )
}
const styles = StyleSheet.create({
    headerStyles: {...fonts.PoppinsSemiBold(16),color: colors.WHITE}
})
export default React.memo(Header);