import React, { ReactElement, useState } from 'react';
import { ScrollView, Image, View, Alert } from 'react-native';
import styles from './home.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigatorParams } from '@config/navigator';
import { GradientBackground, Button, Text } from '@components';
import { useAuth } from '@contexts/auth-context';
import { Auth } from 'aws-amplify';
type HomeProps = {
  navigation: StackNavigationProp<StackNavigatorParams, 'Home'>;
};

export default function Home({ navigation }: HomeProps): ReactElement {
  const { user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Image style={styles.logo} source={require('@assets/logo.png')} />
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            title="Single Player"
            onPress={() =>
              navigation.navigate('SinglePlayerGame', { gameId: '2' })
            }
          />
          <Button style={styles.button} title="Multiplayer" />
          <Button
            loading={signingOut}
            style={styles.button}
            title={user ? 'Logout' : 'Login'}
            onPress={async () => {
              if (user) {
                setSigningOut(true);
                try {
                  await Auth.signOut();
                } catch (error) {
                  Alert.alert('Error!', 'Error signing out!');
                }
                setSigningOut(false);
              } else {
                navigation.navigate('Login');
              }
            }}
          />
          <Button
            style={styles.button}
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
          {user && (
            <Text weight="400" style={styles.loggedInText}>
              Logged in as <Text weight="700">{user.username}</Text>
            </Text>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
