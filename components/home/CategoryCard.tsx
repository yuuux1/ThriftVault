type CategoryCardProps = {
  name: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
};

export default function CategoryCard({
  name,
  icon: Icon,
  isActive,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-shrink-0
        w-32
        h-32
        border
        rounded-2xl
        flex
        flex-col
        items-center
        justify-center
        gap-3
        transition-all
        duration-300
        cursor-pointer
        outline-none
        ${
          isActive
            ? "border-2 border-[var(--thrift-teal)] bg-teal-50/40 shadow-[0_8px_20px_rgba(15,156,154,0.2)] -translate-y-1 scale-102"
            : "border-[rgba(15,156,154,0.18)] bg-[rgba(255,249,238,0.9)] hover:shadow-lg hover:-translate-y-1"
        }
      `}
    >
      <Icon
        size={32}
        className={`transition-colors duration-300 ${
          isActive ? "text-[var(--thrift-rose)] animate-[pulse_2s_infinite]" : "text-[var(--thrift-teal)]"
        }`}
      />

      <p
        className={`text-sm font-bold text-center transition-colors duration-300 ${
          isActive ? "text-[var(--thrift-teal)]" : "text-[rgba(23,53,58,0.86)]"
        }`}
      >
        {name}
      </p>
    </button>
  );
}