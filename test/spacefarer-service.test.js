import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import cds from '@sap/cds';


const test = cds.test();

describe('SpacefarerService Business Logic Tests', () => {
  let srv;

  // Runs once before all tests
  before(async () => {
    srv = await cds.connect.to('SpacefarerService');
  });



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

 
  const [saved] = await tx.read('Spacefarers').where({ ID: id });
  assert.equal(saved.wormholeNavigationSkill, 40);
});

  it('should reject spacefarer creation if stardust is negative', async () => {
    const user = new cds.User({ id: 'commander', roles: ['GalacticCommander'] });
    const tx = srv.tx({ user });

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


    const updated = await tx.send({
      event: 'embark',
      entity: 'SpacefarerService.Spacefarers',
      params: [{ ID: id }],
      data: { destinationPlanet: 'PLANET_Y' }
    });

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
      wormholeNavigationSkill: 25
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