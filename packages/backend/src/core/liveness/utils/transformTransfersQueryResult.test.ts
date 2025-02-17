import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import { LivenessTransfer, makeLivenessTransfer } from '../types/LivenessConfig'
import { BigQueryTransfersResult } from '../types/model'
import { transformTransfersQueryResult } from './transformTransfersQueryResult'

describe(transformTransfersQueryResult.name, () => {
  it('should transform results', () => {
    const ADDRESS_1 = EthereumAddress.random()
    const ADDRESS_2 = EthereumAddress.random()
    const ADDRESS_3 = EthereumAddress.random()
    const ADDRESS_4 = EthereumAddress.random()
    const ADDRESS_5 = EthereumAddress.random()
    const ADDRESS_6 = EthereumAddress.random()
    const sinceTimestamp = UnixTime.now()

    const config: LivenessTransfer[] = [
      makeLivenessTransfer({
        formula: 'transfer',
        projectId: ProjectId('project1'),
        from: ADDRESS_1,
        to: ADDRESS_2,
        type: 'STATE',
        sinceTimestamp,
      }),
      makeLivenessTransfer({
        formula: 'transfer',
        projectId: ProjectId('project1'),
        from: ADDRESS_3,
        to: ADDRESS_4,
        type: 'DA',
        sinceTimestamp,
      }),
      makeLivenessTransfer({
        formula: 'transfer',
        projectId: ProjectId('project2'),
        from: ADDRESS_5,
        to: ADDRESS_6,
        type: 'STATE',
        sinceTimestamp,
      }),
    ]

    const timestamp = UnixTime.fromDate(new Date('2022-01-01T01:00:00Z'))
    const block = 1
    const txHashes = [
      '0x095e4e9ee709e353ad7849cf30e4dc19',
      '0x915d9ed63e196d8c612aad5d6f5cd1ba',
      '0x90d5e81b40d6a6fa6f34b3dc67d3fce6',
    ]

    const queryResults: BigQueryTransfersResult = [
      {
        transaction_hash: txHashes[0],
        block_number: block,
        block_timestamp: timestamp,
        from_address: ADDRESS_1,
        to_address: ADDRESS_2,
      },
      {
        transaction_hash: txHashes[1],
        block_number: block,
        block_timestamp: timestamp,
        from_address: ADDRESS_3,
        to_address: ADDRESS_4,
      },
      {
        transaction_hash: txHashes[2],
        block_number: block,
        block_timestamp: timestamp,
        from_address: ADDRESS_5,
        to_address: ADDRESS_6,
      },
    ]
    const expected: LivenessRecord[] = [
      {
        txHash: txHashes[0],
        livenessId: config[0].id,
        blockNumber: block,
        timestamp: timestamp,
      },
      {
        txHash: txHashes[1],
        livenessId: config[1].id,
        blockNumber: block,
        timestamp: timestamp,
      },
      {
        txHash: txHashes[2],
        livenessId: config[2].id,
        blockNumber: block,
        timestamp: timestamp,
      },
    ]

    expect(transformTransfersQueryResult(config, queryResults)).toEqual(
      expected,
    )
  })
})
