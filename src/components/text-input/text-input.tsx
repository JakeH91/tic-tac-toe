import React, { ReactElement, forwardRef } from 'react';
import {
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputType,
} from 'react-native';
import styles from './text-input.styles';

const TextInput = forwardRef<NativeTextInput, NativeTextInputType>(
  ({ style, ...props }: NativeTextInputType, ref): ReactElement => {
    return (
      <NativeTextInput
        ref={ref}
        placeholderTextColor="#5d5379"
        style={[styles.input, style]}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
