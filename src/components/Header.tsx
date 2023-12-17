import React from "react"
import { View, Text, StyleSheet } from 'react-native'
import { colors, fonts } from "../utils/constants";

const Header = () => {
    return (
        <View>
            <Text style={styles.headerStyles}>Header</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    headerStyles: {...fonts.PoppinsSemiBold(16),color: colors.WHITE}
})
export default React.memo(Header);