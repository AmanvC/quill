import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
});

interface HeaderProps {
  label: string;
  headerMessage?: string
};

export const HeaderComponent = ({ 
  headerMessage = "Continue with quill.",
  label
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn(
        "text-3xl font-semibold",
        font.className
      )}>
        {headerMessage}
      </h1>
      <p className="text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  )
}