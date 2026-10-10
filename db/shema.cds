namespace galactic;

using { cuid, managed } from '@sap/cds/common';

/**
 * Main entity representing Galactic Spacefarers
 */
entity Spacefarers : cuid, managed {
  name                    : String(100) not null;
  email                   : String(100);
  stardustCollection      : Integer default 0;
  wormholeNavigationSkill : Integer default 10;
  spacesuitColor          : String(50);
  originPlanet            : Association to Planets;
  department              : Association to Departments;
  position                : Association to Positions;
}

/**
 * Celestial origin planets (including Planet X and Planet Y)
 */
entity Planets {
  key code : String(20); // e.g. 'PLANET_X', 'PLANET_Y'
  name     : String(100);
  sector   : String(50);
}

/**
 * Intergalactic departments
 */
entity Departments {
  key ID      : String(20);
  name        : String(100);
  description : String(255);
}

/**
 * Spacefaring positions/ranks
 */
entity Positions {
  key ID : String(20);
  title  : String(100);
}