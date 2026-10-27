export function canCreateAccount(termsRead: boolean, agreed: boolean) {
  return termsRead && agreed;
}