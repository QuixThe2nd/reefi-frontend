import { ReactNode, ReactElement } from "react"
import { InfoCard } from "./InfoCard"

export const Page = ({ children, info }: { children: ReactNode, info: string | string[] }): ReactElement => {
  return <div className="flex flex-col items-center gap-8 mt-8 lg:gap-12 lg:mt-12 xl:gap-16 xl:mt-16">
    <div className="max-w-192 w-full">{children}</div>
    <InfoCard text={info} />
  </div>
}
