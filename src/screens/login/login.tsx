import React, { ReactElement, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput as NativeTextInput } from 'react-native';
import { GradientBackground, TextInput, Button } from '@components';
import styles from './login.styles';
import { Auth } from 'aws-amplify';

export default function Login(): ReactElement {
  const passwordRef = useRef<NativeTextInput | null>(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const setFormInput = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const login = async () => {
    setLoading(true);
    const { username, password } = form;
    try {
      const res = await Auth.signIn(username, password);
      console.log(res);
    } catch (error) {
      console.log(error);
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
