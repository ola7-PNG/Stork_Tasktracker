import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../theme';
import StorkLogo from '../components/StorkLogo';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const handleSignUp = () => {
    // Stub — wire up real auth here
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top bar: back + logo */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={10}
            >
              <Ionicons name="arrow-back" size={22} color={colors.berry} />
            </Pressable>
            <StorkLogo width={56} />
            <View style={styles.backBtnSpacer} />
          </View>

          <View style={styles.head}>
            <Text style={styles.eyebrow}>Create account</Text>
            <Text style={styles.title}>
              Start your{'\n'}
              <Text style={styles.titleItalic}>journey.</Text>
            </Text>
            <Text style={styles.sub}>
              Join Stork and turn habits into rewards.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={[styles.input, focused === 'name' && styles.inputFocused]}
                value={name}
                onChangeText={setName}
                placeholder="Jane Smolina"
                placeholderTextColor={colors.berry60}
                autoCapitalize="words"
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, focused === 'email' && styles.inputFocused]}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.berry60}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.input,
                  styles.inputWithIcon,
                  focused === 'pwd' && styles.inputFocused,
                ]}
              >
                <TextInput
                  style={styles.inputInner}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  placeholderTextColor={colors.berry60}
                  secureTextEntry={!showPwd}
                  onFocus={() => setFocused('pwd')}
                  onBlur={() => setFocused(null)}
                />
                <Pressable onPress={() => setShowPwd(!showPwd)} hitSlop={10}>
                  <Ionicons
                    name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.berry60}
                  />
                </Pressable>
              </View>
            </View>

            {/* Terms checkbox */}
            <Pressable
              style={styles.termsRow}
              onPress={() => setAgreed(!agreed)}
              hitSlop={6}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
                {agreed && (
                  <Ionicons name="checkmark" size={14} color={colors.pink} />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                (!agreed || pressed) && { opacity: agreed ? 0.9 : 0.5 },
              ]}
              onPress={handleSignUp}
              disabled={!agreed}
            >
              <Text style={styles.primaryBtnText}>Create account</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.pink} />
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
              <Text style={styles.footerLink}>
                Sign <Text style={styles.footerLinkItalic}>in.</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 28 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  backBtnSpacer: { width: 40, height: 40 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.creamDark,
  },
  head: { marginTop: 28, marginBottom: 28 },
  eyebrow: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    color: colors.berry60,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 44,
    color: colors.berry,
    letterSpacing: -0.5,
    lineHeight: 46,
  },
  titleItalic: {
    fontFamily: fonts.displayBold,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.berry80,
    opacity: 0.7,
    marginTop: 10,
  },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.berry80,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.berry,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  inputInner: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.berry,
    paddingVertical: 10,
  },
  inputFocused: {
    borderColor: colors.berry,
    borderWidth: 1.5,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: {
    backgroundColor: colors.berry,
    borderColor: colors.berry,
  },
  termsText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.berry80,
    lineHeight: 18,
  },
  termsLink: {
    fontFamily: fonts.bodySemi,
    color: colors.berry,
    textDecorationLine: 'underline',
  },
  primaryBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.berry,
    paddingVertical: 16,
    borderRadius: 100,
    shadowColor: colors.berry,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryBtnText: {
    fontFamily: fonts.bodySemi,
    color: colors.pink,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.berry80,
  },
  footerLink: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.berry,
  },
  footerLinkItalic: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
  },
});
