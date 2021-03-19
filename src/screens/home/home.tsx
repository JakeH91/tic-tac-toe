import React, { ReactElement } from 'react'
import { ScrollView, Image, View } from 'react-native'
import styles from './home.styles';
import { StackNavigationProp } from '@react-navigation/stack'
import { StackNavigatorParams } from '@config/navigator'
import { GradientBackground, Button } from '@components'

type HomeProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Home">
}

export default function Home({ navigation }: HomeProps): ReactElement {
  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Image 
          style={styles.logo}
          source={require('@assets/logo.png')}
        />
        <View style={styles.buttons}>
          <Button 
            style={styles.button}
            title="Single Player"
            onPress={() => navigation.navigate("SinglePlayerGame", { gameId: "2" })} 
          />
          <Button style={styles.button} title="Multiplayer" />
          <Button style={styles.button} title="Login" />
          <Button style={styles.button} title="Settings" />
        </View>
      </ScrollView>    
    </GradientBackground> 
  )
}
