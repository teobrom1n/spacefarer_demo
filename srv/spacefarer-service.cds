using { galactic as g } from '../db/schema.cds';

@path: '/cosmic'
service SpacefarerService {

  /**
   * Spacefarer entity with Drafts enabled for Fiori
   * Protected with Row-Level Authorization:
   * - Commanders can see and manage all spacefarers.
   * - Officers can ONLY see and manage spacefarers from their own planet ($user.planet).
   */
  @odata.draft.enabled
  @restrict: [
    {
      grant: '*',
      to: 'GalacticCommander'
    },
    {
      grant: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'embark'],
      to: 'SpacefarerOfficer',
      where: 'originPlanet_code = $user.planet'
    }
  ]
  entity Spacefarers as projection on g.Spacefarers actions {
    action embark(
      @(
        title : 'Destination Planet',
        Common.ValueList : {
          CollectionPath : 'Planets',
          Parameters : [
            {
              $Type : 'Common.ValueListParameterInOut',
              LocalDataProperty : destinationPlanet,
              ValueListProperty : 'code',
            },
            {
              $Type : 'Common.ValueListParameterDisplayOnly',
              ValueListProperty : 'name',
            },
            {
              $Type : 'Common.ValueListParameterDisplayOnly',
              ValueListProperty : 'sector',
            },
          ],
        }
      )
      destinationPlanet : String
    ) returns Spacefarers;
  };
  @readonly entity Planets     as projection on g.Planets;
  @readonly entity Departments as projection on g.Departments;
  @readonly entity Positions   as projection on g.Positions;
}