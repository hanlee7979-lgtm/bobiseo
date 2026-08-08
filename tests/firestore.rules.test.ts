import { before, after, test } from 'node:test'
import { readFileSync } from 'node:fs'
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'

let testEnv: RulesTestEnvironment

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'bobiseo-rules-test',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  })
})

after(async () => {
  await testEnv.cleanup()
})

test('본인은 자신의 users 문서를 생성할 수 있다', async () => {
  const alice = testEnv.authenticatedContext('alice')
  await assertSucceeds(
    alice.firestore().collection('users').doc('alice').set({ uid: 'alice', role: null })
  )
})

test('본인이라도 role 필드는 직접 수정할 수 없다', async () => {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await ctx
      .firestore()
      .collection('users')
      .doc('alice')
      .set({ uid: 'alice', role: null, isAdmin: false })
  })
  const alice = testEnv.authenticatedContext('alice')
  await assertFails(alice.firestore().collection('users').doc('alice').update({ role: 'agent' }))
})

test('관리자 커스텀 클레임이 있으면 role 필드를 수정할 수 있다', async () => {
  const admin = testEnv.authenticatedContext('admin-uid', { admin: true })
  await assertSucceeds(admin.firestore().collection('users').doc('alice').update({ role: 'agent' }))
})

test('다른 사람의 users 문서는 읽을 수 없다', async () => {
  const bob = testEnv.authenticatedContext('bob')
  await assertFails(bob.firestore().collection('users').doc('alice').get())
})

test('설계사는 자기 소유 고객카드를 만들 수 있다', async () => {
  const agentA = testEnv.authenticatedContext('agentA', { role: 'agent' })
  await assertSucceeds(
    agentA
      .firestore()
      .collection('contacts')
      .doc('c1')
      .set({ ownerAgentId: 'agentA', name: 'test' })
  )
})

test('다른 설계사는 남의 고객카드를 읽을 수 없다', async () => {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await ctx
      .firestore()
      .collection('contacts')
      .doc('c1')
      .set({ ownerAgentId: 'agentA', name: 'test' })
  })
  const agentB = testEnv.authenticatedContext('agentB', { role: 'agent' })
  await assertFails(agentB.firestore().collection('contacts').doc('c1').get())
})

test('로그인하지 않으면 고객카드를 만들 수 없다', async () => {
  const anon = testEnv.unauthenticatedContext()
  await assertFails(
    anon.firestore().collection('contacts').doc('c2').set({ ownerAgentId: 'agentA', name: 'x' })
  )
})
