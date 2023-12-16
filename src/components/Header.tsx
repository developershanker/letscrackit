import React from "react"
import { View, Text } from 'react-native'
import { colors, fonts } from "../utils/constants";

const Header = () => {
    return (
        <View>
            <Text style={{...fonts.PoppinsSemiBold(16),color: colors.BLACK}}>Header</Text>
        </View>
    )
}

export default React.memo(Header);