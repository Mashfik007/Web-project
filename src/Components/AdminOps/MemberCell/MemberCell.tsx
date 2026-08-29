export default function MemberCell({
  name,
  initials,
  avatarClass,
}: {
  name: string;
  initials: string;
  avatarClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="avatar avatar-placeholder">
        <div
          className={`w-9 rounded-full text-xs font-semibold ${avatarClass}`}
        >
          <span>{initials}</span>
        </div>
      </div>
      <span className="font-semibold">{name}</span>
    </div>
  );
}
