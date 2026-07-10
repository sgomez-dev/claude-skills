---
description: Add biometric auth: Face/Touch ID, secure token storage, safe fallbacks
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Add biometric authentication (Face ID / Touch ID / Android biometrics) that is genuinely secure — backed by
the platform keystore and a real fallback — not a cosmetic check an attacker can bypass.

Steps:

1. **Detect the platform and clarify intent** (`$ARGUMENTS`)
   - Detect React Native, Flutter, or native iOS/Android from the repo
   - Clarify the goal: app unlock, step-up auth for sensitive actions, or replacing password login
   - Decide what biometrics gates — a local flag (weak) vs releasing a real secret/token (strong)

2. **Do it right: bind to the keystore**
   Store the sensitive token in the platform secure enclave (iOS Keychain with access control / Android Keystore
   + BiometricPrompt) so it is RELEASED only on successful biometric auth. A boolean "isAuthed" check is not security —
   the credential itself must be protected by the hardware.

3. **Implement the flow**
   Use the platform/library APIs (LocalAuthentication, AndroidX Biometric, or the RN/Flutter wrapper). Handle
   enrollment changes (new fingerprint added → invalidate), and check availability before offering it.

4. **Design fallbacks**
   Always provide a non-biometric path (PIN/passphrase/password) for: no enrolled biometrics, hardware absent,
   repeated failures, and lockout. Never trap the user out of their account.

5. **Handle the edge cases**
   Cover: user cancels, OS-level lockout after failures, backgrounding during the prompt, and jailbreak/root
   awareness for high-value apps. Decide re-auth frequency (every launch vs timeout).

6. **Test on real devices**
   Simulators don't fully replicate biometric hardware. Test enrollment changes, failure lockout, and the
   fallback path on both platforms.

**Notes:**
- Biometrics authorize LOCALLY — they don't authenticate to your server; still validate the session/token server-side
- Protect the actual secret with the keystore; a client-side boolean is trivially bypassed on a rooted device
- Pairs with `/mobile--react-native-scaffold` or `/fullstack--auth-flow` for the overall auth design

$ARGUMENTS
