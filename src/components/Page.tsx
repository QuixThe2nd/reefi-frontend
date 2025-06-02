import { InfoCard } from "./InfoCard";
import { ReactElement, ReactNode } from "react";

export const Page = ({ children, info }: Readonly<{ children: ReactNode; info: string | string[] }>): ReactElement => <div className="mt-8 flex flex-col items-center lg:mt-12 xl:mt-16 w-full">
  <div className="w-full max-w-2xl">{children}</div>
  <InfoCard text={info} />
</div>;
