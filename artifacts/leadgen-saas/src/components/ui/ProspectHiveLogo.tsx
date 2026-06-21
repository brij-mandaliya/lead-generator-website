export function ProspectHiveLogo({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/prospecthive-logo.png"
      alt="ProspectHive logo"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
