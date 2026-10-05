/** Re-mounts on every navigation, so each page fades in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      {children}
    </div>
  );
}
