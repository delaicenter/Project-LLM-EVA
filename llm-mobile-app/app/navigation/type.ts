export type RootStackParamList = {
  Chat: undefined;
  Login: undefined;
  SignUp: undefined;
    Home: { userData: any };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}