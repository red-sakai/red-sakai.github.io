export type SiteTheme = "light" | "dark" | "rain";

export function themeBackground(theme: SiteTheme): string {
  switch (theme) {
    case "dark":
      return "#0b1220";
    case "rain":
      return "#1b3a66";
    default:
      return "#ffffff";
  }
}
