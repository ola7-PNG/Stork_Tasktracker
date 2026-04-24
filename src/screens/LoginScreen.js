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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSignIn = () => {
    // Stub — replace with real auth
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

          {/* Headline */}
          <View style={styles.head}>
            <Text style={styles.eyebrow}>Sign in</Text>
            <Text style={styles.title}>
              Welcome{'\n'}
              <Text style={styles.titleItalic}>back.</Text>
            </Text>
            <Text style={styles.sub}>Your berries are waiting.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <Pressable hitSlop={8}>
                  <Text style={styles.forgot}>Forgot?</Text>
                </Pressable>
              </View>
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
                  placeholder="••••••••"
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

            {/* Primary sign in */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleSignIn}
            >
              <Text style={styles.primaryBtnText}>Sign in</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.pink} />
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <Pressable style={styles.socialBtn}>
                <Ionicons name="logo-apple" size={22} color={colors.berry} />
                <Text style={styles.socialText}>Apple</Text>
              </Pressable>
              <Pressable style={styles.socialBtn}>
                <Ionicons name="logo-google" size={20} color={colors.berry} />
                <Text style={styles.socialText}>Google</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Stork? </Text>
            <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
              <Text style={styles.footerLink}>
                Create <Text style={styles.footerLinkItalic}>account.</Text>
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
  head: { marginTop: 28, marginBottom: 32 },
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
  form: { gap: 18 },
  inputGroup: { gap: 8 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.berry80,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  forgot: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.berry,
    textDecorationLine: 'underline',
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
  primaryBtn: {
    marginTop: 8,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.creamDark,
  },
  dividerText: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.berry60,
    letterSpacing: 0.5,
  },
  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamDark,
    paddingVertical: 14,
    borderRadius: 100,
  },
  socialText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.berry,
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
