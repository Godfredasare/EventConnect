import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView, ThemedText, Heading2, BodySmall, Button } from '@/components';
import { useColors } from '@/hooks';
import { spacing, radii } from '@/constants';

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const colors = useColors();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (value && index === OTP_LENGTH - 1) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length < OTP_LENGTH) return;
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      router.replace('/(auth)/user-type');
    }, 1500);
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  const displayPhone = phone ? phone.replace(/(\+233)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4') : '';

  return (
    <ThemedView>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.container}>
          <ThemedText style={{ fontSize: 48, alignSelf: 'center', marginBottom: spacing.lg }}>🔐</ThemedText>
          <Heading2 style={styles.title}>Verify Your Number</Heading2>
          <BodySmall color="textMuted" style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <ThemedText color="primary" weight="600">{displayPhone}</ThemedText>
          </BodySmall>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { if (ref) inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  {
                    backgroundColor: digit ? colors.primary + '15' : colors.surface,
                    borderColor: digit ? colors.primary : colors.border,
                    color: colors.text,
                  },
                ]}
                value={digit}
                onChangeText={(value) => handleCodeChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>

          {error ? (
            <ThemedText variant="caption" color="error" style={styles.errorText}>
              {error}
            </ThemedText>
          ) : null}

          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <BodySmall color="textMuted">
                Resend code in <ThemedText color="primary" weight="600">{timer}s</ThemedText>
              </BodySmall>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <BodySmall color="primary" weight="600">Resend Code</BodySmall>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.ctaSection}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => handleVerify(otp.join(''))}
              loading={loading}
              disabled={otp.join('').length < OTP_LENGTH}
            >
              Verify
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  ctaSection: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
});
