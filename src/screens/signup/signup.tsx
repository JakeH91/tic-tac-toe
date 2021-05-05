import React, { ReactElement, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  TextInput as NativeTextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { GradientBackground, TextInput, Button, Text } from '@components';
import styles from './signup.styles';
import { Auth } from 'aws-amplify';
import OTPInput from '@twotalltotems/react-native-otp-input';
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack';
import { StackNavigatorParams } from '@config/navigator';
import { colors } from '@utils';

type SignUpProps = {
  navigation: StackNavigationProp<StackNavigatorParams, 'SignUp'>;
};

export default function SignUp({ navigation }: SignUpProps): ReactElement {
  const headerHeight = useHeaderHeight();
  const nameRef = useRef<NativeTextInput | null>(null);
  const emailRef = useRef<NativeTextInput | null>(null);
  const passwordRef = useRef<NativeTextInput | null>(null);
  const [form, setForm] = useState({
    username: 'test5',
    email: 'jillayne115@villagepxt.com',
    name: 'Test Name',
    password: '12345678',
  });
  const [step, setStep] = useState<'signUp' | 'otp'>('signUp');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [resending, setResending] = useState(false);

  const setFormInput = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const signup = async () => {
    setLoading(true);
    const { username, password, email, name } = form;
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          name,
        },
      });
      setStep('otp');
    } catch (error) {
      Alert.alert('Error!', error.message || 'An error has occured!');
    }
    setLoading(false);
  };

  const confirmCode = async (code: string) => {
    setConfirming(true);
    try {
      await Auth.confirmSignUp(form.username, code);
      navigation.navigate('Login');
      Alert.alert('Success!', 'You can now log in with your account.');
    } catch (error) {
      Alert.alert('Error!', error.message || 'An error has occured!');
    }
    setConfirming(false);
  };

  const resendCode = async (username: string) => {
    setResending(true);
    try {
      await Auth.resendSignUp(username);
    } catch (error) {
      Alert.alert('Error!', error.message || 'An error has occured!');
    }
    setResending(false);
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {step === 'otp' && (
            <>
              <Text style={styles.otpText}>
                Enter the code that you received via email
              </Text>
              {confirming ? (
                <ActivityIndicator color={colors.lightGreen} />
              ) : (
                <>
                  <OTPInput
                    style={{ height: 100 }}
                    pinCount={6}
                    placeholderCharacter="0"
                    placeholderTextColor="#5d5379"
                    codeInputFieldStyle={styles.otpInputBox}
                    codeInputHighlightStyle={styles.otpActiveInputBox}
                    onCodeFilled={(code) => {
                      confirmCode(code);
                    }}
                  />
                  {resending ? (
                    <ActivityIndicator color={colors.lightGreen} />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        resendCode(form.username);
                      }}
                    >
                      <Text style={styles.resendLink}>Resend Code</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}
          {step === 'signUp' && (
            <>
              <TextInput
                value={form.username}
                onChangeText={(value) => setFormInput('username', value)}
                returnKeyType="next"
                placeholder="Username"
                style={{ marginBottom: 20 }}
                onSubmitEditing={() => {
                  nameRef.current?.focus();
                }}
                autoCapitalize={'none'}
                autoCorrect={false}
              />
              <TextInput
                value={form.name}
                ref={nameRef}
                onChangeText={(value) => setFormInput('name', value)}
                returnKeyType="next"
                placeholder="Name"
                style={{ marginBottom: 20 }}
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
                autoCapitalize={'none'}
                autoCorrect={false}
              />
              <TextInput
                value={form.email}
                ref={emailRef}
                keyboardType="email-address"
                onChangeText={(value) => setFormInput('email', value)}
                returnKeyType="next"
                placeholder="Email"
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
              <Button loading={loading} title="Sign-Up" onPress={signup} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
