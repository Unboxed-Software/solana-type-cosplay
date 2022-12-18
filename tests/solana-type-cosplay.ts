import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { TypeCosplay } from "../target/types/type_cosplay"
import { TypeChecked } from "../target/types/type_checked"
import { expect } from "chai"

describe("type-cosplay", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.TypeCosplay as Program<TypeCosplay>
  const programChecked = anchor.workspace.TypeChecked as Program<TypeChecked>

  const userAccount = anchor.web3.Keypair.generate()
  const newAdmin = anchor.web3.Keypair.generate()

  const userAccountChecked = anchor.web3.Keypair.generate()
  const adminAccountChecked = anchor.web3.Keypair.generate()

  it("Initialize User Account", async () => {
    await program.methods
      .initializeUser()
      .accounts({
        newAccount: userAccount.publicKey,
      })
      .signers([userAccount])
      .rpc()
  })

  it("Invoke update admin instruction with user account", async () => {
    await program.methods
      .updateAdmin()
      .accounts({
        adminConfig: userAccount.publicKey,
        newAdmin: newAdmin.publicKey,
      })
      .rpc()
  })

  it("Initialize type checked AdminConfig Account", async () => {
    await programChecked.methods
      .initializeAdmin()
      .accounts({
        adminConfig: adminAccountChecked.publicKey,
      })
      .signers([adminAccountChecked])
      .rpc()
  })

  it("Initialize type checked User Account", async () => {
    await programChecked.methods
      .initializeUser()
      .accounts({
        userAccount: userAccountChecked.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([userAccountChecked])
      .rpc()
  })

  it("Invoke update instruction using User Account", async () => {
    try {
      await programChecked.methods
        .updateAdmin()
        .accounts({
          adminConfig: userAccountChecked.publicKey,
          newAdmin: newAdmin.publicKey,
          admin: provider.wallet.publicKey,
        })
        .rpc()
    } catch (err) {
      expect(err)
      console.log(err)
    }
  })

  it("Invoke update instruction using AdminConfig Account", async () => {
    await programChecked.methods
      .updateAdmin()
      .accounts({
        adminConfig: adminAccountChecked.publicKey,
        newAdmin: newAdmin.publicKey,
        admin: provider.wallet.publicKey,
      })
      .rpc()
  })
})
