export const queryKeys = {
  homeState: (homeId: string) => ["homeState", homeId] as const,
  homeSettings: (homeId: string) => ["homeSettings", homeId] as const,
};
