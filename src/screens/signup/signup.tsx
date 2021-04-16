import React, { ReactElement, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput as NativeTextInput } from 'react-native';
import { GradientBackground, TextInput, Button } from '@components';
import styles from './signup.styles';
import { Auth } from 'aws-amplify';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigatorParams } from '@config/navigator';

type SignUpProps = {
  navigation: StackNavigationProp<StackNavigatorParams, 'SignUp'>;
};

export default function SignUp({ navigation }: SignUpProps): ReactElement {
  const passwordRef = useRef<NativeTextInput | null>(null);
  const [form, setForm] = useState({
    username: 'test',
    password: '12345678',
  });
  const [loading, setLoading] = useState(false);

  const setFormInput = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const login = async () => {
    setLoading(true);
    const { username, password } = form;
    try {
      await Auth.signIn(username, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error!', error.message || 'An error has occured!');
    }
    setLoading(false);
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          value={form.username}
          onChangeText={(value) => setFormInput('username', value)}
          returnKeyType="next"
          placeholder="Username"
          style={{ marginBottom: 20 }}
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
          autoCapitalize={'none'}
          autoCorrect={false}
        />
        <TextInput
          value={form.password}
          onChangeText={(value) => setFormInput('password', value)}
          ref={passwordRef}
          returnKeyType="done"
          placeholder="Password"
          style={{ marginBottom: 30 }}
          secureTextEntry
          autoCapitalize={'none'}
          autoCorrect={false}
        />
        <Button loading={loading} title="Login" onPress={login} />
      </ScrollView>
    </GradientBackground>
  );
}
