import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import cds from '@sap/cds';

// 1. cds.test() boots up the CAP server with SQLite in-memory and loads CSV data
const test = cds.test();

describe('SpacefarerService Business Logic Tests', () => {
  let srv;

  // Runs once before all tests
  before(async () => {
    srv = await cds.connect.to('SpacefarerService');
  });


  // TEST SUITE: Creation & Skill Boost

it('should boost navigation skill by +20 when stardust >= 500', async () => {
  const user = new cds.User({ id: 'commander', roles: ['GalacticCommander'] });
  const tx = srv.tx({ user });

  // 1. Arrange & Act: Assign an ID and create the record
  const id = cds.utils.uuid();
  await tx.create('Spacefarers').entries({
    ID: id,
    name: 'Test Navigator',
    email: 'nav@starfleet.galaxy',
    originPlanet_code: 'PLANET_X',
    stardustCollection: 520,
    wormholeNavigationSkill: 20
  });

  // 2. Assert: Read persisted record from DB to verify the before() enhancement
  const [saved] = await tx.read('Spacefarers').where({ ID: id });
  assert.equal(saved.wormholeNavigationSkill, 40);
});

  it('should reject spacefarer creation if stardust is negative', async () => {
    const user = new cds.User({ id: 'commander', roles: ['GalacticCommander'] });
    const tx = srv.tx({ user });

    // Act & Assert: Expect tx.create to throw a 400 error
    await assert.rejects(
      async () => {
        await tx.create('Spacefarers').entries({
          name: 'Negative Matter Bandit',
          originPlanet_code: 'PLANET_X',
          stardustCollection: -50
        });
      },
      (err) => {
        assert.equal(err.code, 400);
        assert.match(err.message, /Stardust collection cannot be negative/);
        return true;
      }
    );
  });

  it('should prevent Officer from enlisting spacefarers for another planet', async () => {
    // Arrange: Officer Alice belongs to PLANET_X
    const alice = new cds.User({
      id: 'alice',
      roles: ['SpacefarerOfficer'],
      attr: { planet: 'PLANET_X' }
    });
    const tx = srv.tx({ user: alice });

    // Act & Assert: Alice tries to enlist for PLANET_Y -> must return 403 Forbidden
    await assert.rejects(
      async () => {
        await tx.create('Spacefarers').entries({
          name: 'Smuggled Recruit',
          originPlanet_code: 'PLANET_Y'
        });
      },
      (err) => {
        assert.equal(err.code, 403);
        assert.match(err.message, /Forbidden/);
        return true;
      }
    );
  });


  // TEST SUITE: Embark Action

  it('should consume 50 grams of stardust and update deployment planet on embark', async () => {
    const user = new cds.User({ id: 'commander', roles: ['GalacticCommander'] });
    const tx = srv.tx({ user });

    // 1. Arrange: Create a spacefarer with 100 stardust and 50 skill
    const id = cds.utils.uuid();
    await tx.create('Spacefarers').entries({
      ID: id,
      name: 'Captain Kael',
      email: 'kael@starfleet.galaxy',
      originPlanet_code: 'PLANET_X',
      stardustCollection: 100,
      wormholeNavigationSkill: 50
    });

    // 2. Act: Call the embark action to PLANET_Y
    const updated = await tx.send({
      event: 'embark',
      entity: 'SpacefarerService.Spacefarers',
      params: [{ ID: id }],
      data: { destinationPlanet: 'PLANET_Y' }
    });

    // 3. Assert: 100 - 50 = 50 fuel remaining, deployed on PLANET_Y
    assert.equal(updated.stardustCollection, 50);
    assert.equal(updated.deploymentPlanet_code, 'PLANET_Y');
  });

  it('should abort embark if navigation skill is below 40', async () => {
    const user = new cds.User({ id: 'commander', roles: ['GalacticCommander'] });
    const tx = srv.tx({ user });

    const id = cds.utils.uuid();
    await tx.create('Spacefarers').entries({
      ID: id,
      name: 'Rookie Cadet',
      originPlanet_code: 'PLANET_X',
      stardustCollection: 100,
      wormholeNavigationSkill: 25 // Too low (< 40)
    });

    await assert.rejects(
      async () => {
        await tx.send({
          event: 'embark',
          entity: 'SpacefarerService.Spacefarers',
          params: [{ ID: id }],
          data: { destinationPlanet: 'PLANET_Y' }
        });
      },
      (err) => {
        assert.equal(err.code, 400);
        assert.match(err.message, /below minimum safe threshold/);
        return true;
      }
    );
  });
});