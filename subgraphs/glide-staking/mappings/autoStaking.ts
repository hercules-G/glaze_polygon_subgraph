import { AutoGlideStaking } from "../generated/schema";
import { Deposit, GlideVault, Withdraw} from "../generated/GlideVault/GlideVault";
import { BigInt } from "@graphprotocol/graph-ts"

export function handleDeposit(event: Deposit): void {
    let glideVaultContract = GlideVault.bind(event.address);

    let entity = AutoGlideStaking.load(event.params.sender.toHex())

    if (!entity) {
        entity = new AutoGlideStaking(event.params.sender.toHex())

        entity.shareAmount = BigInt.fromI32(0)
        entity.stakeAmount = BigInt.fromI32(0)
    }

    entity.shareAmount = entity.shareAmount.plus(event.params.shares)
    entity.stakeAmount = entity.shareAmount.times(glideVaultContract.getPricePerFullShare()).div(BigInt.fromI32(10).pow(18))

    entity.save()
}
  
export function handleWithdraw(event: Withdraw): void {
    let glideVaultContract = GlideVault.bind(event.address);
    let entity = AutoGlideStaking.load(event.params.sender.toHex())

    if (!entity) {
        entity = new AutoGlideStaking(event.params.sender.toHex())

        entity.shareAmount = BigInt.fromI32(0)
        entity.stakeAmount = BigInt.fromI32(0)
    }

    entity.shareAmount = entity.shareAmount.minus(event.params.shares)
    entity.stakeAmount = entity.shareAmount.times(glideVaultContract.getPricePerFullShare()).div(BigInt.fromI32(10).pow(18))

    entity.save()
}
