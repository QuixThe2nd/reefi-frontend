import { memo, type ReactElement } from "react";

interface Properties {
  readonly title: string;
  readonly detail: string;
}

export const TokenStat = memo(({ title, detail }: Properties): ReactElement => <div className="rounded-lg bg-gradient-to-r from-green-600/20 to-blue-600/20 px-2 py-1">
  <p className="text-xs text-gray-400">
    {title}
  </p>

  <p className="text-xs font-medium">
    {detail}
  </p>
</div>);
TokenStat.displayName = "TokenStat";
