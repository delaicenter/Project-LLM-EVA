export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Login: undefined;
  SignUp: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}