import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VotingModule = buildModule("VotingModule", (m) => {
  const title = m.getParameter("title", "My First ADI Chain Vote");
  const proposals = m.getParameter("proposals", ["Option A", "Option B", "Option C"]);

  const voting = m.contract("Voting", [title, proposals]);
  return { voting };
});

export default VotingModule;
