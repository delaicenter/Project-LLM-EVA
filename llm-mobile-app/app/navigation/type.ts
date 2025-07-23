export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}