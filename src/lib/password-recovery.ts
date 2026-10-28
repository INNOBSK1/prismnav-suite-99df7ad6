export const recoveryCodePattern = /^\d{6,8}$/;

export function validRecoveryCode(code: string) {
  return recoveryCodePattern.test(code.trim());
}

export function validNewPassword(password: string, confirmation: string) {
  return password.length >= 6 && password.length <= 72 && password === confirmation;
}