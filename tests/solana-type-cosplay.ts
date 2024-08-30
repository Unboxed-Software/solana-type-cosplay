import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TypeCosplay } from "../target/types/type_cosplay";
import { expect } from "chai";

describe("type-cosplay", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TypeCosplay as Program<TypeCosplay>;

  const userAccount = anchor.web3.Keypair.generate();
  const newAdmin = anchor.web3.Keypair.generate();

  it("Initialize User Account", async () => {
    try {
      await program.methods
        .initializeUser()
        .accounts({
          newAccount: userAccount.publicKey,
        })
        .signers([userAccount])
        .rpc();
    } catch (error) {
      throw new Error(
        `Initialization of user account failed: ${error.message}`
      );
    }
  });

  it("Invoke update admin instruction with user account", async () => {
    try {
      await program.methods
        .updateAdmin()
        .accounts({
          adminConfig: userAccount.publicKey,
          newAdmin: newAdmin.publicKey,
        })
        .rpc();
    } catch (error) {
      throw new Error(
        `Invoking update admin instruction with user account failed: ${error.message}`
      );
    }
  });
});
