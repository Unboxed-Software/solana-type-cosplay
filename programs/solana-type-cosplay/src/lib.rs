use anchor_lang::prelude::*;

declare_id!("AYij7hXhPU5bmm43F4Nq6iiUL9G5VaHERm6Twet4U15b");

#[program]
pub mod type_cosplay {
    use super::*;

    pub fn initialize_admin(ctx: Context<Initialize>) -> Result<()> {
        let space = AdminConfig::INIT_SPACE;
        let lamports = Rent::get()?.minimum_balance(space as usize);

        let ix = anchor_lang::solana_program::system_instruction::create_account(
            &ctx.accounts.payer.key(),
            &ctx.accounts.new_account.key(),
            lamports,
            space.try_into().unwrap(),
            &ctx.program_id,
        );

        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.new_account.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let mut account =
            AdminConfig::try_from_slice(&ctx.accounts.new_account.data.borrow()).unwrap();

        account.admin = ctx.accounts.payer.key();
        account.serialize(&mut *ctx.accounts.new_account.data.borrow_mut())?;

        msg!("Admin: {}", account.admin.to_string());
        Ok(())
    }

    pub fn initialize_user(ctx: Context<Initialize>) -> Result<()> {
        let space = User::INIT_SPACE;
        let lamports = Rent::get()?.minimum_balance(space as usize);

        let ix = anchor_lang::solana_program::system_instruction::create_account(
            &ctx.accounts.payer.key(),
            &ctx.accounts.new_account.key(),
            lamports,
            space.try_into().unwrap(),
            &ctx.program_id,
        );

        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.new_account.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let mut account = User::try_from_slice(&ctx.accounts.new_account.data.borrow()).unwrap();

        account.user = ctx.accounts.payer.key();
        account.serialize(&mut *ctx.accounts.new_account.data.borrow_mut())?;

        msg!("User: {}", account.user.to_string());
        Ok(())
    }

    pub fn update_admin(ctx: Context<UpdateAdmin>) -> Result<()> {
        let mut account =
            AdminConfig::try_from_slice(&ctx.accounts.admin_config.data.borrow()).unwrap();

        if ctx.accounts.admin.key() != account.admin {
            return Err(ProgramError::InvalidAccountData.into());
        }

        account.admin = ctx.accounts.new_admin.key();
        account.serialize(&mut *ctx.accounts.admin_config.data.borrow_mut())?;

        msg!("New Admin: {}", account.admin.to_string());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub new_account: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(mut)]
    /// CHECK: This account is not being validated by Anchor
    admin_config: UncheckedAccount<'info>,
    new_admin: SystemAccount<'info>,
    admin: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace)]
pub struct AdminConfig {
    admin: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace)]
pub struct User {
    user: Pubkey,
}
