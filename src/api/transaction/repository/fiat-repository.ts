import { Fiat } from '_transaction/model/fiat-model'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Fiat)
export class FiatRepository extends Repository<Fiat> {
  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }
}
