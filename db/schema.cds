namespace galactic;

using { cuid, managed } from '@sap/cds/common';

/**
 * Main entity representing Galactic Spacefarers
 */
entity Spacefarers : cuid, managed {
  @title : 'Name'
  name                    : String(100) not null;
  @title : 'E-mail'
  email                   : String(100);
  @title : 'Stardust Collection'
  stardustCollection      : Integer default 0;
  @title : 'Wormhole Navigation Skill'
  wormholeNavigationSkill : Integer default 10;
  @title : 'Spacesuit Color'
  spacesuitColor          : Association to Colors;
  @title : 'Origin Planet'
  originPlanet            : Association to Planets;
  @title : 'Department'
  department              : Association to Departments;
  @title : 'Position'
  position                : Association to Positions;
  @title: 'Current deployment'
  deploymentPlanet        : Association to Planets;
}

/**
 * Celestial origin planets (including Planet X and Planet Y)
 */
entity Planets {
  key code : String(20);
  @title : 'Name'
  name     : String(100);
  @title : 'Sector'
  sector   : String(50);
  @title : 'Distance from Sun'
  distanceFromSun : Integer default 10;
}

/**
 * Intergalactic departments
 */
entity Departments {
  key ID      : String(20);
  @title : 'Name'
  name        : String(100);
  @title : 'Description'
  description : String(255);
}

/**
 * Spacefaring positions/ranks
 */
entity Positions {
  key ID : String(20);
  @title : 'Title'
  title  : String(100);
}

/**
 * Spacesuit Colors
 */
entity Colors {
  key ID : Integer;
  @title : 'Name'
  name  : String(50);
}
