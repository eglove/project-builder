import { simpleGit } from "simple-git";

export const getHasChanges = async (branch: string): Promise<boolean> => {
  const diffSummary = await simpleGit()
    .fetch()
    .diffSummary([`origin/${branch}`]);

  return 0 < diffSummary.changed;
};
